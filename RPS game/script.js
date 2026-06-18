// ===== GAME STATE =====
let gameState = {
    mode: null,
    playerScore: 0,
    computerScore: 0,
    player1Score: 0,
    player2Score: 0,
    playerStreak: 0,
    computerStreak: 0,
    player1Streak: 0,
    player2Streak: 0,
    history: [],
    twoPlayerHistory: [],
    player1Choice: null,
    player2Choice: null,
    currentPlayer: 1
};

// ===== DOM ELEMENTS =====
const elements = {
    // Screens
    homeScreen: document.getElementById('homeScreen'),
    onePlayerScreen: document.getElementById('onePlayerScreen'),
    twoPlayerScreen: document.getElementById('twoPlayerScreen'),
    
    // Buttons
    onePlayerBtn: document.getElementById('onePlayerBtn'),
    twoPlayerBtn: document.getElementById('twoPlayerBtn'),
    backFromOne: document.getElementById('backFromOne'),
    backFromTwo: document.getElementById('backFromTwo'),
    resetOne: document.getElementById('resetOne'),
    resetTwo: document.getElementById('resetTwo'),
    darkModeToggle: document.getElementById('darkModeToggle'),
    
    // One Player Elements
    playerScore: document.getElementById('playerScore'),
    computerScore: document.getElementById('computerScore'),
    playerStreak: document.getElementById('playerStreak'),
    computerStreak: document.getElementById('computerStreak'),
    playerChoiceIcon: document.getElementById('playerChoiceIcon'),
    computerChoiceIcon: document.getElementById('computerChoiceIcon'),
    resultMessage: document.getElementById('resultMessage'),
    historyList: document.getElementById('historyList'),
    
    // Two Player Elements
    player1Score: document.getElementById('player1Score'),
    player2Score: document.getElementById('player2Score'),
    player1Streak: document.getElementById('player1Streak'),
    player2Streak: document.getElementById('player2Streak'),
    player1ChoiceIcon: document.getElementById('player1ChoiceIcon'),
    player2ChoiceIcon: document.getElementById('player2ChoiceIcon'),
    twoPlayerStatus: document.getElementById('twoPlayerStatus'),
    twoPlayerBattle: document.getElementById('twoPlayerBattle'),
    twoPlayerResult: document.getElementById('twoPlayerResult'),
    twoPlayerChoices: document.getElementById('twoPlayerChoices'),
    nextRoundBtn: document.getElementById('nextRoundBtn'),
    twoPlayerHistoryList: document.getElementById('twoPlayerHistoryList')
};

// ===== INITIALIZATION =====
function init() {
    createParticles();
    setupEventListeners();
    
    // Remove splash screen after animation
    setTimeout(() => {
        document.getElementById('splashScreen').style.display = 'none';
    }, 2500);
}

// ===== PARTICLES =====
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particlesContainer.appendChild(particle);
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Mode selection
    elements.onePlayerBtn.addEventListener('click', () => switchScreen('onePlayer'));
    elements.twoPlayerBtn.addEventListener('click', () => switchScreen('twoPlayer'));
    
    // Back buttons
    elements.backFromOne.addEventListener('click', () => switchScreen('home'));
    elements.backFromTwo.addEventListener('click', () => switchScreen('home'));
    
    // Reset buttons
    elements.resetOne.addEventListener('click', resetOnePlayerGame);
    elements.resetTwo.addEventListener('click', resetTwoPlayerGame);
    
    // Dark mode toggle
    elements.darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // One player choice buttons
    const onePlayerChoices = elements.onePlayerScreen.querySelectorAll('.choice-btn');
    onePlayerChoices.forEach(btn => {
        btn.addEventListener('click', () => playOnePlayerRound(btn.dataset.choice));
    });
    
    // Two player choice buttons
    const twoPlayerChoices = elements.twoPlayerChoices.querySelectorAll('.choice-btn');
    twoPlayerChoices.forEach(btn => {
        btn.addEventListener('click', () => handleTwoPlayerChoice(btn.dataset.choice));
    });
    
    // Next round button
    elements.nextRoundBtn.addEventListener('click', startNextRound);
}

// ===== SCREEN MANAGEMENT =====
function switchScreen(screen) {
    // Remove active class from all screens
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    
    // Add active class to selected screen
    if (screen === 'home') {
        elements.homeScreen.classList.add('active');
        gameState.mode = null;
    } else if (screen === 'onePlayer') {
        elements.onePlayerScreen.classList.add('active');
        gameState.mode = 'onePlayer';
    } else if (screen === 'twoPlayer') {
        elements.twoPlayerScreen.classList.add('active');
        gameState.mode = 'twoPlayer';
    }
}

