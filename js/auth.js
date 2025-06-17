import { 
  auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
  db, ref, set, get, push
} from './firebase.js';

// توليد ID عشوائي مكون من 9 أرقام
function generateUserId() {
  return Math.floor(100000000 + Math.random() * 900000000).toString();
}

// تسجيل مستخدم جديد
document.getElementById('register-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = generateUserId();
    
    // حفظ بيانات المستخدم في قاعدة البيانات
    await set(ref(db, 'users/' + userCredential.user.uid), {
      userId: userId,
      name: name,
      email: email,
      balance: 0,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    });
    
    alert('تم إنشاء الحساب بنجاح!');
    window.location.reload();
  } catch (error) {
    console.error('Error registering user:', error);
    alert('حدث خطأ أثناء التسجيل: ' + error.message);
  }
});

// تسجيل الدخول
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert('تم تسجيل الدخول بنجاح!');
    window.location.reload();
  } catch (error) {
    console.error('Error signing in:', error);
    alert('خطأ في تسجيل الدخول: ' + error.message);
  }
});

// تسجيل الخروج
document.getElementById('logout-btn')?.addEventListener('click', async (e) => {
  e.preventDefault();
  
  try {
    await signOut(auth);
    alert('تم تسجيل الخروج بنجاح!');
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Error signing out:', error);
    alert('حدث خطأ أثناء تسجيل الخروج: ' + error.message);
  }
});

// تبديل بين نموذج التسجيل وتسجيل الدخول
document.getElementById('toggle-register')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-form').style.display = 'block';
  document.getElementById('toggle-auth').innerHTML = 'لديك حساب بالفعل؟ <a href="#" id="toggle-login">سجل الدخول</a>';
  
  document.getElementById('toggle-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('toggle-auth').innerHTML = 'ليس لديك حساب؟ <a href="#" id="toggle-register">سجل الآن</a>';
  });
});

// عرض سياسة الخصوصية
document.getElementById('privacy-link')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('privacy-modal').style.display = 'block';
});

// إغلاق سياسة الخصوصية
document.querySelector('.close-privacy')?.addEventListener('click', () => {
  document.getElementById('privacy-modal').style.display = 'none';
});

// التحقق من حالة المصادقة وعرض المحتوى المناسب
auth.onAuthStateChanged((user) => {
  if (user) {
    // المستخدم مسجل الدخول
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    
    // جلب بيانات المستخدم وعرضها
    get(ref(db, 'users/' + user.uid)).then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        document.getElementById('user-balance').textContent = userData.balance.toFixed(2) + ' جنيه';
      }
    });
  } else {
    // المستخدم غير مسجل الدخول
    document.getElementById('auth-container').style.display = 'flex';
    document.getElementById('main-content').style.display = 'none';
  }
});

// القائمة المنسدلة للمستخدم
document.getElementById('user-menu')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('dropdown-menu').classList.toggle('show');
});

// إغلاق القائمة المنسدلة عند النقر خارجها
window.addEventListener('click', (e) => {
  if (!e.target.matches('#user-menu')) {
    const dropdown = document.getElementById('dropdown-menu');
    if (dropdown?.classList.contains('show')) {
      dropdown.classList.remove('show');
    }
  }
});

// فتح صفحة الإيداع
document.getElementById('deposit-btn')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = 'deposit.html';
});

// فتح صفحة السحب
document.getElementById('withdraw-btn')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = 'withdraw.html';
});
