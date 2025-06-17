import { 
  db, ref, get, set, update, remove, push, onValue,
  auth, signOut 
} from './firebase.js';

// تسجيل خروج الأدمن
document.getElementById('admin-logout')?.addEventListener('click', async (e) => {
  e.preventDefault();
  
  try {
    await signOut(auth);
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Error signing out:', error);
    alert('حدث خطأ أثناء تسجيل الخروج: ' + error.message);
  }
});

// تبديل بين علامات التبويب
document.querySelectorAll('.admin-menu li').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.admin-menu li').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    tab.classList.add('active');
    document.getElementById(`${tab.getAttribute('data-tab')}-tab`).classList.add('active');
    
    // تحميل المحتوى عند التبديل
    switch(tab.getAttribute('data-tab')) {
      case 'users':
        loadUsers();
        break;
      case 'games':
        loadGames();
        break;
      case 'transactions':
        loadTransactions();
        break;
      case 'settings':
        loadSettings();
        break;
      case 'agents':
        loadAgents();
        break;
    }
  });
});

// تحميل الإحصائيات
function loadDashboardStats() {
  // إجمالي المستخدمين
  get(ref(db, 'users')).then(s
