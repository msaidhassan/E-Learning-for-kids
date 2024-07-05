const questionContainer = document.getElementById('question');
const scoreElement = document.getElementById('score');
const feedbackContainer = document.getElementById('feedback');
const progressBar = document.getElementById('progress-bar');
const myModal = document.getElementById('myModal');
const startGameButton = document.getElementById('start-game');
const questionContainerDiv = document.getElementById('question-container');
const progressContainer = document.getElementById('progress-container');
const scoreContainer = document.getElementById('score-container');
const muteImage = document.getElementById('mute-image');

const gameAudio = new Audio('../assets/math/audio/game.mp3'); 
const corectAudio = new Audio('../assets/math/audio/correct.mp3');
const wrongAudio = new Audio('../assets/math/audio/wrong.mp3');
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('click', handleCanvasClick);

let ball = { x: 50, y: canvas.height - 30, radius: 10, color: "#007bff" };
let hole = { x: canvas.width - 50, y: 30, radius: 15 };
let holes = [];

let aiming = false;
    let angle = 0;
    let power = 0;
    let isQuestionActive = false;
    let targetHole = null;
let answerButtons;
let score = 0;
let timer;
let timeLeft = 0;  
let currentQuestionIndex = 0;
let questions = [];
let timedown=0;
let isMuted = false;
let playerPosition = 0;
const playerSpeed = 5;
let answersBalls=[];
let animationInterval;

let answerLabels = ["A", "B", "C", "D"];

  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      hideLoader();
      showContent();
    }, 2000); 
  
    function hideLoader() {
      const loader = document.getElementById("loader");
      loader.style.display = "none";
      const loading = document.getElementById("loading");
      loading.style.display = "none";
    }
  
    function showContent() {
      const content = document.getElementById("game-container");
      content.style.display = "block";
      
      const arrows = document.querySelector('.arrows');
      arrows.style.display = "block";
    }
  });
  
startGameButton.onclick = () => {
  gameAudio.play();
  gameAudio.loop = true;
  const grade = document.getElementById('grade').value;
  const level = document.getElementById('level').value;

  const xhr = new XMLHttpRequest();
  xhr.open("GET", "../questions.json", false);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);

      const gradeQuestions = data[grade];
      const selectedQuestions = [];

      for (const skill in gradeQuestions) {
        const skillQuestions = gradeQuestions[skill];
        selectedQuestions.push(...getRandomQuestions(skillQuestions, 2));
      }
      shuffleArray(selectedQuestions);
      questions = selectedQuestions;
      currentQuestionIndex = 0;
    } else if (xhr.readyState === 4 && xhr.status !== 200) {
      console.error('Error loading questions:', xhr.statusText);
    }
  };
  xhr.send();

  function getRandomQuestions(arr, num) {
    const shuffled = arr.slice();
    let i = arr.length;
    let min = i - num;
    let temp, index;

    while (i-- > min) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }

    return shuffled.slice(min);
  }
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  myModal.style.display = 'none';
  questionContainerDiv.style.display = 'block';
  progressContainer.style.display = 'block';
  scoreContainer.style.display = 'block';
  if (level == "easy") timeLeft = 20;  // Reset the timer
  else if (level == "medium") timeLeft = 15;
  else timeLeft = 10;
  timedown=timeLeft

  loadQuestion();


};

muteImage.onclick = () => {
  if(gameAudio.muted){
    gameAudio.muted=false;
     muteImage.src="../assets/math/img/speaker.png"
    }
   else {gameAudio.muted=true; muteImage.src="../assets/math/img/mute.png"

   }
}



function loadQuestion() {

  feedbackContainer.innerText = '';
  timeLeft=timedown
  answers.replaceChildren();

  updateProgressBar();

  const currentQuestion = questions[currentQuestionIndex];


  questionContainer.innerText = currentQuestion.question;
  currentQuestion.choices.forEach((choice,index) => {
    const button = document.createElement('button');
    button.className = 'answer';
    button.textContent = answerLabels[index]+") "+choice ;
    answers.appendChild(button);
     answerButtons = document.querySelectorAll('.answer');

    button.onclick = () => checkAnswer(currentQuestion.choices[index]);
  });


  setupHoles();
  startTimer();
  canvas.addEventListener('click', handleCanvasClick);
  canvas.addEventListener('mousemove', handleMouseMove);

  drawCanvas();
}


