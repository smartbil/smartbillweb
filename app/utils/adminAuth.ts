import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Lazy initialization to avoid issues with Edge Runtime
let adminAuth: Auth | null = null;
let adminDb: Firestore | null = null;

function initializeFirebaseAdmin() {
  if (!adminAuth || !adminDb) {
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }
    
    adminAuth = getAuth();
    adminDb = getFirestore();
  }
  
  return { adminAuth, adminDb };
}

export interface AdminUser {
  uid: string;
  email: string;
  username?: string;
  isAdmin: boolean;
}

export async function verifyAdminToken(token: string): Promise<AdminUser | null> {
  try {
    const { adminAuth, adminDb } = initializeFirebaseAdmin();
    
    // Verify the Firebase token
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // Get user data from Firestore
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      throw new Error('User document not found');
    }
    
    const userData = userDoc.data();
    
    // Check if user is admin
    if (!userData?.isAdmin) {
      throw new Error('User is not an admin');
    }
    
    return {
      uid: decodedToken.uid,
      email: decodedToken.email || userData.email,
      username: userData.username,
      isAdmin: true
    };
  } catch (error) {
    console.error('Admin token verification failed:', error);
    return null;
  }
}

export async function requireAdminAuth(request: Request): Promise<AdminUser> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('No authorization token provided');
  }
  
  const token = authHeader.substring(7);
  const adminUser = await verifyAdminToken(token);
  
  if (!adminUser) {
    throw new Error('Invalid or unauthorized token');
  }
  
  return adminUser;
}

export async function checkAdminRole(uid: string): Promise<boolean> {
  try {
    const { adminDb } = initializeFirebaseAdmin();
    const userDoc = await adminDb.collection('users').doc(uid).get();
    const userData = userDoc.data();
    return userData?.isAdmin === true;
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
}

export async function setAdminRole(uid: string, isAdmin: boolean = true): Promise<void> {
  try {
    const { adminDb } = initializeFirebaseAdmin();
    await adminDb.collection('users').doc(uid).update({
      isAdmin,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error setting admin role:', error);
    throw error;
  }
}

// Rate limiting for admin actions
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // Max requests per window

export function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);
  
  if (!userLimit || now - userLimit.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(identifier, { count: 1, lastReset: now });
    return true;
  }
  
  if (userLimit.count >= MAX_REQUESTS) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

export function clearRateLimit(identifier: string): void {
  rateLimitMap.delete(identifier);
}
