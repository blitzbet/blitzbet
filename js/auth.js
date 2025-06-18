import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, doc, setDoc } from './firebase-config.js';

function generateUserId() {
    return Math.floor(100000000 + Math.random() * 900000000).toString();
}

async function register() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userId = generateUserId();

        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            userId: userId,
            username: username,
            email: email,
            balance: 0,
            createdAt: new Date()
        });

        alert("تم التسجيل بنجاح!");
        window.location.href = "casino.html";
    } catch (error) {
        alert("خطأ: " + error.message);
    }
}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert("تم الدخول بنجاح!");
        window.location.href = "casino.html";
    } catch (error) {
        alert("خطأ: " + error.message);
    }
}
