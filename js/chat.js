import { db, collection, addDoc, query, onSnapshot } from './firebase-config.js';

function sendMessage(message) {
    const botNames = ["Bot_1", "Bot_2", "Bot_3"];
    const sender = botNames[Math.floor(Math.random() * botNames.length)];
    
    addDoc(collection(db, 'chat'), {
        sender: sender,
        message: message,
        timestamp: new Date()
    });
}

function listenToMessages() {
    const q = query(collection(db, 'chat'));
    onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach(change => {
            if (change.type === "added") {
                const msg = change.doc.data();
                console.log(`${msg.sender}: ${msg.message}`);
            }
        });
    });
}

// بوتات تتحدث تلقائيًا
setInterval(() => {
    const messages = [
        "BlitzBet أفضل موقع مراهنات على الإطلاق!",
        "فزت اليوم بمبلغ كبير جدًا 💸🔥",
        "حاول اللعب في الروليت.. فرصة كبيرة للربح!",
        "شكراً BlitzBet على السحب السريع!"
    ];
    sendMessage(messages[Math.floor(Math.random() * messages.length)]);
}, 5000);
