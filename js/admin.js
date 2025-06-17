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
  get(ref(db, 'users')).then(snapshot => {
    const userCount = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
    document.getElementById('total-users').textContent = userCount;
  });
  
  // إجمالي الإيداعات
  get(ref(db, 'transactions')).then(snapshot => {
    let totalDeposits = 0;
    
    if (snapshot.exists()) {
      const transactions = snapshot.val();
      
      Object.values(transactions).forEach(transaction => {
        if (transaction.type === 'deposit' && transaction.status === 'completed') {
          totalDeposits += transaction.amount;
        }
      });
    }
    
    document.getElementById('total-deposits').textContent = totalDeposits.toFixed(2) + ' جنيه';
  });
  
  // إجمالي السحوبات
  get(ref(db, 'transactions')).then(snapshot => {
    let totalWithdrawals = 0;
    
    if (snapshot.exists()) {
      const transactions = snapshot.val();
      
      Object.values(transactions).forEach(transaction => {
        if (transaction.type === 'withdrawal' && transaction.status === 'completed') {
          totalWithdrawals += transaction.amount;
        }
      });
    }
    
    document.getElementById('total-withdrawals').textContent = totalWithdrawals.toFixed(2) + ' جنيه';
  });
  
  // صافي الأرباح
  get(ref(db, 'platform/profit')).then(snapshot => {
    const profit = snapshot.exists() ? snapshot.val() : 0;
    document.getElementById('net-profit').textContent = profit.toFixed(2) + ' جنيه';
  });
  
  // آخر النشاطات
  get(ref(db, 'activity')).then(snapshot => {
    const activityList = document.getElementById('activity-list');
    activityList.innerHTML = '';
    
    if (snapshot.exists()) {
      const activities = snapshot.val();
      
      Object.keys(activities).reverse().slice(0, 10).forEach(activityId => {
        const activity = activities[activityId];
        
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
          <div class="activity-message">${activity.message}</div>
          <div class="activity-date">${new Date(activity.timestamp).toLocaleString()}</div>
        `;
        
        activityList.appendChild(activityItem);
      });
    } else {
      activityList.innerHTML = '<p>لا توجد نشاطات مسجلة</p>';
    }
  });
}

// تحميل المستخدمين
function loadUsers() {
  get(ref(db, 'users')).then(snapshot => {
    const usersList = document.getElementById('users-list');
    usersList.innerHTML = '';
    
    if (snapshot.exists()) {
      const users = snapshot.val();
      
      Object.keys(users).forEach(userId => {
        const user = users[userId];
        
        const userRow = document.createElement('tr');
        userRow.innerHTML = `
          <td>${user.userId}</td>
          <td>${user.name || 'بدون اسم'}</td>
          <td>${user.email}</td>
          <td>${user.balance?.toFixed(2) || '0.00'} جنيه</td>
          <td>${new Date(user.createdAt).toLocaleDateString()}</td>
          <td>
            <button class="edit-user" data-user-id="${userId}"><i class="fas fa-edit"></i></button>
            <button class="delete-user" data-user-id="${userId}"><i class="fas fa-trash"></i></button>
            <button class="adjust-balance" data-user-id="${userId}"><i class="fas fa-coins"></i></button>
          </td>
        `;
        
        usersList.appendChild(userRow);
      });
      
      // إضافة مستمعات الأحداث للأزرار
      document.querySelectorAll('.edit-user').forEach(button => {
        button.addEventListener('click', (e) => {
          const userId = e.target.closest('button').getAttribute('data-user-id');
          editUser(userId);
        });
      });
      
      document.querySelectorAll('.delete-user').forEach(button => {
        button.addEventListener('click', (e) => {
          const userId = e.target.closest('button').getAttribute('data-user-id');
          deleteUser(userId);
        });
      });
      
      document.querySelectorAll('.adjust-balance').forEach(button => {
        button.addEventListener('click', (e) => {
          const userId = e.target.closest('button').getAttribute('data-user-id');
          adjustUserBalance(userId);
        });
      });
    } else {
      usersList.innerHTML = '<tr><td colspan="6">لا يوجد مستخدمين مسجلين</td></tr>';
    }
  });
}

// تحميل الألعاب
function loadGames() {
  get(ref(db, 'games')).then(snapshot => {
    const gamesContainer = document.getElementById('games-container');
    gamesContainer.innerHTML = '';
    
    if (snapshot.exists()) {
      const games = snapshot.val();
      
      Object.keys(games).forEach(gameId => {
        const game = games[gameId];
        
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
          <img src="${game.image}" alt="${game.name}" class="game-image">
          <h3 class="game-name">${game.name}</h3>
          <p class="game-description">${game.description}</p>
          <div class="game-actions">
            <button class="edit-game" data-game-id="${gameId}"><i class="fas fa-edit"></i> تعديل</button>
            <button class="delete-game" data-game-id="${gameId}"><i class="fas fa-trash"></i> حذف</button>
            <button class="adjust-odds" data-game-id="${gameId}"><i class="fas fa-percentage"></i> ضبط الاحتمالات</button>
          </div>
        `;
        
        gamesContainer.appendChild(gameCard);
      });
      
      // إضافة مستمعات الأحداث للأزرار
      document.querySelectorAll('.edit-game').forEach(button => {
        button.addEventListener('click', (e) => {
          const gameId = e.target.closest('button').getAttribute('data-game-id');
          editGame(gameId);
        });
      });
      
      document.querySelectorAll('.delete-game').forEach(button => {
        button.addEventListener('click', (e) => {
          const gameId = e.target.closest('button').getAttribute('data-game-id');
          deleteGame(gameId);
        });
      });
      
      document.querySelectorAll('.adjust-odds').forEach(button => {
        button.addEventListener('click', (e) => {
          const gameId = e.target.closest('button').getAttribute('data-game-id');
          adjustGameOdds(gameId);
        });
      });
    } else {
      gamesContainer.innerHTML = '<p>لا توجد ألعاب متاحة</p>';
    }
  });
}

