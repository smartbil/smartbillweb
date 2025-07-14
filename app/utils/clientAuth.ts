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

export interface ClientUser {
  uid: string;
  email: string;
  username?: string;
  isActive: boolean;
  subscriptionStatus?: string;
  shopId?: string;
}

export async function verifyClientToken(token: string): Promise<ClientUser | null> {
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
    
    // Check if user account is active
    if (userData?.status === 'suspended' || userData?.status === 'deleted') {
      throw new Error('User account is suspended or deleted');
    }
    
    // Get shop data if exists
    let shopData = null;
    try {
      const shopDoc = await adminDb.collection('shops').doc(decodedToken.uid).get();
      if (shopDoc.exists) {
        shopData = shopDoc.data();
      }
    } catch {
      console.log(`No shop data for user ${decodedToken.uid}`);
    }
    
    return {
      uid: decodedToken.uid,
      email: decodedToken.email || userData?.email,
      username: userData?.username,
      isActive: userData?.status !== 'suspended',
      subscriptionStatus: userData?.subscriptionStatus || 'free',
      shopId: shopData?.id || decodedToken.uid
    };
  } catch (error) {
    console.error('Client token verification failed:', error);
    return null;
  }
}

export async function requireClientAuth(request: Request): Promise<ClientUser> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('No authorization token provided');
  }
  
  const token = authHeader.substring(7);
  const clientUser = await verifyClientToken(token);
  
  if (!clientUser) {
    throw new Error('Invalid or unauthorized token');
  }
  
  if (!clientUser.isActive) {
    throw new Error('User account is not active');
  }
  
  return clientUser;
}

export async function checkUserStatus(uid: string): Promise<{ isActive: boolean; status: string }> {
  try {
    const { adminDb } = initializeFirebaseAdmin();
    const userDoc = await adminDb.collection('users').doc(uid).get();
    const userData = userDoc.data();
    
    return {
      isActive: userData?.status !== 'suspended' && userData?.status !== 'deleted',
      status: userData?.status || 'active'
    };
  } catch (error) {
    console.error('Error checking user status:', error);
    return { isActive: false, status: 'error' };
  }
}

export async function updateUserLastActivity(uid: string): Promise<void> {
  try {
    const { adminDb } = initializeFirebaseAdmin();
    await adminDb.collection('users').doc(uid).update({
      lastActivity: new Date(),
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating user activity:', error);
  }
}

// Rate limiting for client actions
const clientRateLimitMap = new Map<string, { count: number; lastReset: number }>();
const CLIENT_RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const CLIENT_MAX_REQUESTS = 500; // Max requests per window for clients

export function checkClientRateLimit(identifier: string): boolean {
  const now = Date.now();
  const userLimit = clientRateLimitMap.get(identifier);
  
  if (!userLimit || now - userLimit.lastReset > CLIENT_RATE_LIMIT_WINDOW) {
    clientRateLimitMap.set(identifier, { count: 1, lastReset: now });
    return true;
  }
  
  if (userLimit.count >= CLIENT_MAX_REQUESTS) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

export function clearClientRateLimit(identifier: string): void {
  clientRateLimitMap.delete(identifier);
}

// Session validation
export async function validateUserSession(uid: string, tokenIat: number): Promise<boolean> {
  try {
    const { adminDb } = initializeFirebaseAdmin();
    const userDoc = await adminDb.collection('users').doc(uid).get();
    const userData = userDoc.data();
    
    // Check if user has been suspended since token was issued
    const lastStatusChange = userData?.lastStatusChange?.toDate?.() || new Date(0);
    const tokenIssuedAt = new Date(tokenIat * 1000);
    
    if (lastStatusChange > tokenIssuedAt && userData?.status === 'suspended') {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating session:', error);
    return false;
  }
}
