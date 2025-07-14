/**
 * First Admin Setup Script
 * Run this script to create your first admin user
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

async function setupFirstAdmin() {
  try {
    const adminDb = initializeFirebaseAdmin();
    
    console.log('🔍 Looking for existing users...');
    
    // Get all users
    const usersSnapshot = await adminDb.collection('users').limit(10).get();
    
    if (usersSnapshot.empty) {
      console.log('❌ No users found in database.');
      console.log('💡 Please register a user account first, then run this script again.');
      return;
    }
    
    console.log(`📋 Found ${usersSnapshot.size} users:`);
    
    const users = usersSnapshot.docs.map((doc, index) => {
      const data = doc.data();
      console.log(`${index + 1}. ${data.email || 'No email'} (${data.username || 'No username'}) - Admin: ${data.isAdmin ? 'Yes' : 'No'}`);
      return {
        uid: doc.id,
        email: data.email,
        username: data.username,
        isAdmin: data.isAdmin || false
      };
    });
    
    // Check if any admin already exists
    const existingAdmin = users.find(user => user.isAdmin);
    if (existingAdmin) {
      console.log(`✅ Admin user already exists: ${existingAdmin.email}`);
      return;
    }
    
    // Make the first user admin
    const firstUser = users[0];
    if (firstUser) {
      await adminDb.collection('users').doc(firstUser.uid).update({
        isAdmin: true,
        adminGrantedAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log(`✅ Made ${firstUser.email || firstUser.username} an admin!`);
      console.log('🔐 You can now access the admin dashboard with this account.');
    }
    
  } catch (error) {
    console.error('❌ Error setting up admin:', error);
    
    if (error instanceof Error && error.message.includes('credential')) {
      console.log('💡 Make sure your Firebase environment variables are set:');
      console.log('   - FIREBASE_PROJECT_ID');
      console.log('   - FIREBASE_CLIENT_EMAIL');
      console.log('   - FIREBASE_PRIVATE_KEY');
    }
  }
}

// Run the setup
setupFirstAdmin().catch(console.error);
