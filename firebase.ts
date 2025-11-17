// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqDk0GiDmLUDh0XCwNMyZCKnnKrTy97so",
  authDomain: "controle-cd4f0.firebaseapp.com",
  projectId: "controle-cd4f0",
  storageBucket: "controle-cd4f0.firebasestorage.app",
  messagingSenderId: "1098616619022",
  appId: "1:1098616619022:web:d75ccad7d2745085983c5f",
  measurementId: "G-WR1BST2DN4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);