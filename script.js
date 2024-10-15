// Card values
const cardValues = {
    easy: ['A', 'B', 'C', 'D'],
    medium: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    hard: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
};

let gameDeck = [];
let firstCard, secondCard;
let movesCount = 0;
let matchedPairs = 0;
let timerInterval;
let timeElapsed = 0;

const gameBoard = document.getElementById('gameBoard');
const movesCountDisplay = document.getElementById('movesCount');
const timerDisplay = document.getElementById('timer');
const finalScoreDisplay = document.getElementById('finalScore');
const gameOverModal = document.getElementById('gameOverModal');

document.getElementById('startGame').addEventListener('click', startGame);
document.getElementById('restartGame').addEventListener('click', restartGame);

function startGame() {
    playSound('gamestart'); 
    const difficulty = document.getElementById('difficulty').value;
    gameDeck = createDeck(difficulty);
    shuffle(gameDeck);
    renderCards();
    resetGame();
    startTimer();
}

function createDeck(difficulty) {
    const values = cardValues[difficulty];
    return [...values, ...values].map(value => {
        return { value, flipped: false, matched: false };
    });
}

function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function renderCards() {
    gameBoard.innerHTML = '';
    gameDeck.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.setAttribute('data-index', index);
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

// flipcard
function flipCard() {
    const index = this.getAttribute('data-index');
    const card = gameDeck[index];

    if (card.flipped || card.matched || secondCard) return;

    card.flipped = true;
    this.classList.add('flipped');
    this.textContent = card.value;

    if (!firstCard) {
        firstCard = card;
    } else {
        secondCard = card;
        movesCount++;
        movesCountDisplay.textContent = movesCount;
        checkForMatch();
    }

    playSound('flip');
}

function checkForMatch() {
    if (firstCard.value === secondCard.value) {
        firstCard.matched = true;
        secondCard.matched = true;
        matchedPairs++;

        if (matchedPairs === gameDeck.length / 2) {
            endGame();
        }

        playSound('match');
        resetCards();
    } else {
        setTimeout(() => {
            firstCard.flipped = false;
            secondCard.flipped = false;
            resetCards();
        }, 1000);
    }
}

function resetCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        if (gameDeck[index].flipped) {
            card.textContent = gameDeck[index].value;
        } else {
            card.textContent = '';
            card.classList.remove('flipped');
        }
    });

    firstCard = null;
    secondCard = null;
}

// timer
function startTimer() {
    timeElapsed = 0;
    timerDisplay.textContent = timeElapsed;
    timerInterval = setInterval(() => {
        timeElapsed++;
        timerDisplay.textContent = timeElapsed;
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    finalScoreDisplay.textContent = `Moves: ${movesCount}, Time: ${timeElapsed}s`;
    gameOverModal.style.display = 'flex';
    playSound('gameOver');
}

function resetGame() {
    movesCount = 0;
    matchedPairs = 0;
    movesCountDisplay.textContent = movesCount;
    timerDisplay.textContent = 0;
    gameOverModal.style.display = 'none';
    resetCards();
}

function restartGame() {
    resetGame();
    startGame();
}

function playSound(type) {
    const sound = document.getElementById(`${type}Sound`);
    sound.currentTime = 0;
    sound.play();
}
