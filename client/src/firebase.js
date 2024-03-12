// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-e2036.firebaseapp.com",
  projectId: "mern-blog-e2036",
  storageBucket: "mern-blog-e2036.appspot.com",
  messagingSenderId: "472753259127",
  appId: "1:472753259127:web:57f0da076214673997fc72"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Path: client/src/firebase.js