// ===== ONE PLAYER GAME =====
function playOnePlayerRound(playerChoice) {
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    
    // Update icons
    elements.playerChoiceIcon.textContent = getEmoji(playerChoice);
    elements.computerChoiceIcon.textContent = getEmoji(computerChoice);
    
    // Animate
    elements.playerChoiceIcon.classList.add('animate');
    elements.computerChoiceIcon.classList.add('animate');
    
    setTimeout(() => {
        elements.playerChoiceIcon.classList.remove('animate');
        elements.computerChoiceIcon.classList.remove('animate');
    }, 500);
    
    // Determine winner
    const result = determineWinner(playerChoice, computerChoice);
    
    // Update scores
    if (result === 'win') {
        gameState.playerScore++;
        gameState.playerStreak++;
        gameState.computerStreak = 0;
        elements.resultMessage.textContent = '🎉 You Win!';
        elements.resultMessage.className = 'result-message win';
        triggerConfetti();
    } else if (result === 'lose') {
        gameState.computerScore++;
        gameState.computerStreak++;
        gameState.playerStreak = 0;
        elements.resultMessage.textContent = '😢 You Lose!';
        elements.resultMessage.className = 'result-message lose';
    } else {
        elements.resultMessage.textContent = '🤝 Draw!';
        elements.resultMessage.className = 'result-message draw';
    }
    
    // Update UI
    updateOnePlayerUI();
    
    // Add to history
    gameState.history.unshift({
        player: playerChoice,
        computer: computerChoice,
        result: result
    });
    updateHistory();
}

function updateOnePlayerUI() {
    elements.playerScore.textContent = gameState.playerScore;
    elements.computerScore.textContent = gameState.computerScore;
    
    // Update streaks
    if (gameState.playerStreak >= 2) {
        elements.playerStreak.textContent = `🔥 ${gameState.playerStreak} wins!`;
    } else {
        elements.playerStreak.textContent = '';
    }
    
    if (gameState.computerStreak >= 2) {
        elements.computerStreak.textContent = `🔥 ${gameState.computerStreak} wins!`;
    } else {
        elements.computerStreak.textContent = '';
    }
}

function updateHistory() {
    elements.historyList.innerHTML = '';
    gameState.history.slice(0, 10).forEach(round => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
            <span>${getEmoji(round.player)} vs ${getEmoji(round.computer)}</span>
            <span>${round.result === 'win' ? '✅' : round.result === 'lose' ? '❌' : '➖'}</span>
        `;
        elements.historyList.appendChild(item);
    });
}

function resetOnePlayerGame() {
    gameState.playerScore = 0;
    gameState.computerScore = 0;
    gameState.playerStreak = 0;
    gameState.computerStreak = 0;
    gameState.history = [];
    
    elements.playerChoiceIcon.textContent = '?';
    elements.computerChoiceIcon.textContent = '?';
    elements.resultMessage.textContent = '';
    elements.resultMessage.className = 'result-message';
    
    updateOnePlayerUI();
    updateHistory();
}

// ===== TWO PLAYER GAME =====
function handleTwoPlayerChoice(choice) {
    if (gameState.currentPlayer === 1) {
        gameState.player1Choice = choice;
        gameState.currentPlayer = 2;
        elements.twoPlayerStatus.querySelector('h3').textContent = "Player 2's Turn";
        elements.twoPlayerStatus.querySelector('p').textContent = "Make your choice secretly";
    } else {
        gameState.player2Choice = choice;
        showTwoPlayerResult();
    }
}

function showTwoPlayerResult() {
    // Hide choices and status
    elements.twoPlayerChoices.classList.add('hidden');
    elements.twoPlayerStatus.classList.add('hidden');
    elements.twoPlayerBattle.classList.remove('hidden');
    
    // Update icons
    elements.player1ChoiceIcon.textContent = getEmoji(gameState.player1Choice);
    elements.player2ChoiceIcon.textContent = getEmoji(gameState.player2Choice);
    
    // Animate
    elements.player1ChoiceIcon.classList.add('animate');
    elements.player2ChoiceIcon.classList.add('animate');
    
    setTimeout(() => {
        elements.player1ChoiceIcon.classList.remove('animate');
        elements.player2ChoiceIcon.classList.remove('animate');
    }, 500);
    
    // Determine winner
    const result = determineWinner(gameState.player1Choice, gameState.player2Choice);
    
    // Update scores
    if (result === 'win') {
        gameState.player1Score++;
        gameState.player1Streak++;
        gameState.player2Streak = 0;
        elements.twoPlayerResult.textContent = '🎉 Player 1 Wins!';
        elements.twoPlayerResult.className = 'result-message win';
        triggerConfetti();
    } else if (result === 'lose') {
        gameState.player2Score++;
        gameState.player2Streak++;
        gameState.player1Streak = 0;
        elements.twoPlayerResult.textContent = '🎉 Player 2 Wins!';
        elements.twoPlayerResult.className = 'result-message win';
        triggerConfetti();
    } else {
        elements.twoPlayerResult.textContent = '🤝 Draw!';
        elements.twoPlayerResult.className = 'result-message draw';
    }
    
    // Update UI
    updateTwoPlayerUI();
    
    // Add to history
    gameState.twoPlayerHistory.unshift({
        player1: gameState.player1Choice,
        player2: gameState.player2Choice,
        result: result
    });
    updateTwoPlayerHistory();
}

function startNextRound() {
    gameState.currentPlayer = 1;
    gameState.player1Choice = null;
    gameState.player2Choice = null;
    
    elements.twoPlayerChoices.classList.remove('hidden');
    elements.twoPlayerStatus.classList.remove('hidden');
    elements.twoPlayerBattle.classList.add('hidden');
    
    elements.twoPlayerStatus.querySelector('h3').textContent = "Player 1's Turn";
    elements.twoPlayerStatus.querySelector('p').textContent = "Make your choice secretly";
    
    elements.player1ChoiceIcon.textContent = '?';
    elements.player2ChoiceIcon.textContent = '?';
}

function updateTwoPlayerUI() {
    elements.player1Score.textContent = gameState.player1Score;
    elements.player2Score.textContent = gameState.player2Score;
    
    // Update streaks
    if (gameState.player1Streak >= 2) {
        elements.player1Streak.textContent = `🔥 ${gameState.player1Streak} wins!`;
    } else {
        elements.player1Streak.textContent = '';
    }
    
    if (gameState.player2Streak >= 2) {
        elements.player2Streak.textContent = `🔥 ${gameState.player2Streak} wins!`;
    } else {
        elements.player2Streak.textContent = '';
    }
}

function updateTwoPlayerHistory() {
    elements.twoPlayerHistoryList.innerHTML = '';
    gameState.twoPlayerHistory.slice(0, 10).forEach(round => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
            <span>${getEmoji(round.player1)} vs ${getEmoji(round.player2)}</span>
            <span>${round.result === 'win' ? 'P1 ✅' : round.result === 'lose' ? 'P2 ✅' : '➖'}</span>
        `;
        elements.twoPlayerHistoryList.appendChild(item);
    });
}