function setupHoles() {
  holes = [];
  let yPos = 50; // Start y position for the first hole
  const yStep = (canvas.height - 100) / (answerLabels.length - 1); // Step to avoid same y position

  answerButtons.forEach((button, index) => {
    let x, y;
    let validPosition = false;

    while (!validPosition) {
      x = Math.random() * (canvas.width - 50) + 25;
      y = yPos;

      validPosition = true;
      for (const hole of holes) {
        const distance = Math.sqrt(Math.pow(x - hole.x, 2) + Math.pow(y - hole.y, 2));
        if (distance < 50) {
          validPosition = false;
          break;
        }
      }
    }


  const hole = { x, y, radius: 15, answer:button.textContent.substring(3), label: answerLabels[index] };
      holes.push(hole);
    yPos += yStep;
  });

  ensureClearPath();
}

function ensureClearPath() {
  let validPosition = false;

  while (!validPosition) {
    validPosition = true;
    ball.x = Math.random() * (canvas.width - 50) + 25;
    ball.y = Math.random() * (canvas.height - 50) + 25;

    for (const hole of holes) {
      const distance = Math.sqrt(Math.pow(ball.x - hole.x, 2) + Math.pow(ball.y - hole.y, 2));
      if (distance < 50) {
        validPosition = false;
        break;
      }
    }

    if (validPosition) {
      for (const hole of holes) {
        if (isPathBlocked(ball, hole)) {
          validPosition = false;
          break;
        }
      }
    }
  }
}

function isPathBlocked(ball, hole) {
  for (const otherHole of holes) {
    if (otherHole === hole) continue;
    if (linetouchCircle(ball, hole, otherHole)) {
      return true;
    }
  }
  return false;
}

function linetouchCircle(ball, hole, circle) {
  const dx = hole.x - ball.x;
  const dy = hole.y - ball.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Calculate the point on the line where it touches the edge of the ball
  const pointOnBall = {
    x: ball.x + dx * (ball.radius / distance),
    y: ball.y + dy * (ball.radius / distance),
  };

  // Calculate the distance from the point to the ball's center
  const distanceToPoint = Math.sqrt((pointOnBall.x - ball.x) ** 2 + (pointOnBall.y - ball.y) ** 2);

  // Check if the distance is within the range [ball.radius, hole.radius)
  return distanceToPoint >= ball.radius && distanceToPoint < hole.radius;
}
function isPointInCircle(px, py, circle) {
  const dx = px - circle.x;
  const dy = py - circle.y;
  return dx * dx + dy * dy < circle.radius * circle.radius;
}


function startTimer() {
  clearInterval(timer);
   // Clear any existing timer
  timer = setInterval(() => {
    timeLeft--;
    updateProgressBar();
    if (timeLeft <= 0) {
      clearInterval(timer);
      checkAnswer(null);
      cancelAnimationFrame(movBall)  // Pass null to indicate time ran out
    }
  }, 1000);
}

function updateProgressBar() {
  console.log(timeLeft)
  const progressPercentage = (timeLeft / timedown) * 100;
  progressBar.style.width = `${progressPercentage}%`;
}

function checkAnswer(answer) {
  clearInterval(timer);  // Stop the timer when an answer is selected
  if (answer == questions[currentQuestionIndex].answer /*|| answer=="true"*/  ) {
    corectAudio.play();

    score += 10;
    feedbackContainer.innerText = 'Correct!';
    feedbackContainer.classList.remove('wrong');
    feedbackContainer.classList.add('correct');
  } else {
    wrongAudio.play();

    feedbackContainer.innerText = 'Wrong!';
    feedbackContainer.classList.remove('correct');
    feedbackContainer.classList.add('wrong');
  }
  scoreElement.innerText = score;
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    setTimeout(loadQuestion, 1000);

  } else {
    setTimeout(endGame, 1000);
  }
}