// تحميل المعاملات
function loadTransactions() {
  get(ref(db, 'transactions')).then(snapshot => {
    const transactionsList = document.getElementById('transactions-list');
    transactionsList.innerHTML = '';
    
    if (snapshot.exists()) {
      const transactions = snapshot.val();
      
      Object.keys(transactions).reverse().forEach(transactionId => {
        const transaction = transactions[transactionId];
        
        const transactionRow = document.createElement('tr');
        transactionRow.innerHTML = `
          <td>${transactionId.substring(0, 8)}</td>
          <td>${transaction.userId}</td>
          <td>${transaction.type === 'deposit' ? 'إيداع' : 'سحب'}</td>
          <td>${transaction.amount.toFixed(2)} جنيه</td>
          <td>${getPaymentMethodName(transaction.method)}</td>
          <td class="${transaction.status}">${getStatusName(transaction.status)}</td>
          <td>${new Date(transaction.date).toLocaleDateString()}</td>
          <td>
            ${transaction.status === 'pending' ? `
              <button class="approve-transaction" data-transaction-id="${transactionId}"><i class="fas fa-check"></i></button>
              <button class="reject-transaction" data-transaction-id="${transactionId}"><i class="fas fa-times"></i></button>
            ` : ''}
          </td>
        `;
        
        transactionsList.appendChild(transactionRow);
      });
      
      // إضافة مستمعات الأحداث للأزرار
      document.querySelectorAll('.approve-transaction').forEach(button => {
        button.addEventListener('click', (e) => {
          const transactionId = e.target.closest('button').getAttribute('data-transaction-id');
          updateTransactionStatus(transactionId, 'completed');
        });
      });
      
      document.querySelectorAll('.reject-transaction').forEach(button => {
        button.addEventListener('click', (e) => {
          const transactionId = e.target.closest('button').getAttribute('data-transaction-id');
          updateTransactionStatus(transactionId, 'rejected');
        });
      });
    } else {
      transactionsList.innerHTML = '<tr><td colspan="8">لا توجد معاملات</td></tr>';
    }
  });
}

