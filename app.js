// 遊戲狀態
let gameState = {
    currentTheme: 'pure',
    currentPlayer: 'A',
    playerA: '',
    playerB: '',
    currentQuestionType: 'truth'
};

// DOM 元素
const screens = {
    home: document.getElementById('home-screen'),
    playerSetup: document.getElementById('player-setup'),
    game: document.getElementById('game-screen')
};

const elements = {
    startGame: document.getElementById('start-game'),
    confirmPlayers: document.getElementById('confirm-players'),
    playerAInput: document.getElementById('player-a'),
    playerBInput: document.getElementById('player-b'),
    currentPlayer: document.getElementById('current-player'),
    questionDisplay: document.getElementById('question-display'),
    truthBtn: document.getElementById('truth-btn'),
    dareBtn: document.getElementById('dare-btn'),
    drawQuestion: document.getElementById('draw-question'),
    complete: document.getElementById('complete'),
    yesArt: document.getElementById('yes-art')
};

// 終端機效果：文字打字機效果
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// 事件監聽器
document.addEventListener('DOMContentLoaded', () => {
    // 主題選擇
    document.querySelectorAll('.terminal-btn').forEach(btn => {
        if (btn.dataset.theme) {
            btn.addEventListener('click', () => {
                gameState.currentTheme = btn.dataset.theme;
                document.querySelectorAll('[data-theme]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                typeWriter(btn, btn.textContent);
            });
        }
    });

    // 開始遊戲
    elements.startGame.addEventListener('click', () => {
        screens.home.classList.remove('active');
        screens.playerSetup.classList.add('active');
        typeWriter(document.querySelector('.terminal-prompt'), 'ENTER PLAYER NAMES:');
    });

    // 確認玩家
    elements.confirmPlayers.addEventListener('click', () => {
        gameState.playerA = elements.playerAInput.value || 'PLAYER_A';
        gameState.playerB = elements.playerBInput.value || 'PLAYER_B';
        screens.playerSetup.classList.remove('active');
        screens.game.classList.add('active');
        updateCurrentPlayer();
    });

    // 切換題目類型
    elements.truthBtn.addEventListener('click', () => {
        gameState.currentQuestionType = 'truth';
        elements.truthBtn.classList.add('active');
        elements.dareBtn.classList.remove('active');
        typeWriter(elements.truthBtn, 'TRUTH');
    });

    elements.dareBtn.addEventListener('click', () => {
        gameState.currentQuestionType = 'dare';
        elements.dareBtn.classList.add('active');
        elements.truthBtn.classList.remove('active');
        typeWriter(elements.dareBtn, 'DARE');
    });

    // 抽題
    elements.drawQuestion.addEventListener('click', () => {
        // 顯示 YES ASCII art
        elements.yesArt.style.display = 'block';
        
        // 延遲顯示題目
        setTimeout(() => {
            const questionList = questions[gameState.currentTheme][gameState.currentQuestionType];
            const randomIndex = Math.floor(Math.random() * questionList.length);
            typeWriter(elements.questionDisplay, questionList[randomIndex]);
        }, 1000);
    });

    // 完成
    elements.complete.addEventListener('click', () => {
        gameState.currentPlayer = gameState.currentPlayer === 'A' ? 'B' : 'A';
        updateCurrentPlayer();
        elements.questionDisplay.textContent = '';
        elements.yesArt.style.display = 'none';
    });
});

// 更新當前玩家
function updateCurrentPlayer() {
    const playerName = gameState.currentPlayer === 'A' ? gameState.playerA : gameState.playerB;
    typeWriter(elements.currentPlayer, `CURRENT_USER: ${playerName}`);
}

// 註冊 Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(error => {
                console.log('ServiceWorker registration failed');
            });
    });
} 