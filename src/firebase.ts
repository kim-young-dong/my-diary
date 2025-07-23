// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmIch0HDK7y1JBJ68GLs3lxRgTKXP2SAg",
  authDomain: "my-diary-8bb40.firebaseapp.com",
  projectId: "my-diary-8bb40",
  storageBucket: "my-diary-8bb40.firebasestorage.app",
  messagingSenderId: "1042256705337",
  appId: "1:1042256705337:web:8701d4abcc295314585ae8",
  measurementId: "G-386F675YH3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
