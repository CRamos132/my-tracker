// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNI0ibgKSnjKztmmvUfTI__DsZMGTLuhM",
  authDomain: "my-tracker-8e054.firebaseapp.com",
  projectId: "my-tracker-8e054",
  storageBucket: "my-tracker-8e054.appspot.com",
  messagingSenderId: "959808772124",
  appId: "1:959808772124:web:bfd192a6f78162c092a7d9",
  measurementId: "G-G6H4R6Z0HG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