// تحميل الإعدادات
function loadSettings() {
  get(ref(db, 'settings')).then(snapshot => {
    if (snapshot.exists()) {
      const settings = snapshot.val();
      
      document.getElementById('min-deposit').value = settings.minDeposit || 20;
      document.getElementById('min-withdrawal').value = settings.minWithdrawal || 60;
      document.getElementById('vodafone-cash').value = settings.vodafoneCash || '01014752612';
      document.getElementById('etisalat-cash').value = settings.etisalatCash || '01014752612';
      document.getElementById('orange-cash').value = settings.orangeCash || '01014752612';
      document.getElementById('platform-profit').value = settings.platformProfit || 15;
    }
  });
  
  // نسخ أرقام المحافظ
  document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const targetId = e.target.getAttribute('data-target');
      const input = document.getElementById(targetId);
      input.select();
      document.execCommand('copy');
      alert('تم نسخ الرقم: ' + input.value);
    });
  });
  
  // حفظ الإعدادات
  document.getElementById('system-settings')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const settings = {
      minDeposit: parseInt(document.getElementById('min-deposit').value),
      minWithdrawal: parseInt(document.getElementById('min-withdrawal').value),
      vodafoneCash: document.getElementById('vodafone-cash').value,
      etisalatCash: document.getElementById('etisalat-cash').value,
      orangeCash: document.getElementById('orange-cash').value,
      platformProfit: parseInt(document.getElementById('platform-profit').value)
    };
    
    set(ref(db, 'settings'), settings)
      .then(() => alert('تم حفظ الإعدادات بنجاح'))
      .catch(error => alert('حدث خطأ أثناء حفظ الإعدادات: ' + error.message));
  });
}

// تحميل وكلاء الدعم
function loadAgents() {
  get(ref(db, 'agents')).then(snapshot => {
    const agentsList = document.getElementById('agents-list');
    agentsList.innerHTML = '';
    
    if (snapshot.exists()) {
      const agents = snapshot.val();
      
      Object.keys(agents).forEach(agentId => {
        const agent = agents[agentId];
        
        const agentRow = document.createElement('tr');
        agentRow.innerHTML = `
          <td>${agentId.substring(0, 8)}</td>
          <td>${agent.name}</td>
          <td>${agent.email}</td>
          <td>${agent.phone}</td>
          <td>${agent.transactions || 0}</td>
          <td class="${agent.active ? 'active' : 'inactive'}">${agent.active ? 'نشط' : 'غير نشط'}</td>
          <td>
            <button class="edit-agent" data-agent-id="${agentId}"><i class="fas fa-edit"></i></button>
            <button class="toggle-agent" data-agent-id="${agentId}">
              <i class="fas ${agent.active ? 'fa-toggle-on' : 'fa-toggle-off'}"></i>
            </button>
          </td>
        `;
        
        agentsList.appendChild(agentRow);
      });
      
      // إضافة مستمعات الأحداث للأزرار
      document.querySelectorAll('.edit-agent').forEach(button => {
        button.addEventListener('click', (e) => {
          const agentId = e.target.closest('button').getAttribute('data-agent-id');
          editAgent(agentId);
        });
      });
      
      document.querySelectorAll('.toggle-agent').forEach(button => {
        button.addEventListener('click', (e) => {
          const agentId = e.target.closest('button').getAttribute('data-agent-id');
          toggleAgentStatus(agentId);
        });
      });
    } else {
      agentsList.innerHTML = '<tr><td colspan="7">لا يوجد وكلاء دعم</td></tr>';
    }
  });
}

// تهيئة لوحة التحكم عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.admin-container')) {
    loadDashboardStats();
    loadUsers();
    loadGames();
    loadTransactions();
    loadSettings();
    loadAgents();
    
    // إضافة لعبة جديدة
    document.getElementById('add-game-btn')?.addEventListener('click', () => {
      document.getElementById('game-modal-title').textContent = 'إضافة لعبة جديدة';
      document.getElementById('game-id').value = '';
      document.getElementById('game-name').value = '';
      document.getElementById('game-description').value = '';
      document.getElementById('game-image').value = '';
      document.getElementById('game-odds').value = '50';
      document.getElementById('game-modal').style.display = 'block';
    });
    
    // إضافة وكيل جديد
    document.getElementById('add-agent-btn')?.addEventListener('click', () => {
      document.getElementById('agent-modal-title').textContent = 'إضافة وكيل دعم';
      document.getElementById('agent-id').value = '';
      document.getElementById('agent-name').value = '';
      document.getElementById('agent-email').value = '';
      document.getElementById('agent-phone').value = '';
      document.getElementById('agent-password').value = '';
      document.getElementById('agent-modal').style.display = 'block';
    });
    
    // إغلاق النوافذ المنبثقة
    document.querySelectorAll('.close-modal').forEach(button => {
      button.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => {
          modal.style.display = 'none';
        });
      });
    });
  }
});
