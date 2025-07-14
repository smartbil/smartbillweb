/**
 * Admin Setup Utility
 * 
 * This utility script helps set up admin privileges for users.
 * Use this during initial setup or to grant admin access to specific users.
 * 
 * IMPORTANT: This should only be run in a secure environment with proper Firebase Admin credentials.
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
function initializeFirebaseAdmin() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
  return getFirestore();
}

/**
 * Set admin privileges for a user by email
 * @param email - The email of the user to make admin
 * @returns Promise<boolean> - Success status
 */
export async function setAdminByEmail(email: string): Promise<boolean> {
  try {
    const adminDb = initializeFirebaseAdmin();
    
    // Find user by email
    const usersSnapshot = await adminDb.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.error(`User with email ${email} not found`);
      return false;
    }

    const userDoc = usersSnapshot.docs[0];
    await userDoc.ref.update({
      isAdmin: true,
      adminGrantedAt: new Date(),
      updatedAt: new Date()
    });

    console.log(`✅ Admin privileges granted to ${email}`);
    return true;
  } catch (error) {
    console.error(`❌ Error setting admin privileges for ${email}:`, error);
    return false;
  }
}

/**
 * Set admin privileges for a user by UID
 * @param uid - The UID of the user to make admin
 * @returns Promise<boolean> - Success status
 */
export async function setAdminByUID(uid: string): Promise<boolean> {
  try {
    const adminDb = initializeFirebaseAdmin();
    
    await adminDb.collection('users').doc(uid).update({
      isAdmin: true,
      adminGrantedAt: new Date(),
      updatedAt: new Date()
    });

    console.log(`✅ Admin privileges granted to user ${uid}`);
    return true;
  } catch (error) {
    console.error(`❌ Error setting admin privileges for ${uid}:`, error);
    return false;
  }
}

/**
 * Remove admin privileges from a user by email
 * @param email - The email of the user to remove admin privileges from
 * @returns Promise<boolean> - Success status
 */
export async function removeAdminByEmail(email: string): Promise<boolean> {
  try {
    const adminDb = initializeFirebaseAdmin();
    
    const usersSnapshot = await adminDb.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.error(`User with email ${email} not found`);
      return false;
    }

    const userDoc = usersSnapshot.docs[0];
    await userDoc.ref.update({
      isAdmin: false,
      adminRevokedAt: new Date(),
      updatedAt: new Date()
    });

    console.log(`✅ Admin privileges revoked from ${email}`);
    return true;
  } catch (error) {
    console.error(`❌ Error removing admin privileges from ${email}:`, error);
    return false;
  }
}

/**
 * List all current admin users
 * @returns Promise<any[]> - Array of admin users
 */
export async function listAdminUsers(): Promise<any[]> {
  try {
    const adminDb = initializeFirebaseAdmin();
    
    const adminsSnapshot = await adminDb.collection('users')
      .where('isAdmin', '==', true)
      .get();

    const admins = adminsSnapshot.docs.map((doc: any) => ({
      uid: doc.id,
      ...doc.data()
    })) as any[];

    console.log(`📋 Found ${admins.length} admin users:`);
    admins.forEach(admin => {
      console.log(`  - ${admin.email || 'No email'} (${admin.username || 'No username'})`);
    });

    return admins;
  } catch (error) {
    console.error('❌ Error listing admin users:', error);
    return [];
  }
}

/**
 * Example usage script
 * Uncomment and modify as needed for your setup
 */
export async function setupAdmins() {
  console.log('🚀 Starting admin setup...');
  
  // Example: Set admin privileges for specific emails
  // await setAdminByEmail('admin@smartbill.com');
  // await setAdminByEmail('manager@smartbill.com');
  
  // List current admins
  await listAdminUsers();
  
  console.log('✅ Admin setup completed');
}

// Uncomment to run the setup when this file is executed
// setupAdmins().catch(console.error);
