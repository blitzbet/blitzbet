import { db, ref, get, onValue } from './firebase.js';

// عرض الألعاب المتاحة
function displayGames() {
  const gamesGrid = document.getElementById('games-grid');
  
  onValue(ref(db, 'games'), (snapshot) => {
    gamesGrid.innerHTML = '';
    
    if (snapshot.exists()) {
      const games = snapshot.val();
      
      Object.keys(games).forEach((gameId) => {
        const game = games[gameId];
        
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
          <img src="${game.image}" alt="${game.name}">
          <h3>${game.name}</h3>
          <p>${game.description}</p>
          <button class="play-btn" data-game-id="${gameId}">لعب الآن</button>
        `;
        
        gamesGrid.appendChild(gameCard);
      });
      
      // إضافة مستمعات الأحداث لأزرار اللعب
      document.querySelectorAll('.play-btn').forEach(button => {
        button.addEventListener('click', (e) => {
          const gameId = e.target.getAttribute('data-game-id');
          playGame(gameId);
        });
      });
    } else {
      gamesGrid.innerHTML = '<p>لا توجد ألعاب متاحة حالياً</p>';
    }
  });
}

// تشغيل اللعبة المحددة
function playGame(gameId) {
  get(ref(db, 'games/' + gameId)).then((snapshot) => {
    if (snapshot.exists()) {
      const game = snapshot.val();
      const gameModal = document.getElementById('game-modal');
      const gameContainer = document.getElementById('game-container');
      
      // عرض نافذة اللعبة
      gameContainer.innerHTML = `
        <h2>${game.name}</h2>
        <img src="${game.image}" alt="${game.name}" class="game-modal-image">
        <p class="game-modal-description">${game.description}</p>
        <div class="game-bet-controls">
          <input type="number" id="bet-amount" placeholder="المبلغ المراهن به" min="1">
          <button id="place-bet">وضع الرهان</button>
        </div>
        <div class="game-result" id="game-result"></div>
      `;
      
      gameModal.style.display = 'block';
      
      // إغلاق النافذة
      document.querySelector('.close-modal').addEventListener('click', () => {
        gameModal.style.display = 'none';
      });
      
      // وضع الرهان
      document.getElementById('place-bet')?.addEventListener('click', () => {
        const betAmount = parseFloat(document.getElementById('bet-amount').value);
        
        if (isNaN(betAmount) || betAmount <= 0) {
          alert('الرجاء إدخال مبلغ صحيح');
          return;
        }
        
        // محاكاة نتيجة اللعبة (مع ضمان ربح المنصة)
        const winProbability = game.odds / 100;
        const isWin = Math.random() < winProbability;
        
        const resultDiv = document.getElementById('game-result');
        
        if (isWin) {
          const winAmount = betAmount * 2; // يمكن تعديل هذا حسب احتمالات اللعبة
          resultDiv.innerHTML = `
            <p class="win-message">مبروك! لقد ربحت ${winAmount.toFixed(2)} جنيه</p>
          `;
          // هنا يجب تحديث رصيد المستخدم في قاعدة البيانات
        } else {
          resultDiv.innerHTML = `
            <p class="lose-message">للأسف، لقد خسرت رهانك. حاول مرة أخرى!</p>
          `;
          // هنا يجب خصم المبلغ من رصيد المستخدم في قاعدة البيانات
        }
      });
    }
  });
}

// تهيئة الألعاب عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('games-grid')) {
    displayGames();
  }
});
