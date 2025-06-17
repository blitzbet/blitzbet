// Import the functions you need from the Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, set, get, update, remove, push, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// Your web app's Firebase configuration
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
const db = getDatabase(app);
const auth = getAuth(app);

// Export Firebase services
export { 
  db, ref, set, get, update, remove, push, onValue,
  auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut 
};
