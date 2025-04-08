// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAqJrHRH8_-wXLZZzH2wlQbjMAEJlvXvVA",
    authDomain: "akilli-sehir-rehberi-mobil.firebaseapp.com",
    projectId: "akilli-sehir-rehberi-mobil",
    storageBucket: "akilli-sehir-rehberi-mobil.firebasestorage.app",
    messagingSenderId: "100839965102",
    appId: "1:100839965102:web:1170135bf45ba3b755483f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase servisleri dışa aktar
export const auth = getAuth(app);
export const db = getFirestore(app);
