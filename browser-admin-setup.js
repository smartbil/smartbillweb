/**
 * Manual Admin Setup - Browser Console Method
 * 
 * Copy and paste this into your browser console while on your app to set up admin access.
 * This uses your existing Firebase client SDK instead of the admin SDK.
 */

// Step 1: First, register or login to create a user account in your app

// Step 2: Copy this code and paste it in your browser console
const setupAdminAccess = async () => {
  try {
    console.log('🔧 Setting up admin access...');
    
    // Get current user from your auth store
    const authStore = JSON.parse(localStorage.getItem('admin-auth-storage') || '{}');
    
    if (!authStore.state?.user?.uid) {
      console.error('❌ No authenticated user found. Please login first.');
      console.log('💡 Steps:');
      console.log('1. Create an account or login to your app');
      console.log('2. Come back and run this script again');
      return;
    }
    
    const currentUser = authStore.state.user;
    console.log(`👤 Current user: ${currentUser.email}`);
    
    // Import Firebase (assuming it's available in your app)
    if (typeof firebase === 'undefined' && typeof window.firebase === 'undefined') {
      console.error('❌ Firebase not found. Make sure you\'re on a page with Firebase loaded.');
      return;
    }
    
    const db = firebase.firestore();
    
    // Update user document to add admin privileges
    await db.collection('users').doc(currentUser.uid).update({
      isAdmin: true,
      adminGrantedAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('✅ Admin privileges granted!');
    console.log('🔐 You can now access the admin dashboard.');
    console.log('🔄 Please refresh the page and try accessing /admin/dashboard');
    
  } catch (error) {
    console.error('❌ Error setting up admin:', error);
    console.log('💡 Alternative method: Use Firebase Console');
    console.log('1. Go to Firebase Console > Firestore Database');
    console.log('2. Find your user document in the "users" collection');
    console.log('3. Add a field: isAdmin = true');
  }
};

// Run the setup
console.log('🚀 Admin Setup Ready!');
console.log('📋 Instructions:');
console.log('1. Make sure you are logged in to your app');
console.log('2. Run: setupAdminAccess()');

// Make function available globally
window.setupAdminAccess = setupAdminAccess;
