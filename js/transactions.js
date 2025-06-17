import { db, ref, get, push, update } from './firebase.js';
import { auth } from './auth.js';

// عرض سجل المعاملات للمستخدم
function displayUserTransactions() {
  const transactionsList = document.getElementById('transactions-list');
  
  auth.onAuthStateChanged((user) => {
    if (user) {
      get(ref(db, `users/${user.uid}/transactions`)).then((snapshot) => {
        transactionsList.innerHTML = '';
        
        if (snapshot.exists()) {
          const transactions = snapshot.val();
          
          Object.keys(transactions).reverse().forEach((transactionId) => {
            const transaction = transactions[transactionId];
            
            const transactionItem = document.createElement('div');
            transactionItem.className = 'transaction-item';
            transactionItem.innerHTML = `
              <div class="transaction-type ${transaction.type}">
                ${transaction.type === 'deposit' ? 'إيداع' : 'سحب'}
              </div>
              <div class="transaction-amount">
                ${transaction.amount.toFixed(2)} جنيه
              </div>
              <div class="transaction-method">
                ${getPaymentMethodName(transaction.method)}
              </div>
              <div class="transaction-status ${transaction.status}">
                ${getStatusName(transaction.status)}
              </div>
              <div class="transaction-date">
                ${new Date(transaction.date).toLocaleString()}
              </div>
            `;
            
            transactionsList.appendChild(transactionItem);
          });
        } else {
          transactionsList.innerHTML = '<p>لا توجد معاملات سابقة</p>';
        }
      });
    }
  });
}

// الحصول على اسم طريقة الدفع
function getPaymentMethodName(method) {
  const methods = {
    'vodafone': 'فودافون كاش',
    'etisalat': 'اتصالات كاش',
    'orange': 'أورنج كاش',
    'visa': 'فيزا',
    'paypal': 'باي بال',
    'binance': 'باينانس',
    'fawry': 'فوري'
  };
  
  return methods[method] || method;
}

// الحصول على اسم حالة المعاملة
function getStatusName(status) {
  const statuses = {
    'pending': 'قيد الانتظار',
    'completed': 'مكتملة',
    'rejected': 'مرفوضة'
  };
  
  return statuses[status] || status;
}

// تهيئة المعاملات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('transactions-list')) {
    displayUserTransactions();
  }
});