function endGame() {
  questionContainer.innerText = `Your final score is ${score}.`;
  feedbackContainer.innerText = '';
  answers.style.display = 'none';

  progressContainer.style.display = 'none';
  scoreContainer.style.display = 'none';
  canvas.style.display = 'none';
}
let dx=0,dy=0
function handleCanvasClick(event) {
  const clickX = event.clientX - canvas.offsetLeft;
   const clickY = event.clientY - canvas.offsetTop;

   holes.forEach(hole => {
       if (isPointInCircle(clickX, clickY, hole)) {
        targetHole = hole;
        dx = Math.trunc(targetHole.x- ball.x);
        dy = Math.trunc(targetHole.y- ball.y);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('click', handleCanvasClick);

        moveBallToHole(hole);
       
      }
    
  });
}

     function moveBallToHole(hole) {


        ball.x += dx/200.0;
        ball.y += dy/200.0;

     if (Math.trunc(targetHole.x - ball.x) ==0 &&   Math.trunc(targetHole.y - ball.y) ==0) {


       checkAnswer(targetHole.answer);

       return
      }


      drawCanvas();
    movBall= requestAnimationFrame(moveBallToHole);

   

  }

  // Handle mouse move to show aiming line
  function handleMouseMove(event) {

      const mouseX = event.clientX - canvas.offsetLeft;
      const mouseY = event.clientY - canvas.offsetTop;
      drawCanvas();

      holes.forEach(hole => {
          if (isPointInCircle(mouseX, mouseY, hole)) {
              drawCanvas();
              drawAimingLine(hole);
              //targetHole = hole;
              
          }
      });
  }

  // Draw the aiming line from ball to hole
  function drawAimingLine(hole) {
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.moveTo(ball.x, ball.y);
      ctx.lineTo(hole.x, hole.y);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);
  }
  function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawHoles();
    drawBall();}
    function drawHoles() {
    holes.forEach((hole) => {
      // Draw the hole with a gradient to simulate depth
      const gradient = ctx.createRadialGradient(hole.x, hole.y, hole.radius / 2, hole.x, hole.y, hole.radius);
      gradient.addColorStop(0, "#000000"); // Dark color inside the hole
      gradient.addColorStop(1, "#333333"); // Lighter color at the edge
  
      ctx.beginPath();
      ctx.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.closePath();
  
      // Draw the hole label with a shadow to give a 3D effect
      ctx.font = '14px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(hole.label, hole.x, hole.y);
      drawFlag(hole);

    });}
    function drawBall() {
    // Draw ball if it's not hidden
    if (!ball.isHidden) {
      const gradient = ctx.createRadialGradient(ball.x, ball.y, ball.radius / 4, ball.x, ball.y, ball.radius);
      gradient.addColorStop(0, "#FFFFFF"); // Light color
      gradient.addColorStop(1, "#AAAAAA"); // Dark color
    
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.closePath();
    
      // Draw dimples on the golf ball
      const dimpleRadius = 1;
      const dimpleSpacing = 4;
    
      ctx.fillStyle = "#CCCCCC";
      for (let i = -ball.radius; i < ball.radius; i += dimpleSpacing) {
        for (let j = -ball.radius; j < ball.radius; j += dimpleSpacing) {
          if (i * i + j * j <= (ball.radius - dimpleRadius) * (ball.radius - dimpleRadius)) {
            ctx.beginPath();
            ctx.arc(ball.x + i, ball.y + j, dimpleRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }
}
function drawFlag(hole) {
  const flagHeight = 40;
  const flagWidth = 10;
  const flagX = hole.x;
  const flagY = hole.y ;

  ctx.beginPath();
  ctx.moveTo(flagX, flagY);
  ctx.lineTo(flagX, flagY - flagHeight);
  ctx.strokeStyle = 'black';
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(flagX, flagY - flagHeight);
  ctx.lineTo(flagX + flagWidth*2, flagY - flagHeight + flagWidth*2 );
  ctx.lineTo(flagX, flagY - flagHeight + flagWidth);
  ctx.fillStyle = 'red';
  ctx.fill();
}

