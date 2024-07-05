const letters = [
  "ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص",  
  "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "هـ", "و", "ي",
];

let memoryCards = [];
let flippedCards = [];
let matchedCards = [];
let gameActive = false;
let hintCount = 3;

const cardsContainer = document.getElementById('cardsContainer');
const startButton = document.getElementById('startButton');
const difficultySelect = document.getElementById('difficulty');
const hintButton = document.getElementById('hintButton');
const timerElement = document.getElementById('timer');

let timerInterval;
let startTime;

const flipSound = new Audio('../assets/arabic/audio/click.mp3');
const matchSound = new Audio('../assets/arabic/audio/match.mp3');
const winSound = new Audio('../assets/arabic/audio/win.mp3');
const bgMusic = new Audio('../assets/arabic/audio/background.mp3');
bgMusic.loop = true;

// Shuffle function to randomize card order
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Initialize the game
function initGame() {
  memoryCards = [];
  flippedCards = [];
  matchedCards = [];
  gameActive = true;
  hintCount = 3;
  hintButton.disabled = false;
  hintButton.textContent = `تلميح (${hintCount})`;

  const difficulty = difficultySelect.value;
  let numPairs;
  switch(difficulty) {
    case 'easy':
      numPairs = 6;
      break;
    case 'medium':
      numPairs = 12;
      break;
    case 'hard':
      numPairs = 18;
      break;
  }

  for (let i = 0; i < numPairs; i++) {
    const letter = letters[i];
    memoryCards.push({ letter, id: generateUniqueId() });
    memoryCards.push({ letter, id: generateUniqueId() });
  }

  // Shuffle cards
  shuffleArray(memoryCards);

  // Render cards
  renderCards();

  // Start timer
  startTimer();
  bgMusic.play();
}

// Generate unique IDs for cards
function generateUniqueId() {
  return Math.random().toString(36).substring(2, 9);
}

// Render cards on the screen
function renderCards() {
  cardsContainer.innerHTML = '';
  memoryCards.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.id = card.id;
    cardElement.dataset.letter = card.letter;
    cardElement.addEventListener('click', () => flipCard(cardElement));
    cardsContainer.appendChild(cardElement);
  });
}

// Flip card action
function flipCard(cardElement) {
  if (!gameActive || flippedCards.length >= 2 || cardElement.classList.contains('flipped') || cardElement.classList.contains('matched')) {
    return;
  }

  cardElement.classList.add('flipped');
  cardElement.textContent = cardElement.dataset.letter;
  flipSound.play();
  flippedCards.push(cardElement);

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

// Check if flipped cards match
function checkMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.letter === card2.dataset.letter) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedCards.push(card1, card2);
    matchSound.play();
    flippedCards = [];

    if (matchedCards.length === memoryCards.length) {
      endGame();
    }
  } else {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card1.textContent = '';
      card2.classList.remove('flipped');
      card2.textContent = '';
      flippedCards = [];
    }, 1000);
  }
}

// Start timer function
function startTimer() {
  startTime = new Date();
  timerInterval = setInterval(() => {
    const elapsedTime = new Date() - startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);
}

// End timer function
function stopTimer() {
  clearInterval(timerInterval);
}

// End game function
function endGame() {
  gameActive = false;
  stopTimer();
  bgMusic.pause();
  winSound.play();
  setTimeout(() => alert('لقد أكملت اللعبة بنجاح!'), 100);
  startButton.disabled = false;
  hintButton.disabled = true;
}

// Hint function
function useHint() {
  if (hintCount > 0 && flippedCards.length < 2) {
    const unmatchedCards = Array.from(document.querySelectorAll('.card:not(.matched)'));
    const randomCard = unmatchedCards[Math.floor(Math.random() * unmatchedCards.length)];
    randomCard.classList.add('flipped');
    randomCard.textContent = randomCard.dataset.letter;
    setTimeout(() => {
      randomCard.classList.remove('flipped');
      randomCard.textContent = '';
    }, 1000);
    hintCount--;
    hintButton.textContent = `تلميح (${hintCount})`;
    if (hintCount === 0) {
      hintButton.disabled = true;
    }
  }
}

// Event listeners
startButton.addEventListener('click', () => {
  initGame();
  startButton.disabled = true;
});

hintButton.addEventListener('click', useHint);