function resetTwoPlayerGame() {
    gameState.player1Score = 0;
    gameState.player2Score = 0;
    gameState.player1Streak = 0;
    gameState.player2Streak = 0;
    gameState.twoPlayerHistory = [];
    gameState.currentPlayer = 1;
    gameState.player1Choice = null;
    gameState.player2Choice = null;
    
    elements.player1ChoiceIcon.textContent = '?';
    elements.player2ChoiceIcon.textContent = '?';
    elements.twoPlayerResult.textContent = '';
    elements.twoPlayerResult.className = 'result-message';
    
    elements.twoPlayerChoices.classList.remove('hidden');
    elements.twoPlayerStatus.classList.remove('hidden');
    elements.twoPlayerBattle.classList.add('hidden');
    
    elements.twoPlayerStatus.querySelector('h3').textContent = "Player 1's Turn";
    elements.twoPlayerStatus.querySelector('p').textContent = "Make your choice secretly";
    
    updateTwoPlayerUI();
    updateTwoPlayerHistory();
}

// ===== GAME LOGIC =====
function determineWinner(choice1, choice2) {
    if (choice1 === choice2) return 'draw';
    
    if (
        (choice1 === 'rock' && choice2 === 'scissors') ||
        (choice1 === 'paper' && choice2 === 'rock') ||
        (choice1 === 'scissors' && choice2 === 'paper')
    ) {
        return 'win';
    }
    
    return 'lose';
}

function getEmoji(choice) {
    const emojis = {
        rock: '✊',
        paper: '✋',
        scissors: '✌️'
    };
    return emojis[choice] || '?';
}

// ===== DARK MODE =====
function toggleDarkMode() {
    document.body.classList.toggle('light-mode');
    const icon = elements.darkModeToggle.querySelector('.icon');
    icon.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
}

// ===== CONFETTI =====
function triggerConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confetti = [];
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
    
    for (let i = 0; i < 100; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 5 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: Math.random() * 3 + 2,
            speedX: Math.random() * 2 - 1
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confetti.forEach((piece, index) => {
            ctx.fillStyle = piece.color;
            ctx.fillRect(piece.x, piece.y, piece.size, piece.size);
            
            piece.y += piece.speedY;
            piece.x += piece.speedX;
            
            if (piece.y > canvas.height) {
                confetti.splice(index, 1);
            }
        });
        
        if (confetti.length > 0) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

// ===== START THE GAME =====
init();
