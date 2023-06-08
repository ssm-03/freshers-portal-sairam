import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import { getFirestore, getDoc, doc, setDoc, getDocs, collection } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyCTl3BDu7zVmy9QLqMDao31c6ZVOCeghM4",
    authDomain: "sairam-freshers.firebaseapp.com",
    projectId: "sairam-freshers",
    storageBucket: "sairam-freshers.appspot.com",
    messagingSenderId: "60215698703",
    appId: "1:60215698703:web:f33b8689373865bf5b8a7a"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { auth, signInWithEmailAndPassword, onAuthStateChanged, signOut, setPersistence, browserSessionPersistence, db, getDoc, doc, setDoc, collection, getDocs }