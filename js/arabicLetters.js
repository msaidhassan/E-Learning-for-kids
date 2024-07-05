
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('startButton');

const letters = [
  "أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص",  
  "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "هـ", "و", "ي",
];
let fallingLetters = [];
let targetLetter;
let targetSound = new Audio();
let score = 0;
let speed = 1.5; 
let correctClicks = 0;
let letterInterval;
let targetLetterAdded = false;
let gameActive = false;
const balloonImage = new Image();
balloonImage.src = "../assets/arabic/img/ballon.jpg";
balloonImage.onload = () => {
  startButton.disabled = false;
};

// Preload all sound files
const soundFiles = {};
letters.forEach(letter => {
  soundFiles[letter] = new Audio(`../assets/arabic/audio/${letter}.mp3`);
});

class FallingLetter {
  constructor(letter) {
    this.letter = letter;
    let position = this.getRandomPosition();
    this.x = position.x;
    this.y = position.y;
  }

  getRandomPosition() {
    let x, y, overlapping;
    do {
      x = Math.random() * (canvas.width - 100) + 50;
      y = Math.random() * -100;
      overlapping = fallingLetters.some((letter) => {
        return Math.abs(letter.x - x) < 100 && Math.abs(letter.y - y) < 150;
      });
    } while (overlapping);
    return { x, y };
  }

  draw() {
    ctx.drawImage(balloonImage, this.x - 50, this.y - 100, 100, 150);
    ctx.font = "40px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(this.letter, this.x, this.y - 40);
  }

  update() {
    this.y += speed;
    this.checkCollision();
  }

  checkCollision() {
    if (this.y >= canvas.height - 100) {
      if (this.letter === targetLetter) {
        endGame();
      } else {
        fallingLetters = fallingLetters.filter(letter => letter.y < canvas.height - 100);
      }
    }
  }
}

function drawLetters() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  fallingLetters.forEach((letter) => letter.draw());
}

function updateLetters() {
  fallingLetters.forEach((letter) => letter.update());
}

function getRandomLetter() {
  const randomIndex = Math.floor(Math.random() * letters.length);
  return letters[randomIndex];
}

function updateScore() {
  scoreElement.textContent = `النقاط: ${score}`;
}

function playTargetSound() {
  targetLetter = getRandomLetter();
  targetSound = soundFiles[targetLetter];
  console.log(targetLetter);
  targetSound.play().catch((error) => {
    console.log("Playback prevented:", error);
  });

  if (!targetLetterAdded) {
    fallingLetters.push(new FallingLetter(targetLetter));
    targetLetterAdded = true;
  }
}

function startGame() {
  score = 0;
  correctClicks = 0;
  updateScore();
  speed = 1.5; 
  fallingLetters = [];
  targetLetterAdded = false;
  gameActive = true;
  playTargetSound();

  while (fallingLetters.length < 5) {
    fallingLetters.push(new FallingLetter(getRandomLetter()));
  }

  startButton.disabled = true;
  gameLoop();
  letterInterval = setInterval(() => {
    if (gameActive) {
      if (!targetLetterAdded) {
        fallingLetters.push(new FallingLetter(targetLetter));
        targetLetterAdded = true;
      } else {
        fallingLetters.push(new FallingLetter(getRandomLetter()));
      }
      if (fallingLetters.length > 10) fallingLetters.shift();
    }
  }, 2000);
}

function gameLoop() {
  if (gameActive) {
    updateLetters();
    drawLetters();
    requestAnimationFrame(gameLoop);
  }
}

function endGame() {
  gameActive = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  const overlay = document.createElement('div');
  overlay.classList.add('alert-overlay');
  
  const alertBox = document.createElement('div');
  alertBox.classList.add('alert-box');
  alertBox.textContent = `انتهت اللعبة! مجموع نقاطك: ${score}`;
  
  overlay.appendChild(alertBox);
  document.body.appendChild(overlay);

  startButton.disabled = false;
  clearInterval(letterInterval);
  
  overlay.addEventListener('click', () => {
    document.body.removeChild(overlay);
  });
}

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  let correctClick = false;

  fallingLetters.forEach((letter, index) => {
    if (
      x > letter.x - 50 &&
      x < letter.x + 50 &&
      y > letter.y - 100 &&
      y < letter.y + 50
    ) {
      if (letter.letter === targetLetter) {
        score++;
        correctClicks++;
        updateScore();
        fallingLetters.splice(index, 1);
        targetLetterAdded = false;
        playTargetSound();
        correctClick = true;
      }
    }
  });

  if (!correctClick && gameActive) {
    endGame();
  }
});

startButton.addEventListener("click", startGame);
