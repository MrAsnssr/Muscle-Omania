// FIX: Switched to Firebase v9 compatibility layer to match v8 syntax.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


// =================================================================================
// 🔥🔥🔥 ACTION REQUIRED 🔥🔥🔥
// =================================================================================
//
// Your Firebase config has been updated with the keys you provided.
// Make sure these are your actual project keys from the Firebase Console.
//
// --- How to get your Firebase config ---
// 1. Go to your project in the Firebase Console.
// 2. Click the Gear icon (⚙️) -> Project settings.
// 3. In the "General" tab, scroll down to "Your apps".
// 4. Find the `firebaseConfig` object and copy the values here.
//
// =================================================================================


// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDPS7VtrZekK2yLc1RlG0VmRZxmZJFPts4",
  authDomain: "muscle-mania-35c83.firebaseapp.com",
  projectId: "muscle-mania-35c83",
  storageBucket: "muscle-mania-35c83.appspot.com",
  messagingSenderId: "47976884393",
  appId: "1:47976884393:web:dfafbc3048dd5c0bd0e1b8",
  measurementId: "G-YVB3B9E1C7"
};


// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Export Firebase services
export const auth = firebase.auth();
export const db = firebase.firestore();