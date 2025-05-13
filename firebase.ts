// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3AcPFknXa8O50pMuOXn0KkjIWVEW8hxg",
  authDomain: "smartbill-6f28e.firebaseapp.com",
  projectId: "smartbill-6f28e",
  storageBucket: "smartbill-6f28e.firebasestorage.app",
  messagingSenderId: "265425021635",
  appId: "1:265425021635:web:9cef4e385172869f17d076"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, collection, addDoc, ref, uploadBytes };
