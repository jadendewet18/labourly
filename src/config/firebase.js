import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqG_ZOCc7YrEkv-yRyg8mrFUsPX4kz53w",
  authDomain: "labourly-8b473.firebaseapp.com",
  projectId: "labourly-8b473",
  storageBucket: "labourly-8b473.firebasestorage.app",
  messagingSenderId: "468921748746",
  appId: "1:468921748746:web:ef09cd5c2d626c9bec3ef3"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);