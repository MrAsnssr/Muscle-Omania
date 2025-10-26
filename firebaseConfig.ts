// FIX: Switched to Firebase v9 compatibility layer to match v8 syntax.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPS7VtrZekK2yLc1RlG0VmRZxmZJFPts4",
  authDomain: "muscle-mania-35c83.firebaseapp.com",
  projectId: "muscle-mania-35c83",
  storageBucket: "muscle-mania-35c83.firebasestorage.app",
  messagingSenderId: "47976884393",
  appId: "1:47976884393:web:dfafbc3048dd5c0bd0e1b8",
  measurementId: "G-YVB3B9E1C7"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Export Firebase services
export const auth = firebase.auth();
export const db = firebase.firestore();