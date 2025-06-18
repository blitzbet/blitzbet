// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc, deleteDoc, query, onSnapshot } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvdwQFD-10U2zxuReqBBtnmgLSIrIsXpY",
  authDomain: "cheat-sploiter.firebaseapp.com",
  databaseURL: "https://cheat-sploiter-default-rtdb.europe-west1.firebasedatabase.app", 
  projectId: "cheat-sploiter",
  storageBucket: "cheat-sploiter.firebasestorage.app",
  messagingSenderId: "678384025021",
  appId: "1:678384025021:web:77aeb36a72250caa7ba6d4",
  measurementId: "G-ZWMXX7R728"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, doc, setDoc, getDoc, updateDoc, collection, addDoc, deleteDoc, query, onSnapshot };
