  
const reptiles = {
  '🦎': 'Gecko',
  '🐍': 'Snake',
  '🐢': 'Turtle',
  '🐊': 'Swamp',
};

const questions = [
  "What is the largest living reptile?",
  "Which reptile has a shell?",
  "What is a common pet reptile?",
  "Which reptile is known for its speed?",
  "Which reptile lives in a terrarium?"
];

const answers = [
  "Swamp",
  "Turtle",
  "Gecko",
  "Gecko",
  "Snake"
];

let dom;
let score = 0;
let options = [];
let currentQuestion = 0;
let canSelect = false;
let shuffledQuestions = [];
let shuffledAnswers = [];
let correctAnswers = 0;

document.addEventListener('DOMContentLoaded', (event) => {
  dom = {
    question: document.querySelector(".question"),
    wholeBody: document.querySelector(".whole-body"),
    bingo: document.querySelector(".bingo"),
    again: document.querySelector(".again"),
    faces: Array.from(document.querySelectorAll(".face")),
    slider: document.querySelector(".slider"),
    correctSound: document.getElementById("correct-sound"),
    wrongSound: document.getElementById("wrong-sound"),
    scorePopup: document.getElementById("score-popup"),
    closeScorePopup: document.getElementById("close-score-popup"),
    score: document.getElementById("score"),
    playAgain: document.getElementById("play-again"),
    reptileImage: document.getElementById("reptile-image"),
    endMessage: document.getElementById("end-message"),
    reptileSounds: {
      gecko: document.getElementById("gecko-sound"),
      snake: document.getElementById("snake-sound"),
      turtle: document.getElementById("turtle-sound"),
      swamp: document.getElementById("swamp-sound")
    }
  };

  init();
});

const animation = {
  frameOut: () => {
    return new Promise(resolve => {
      new TimelineMax()
        .to(dom.bingo, 0, { visibility: "hidden" })
        .to(dom.slider, 1, { scale: 0 }, "t1")
        .staggerTo(dom.faces, 1, { scale: 0 }, "t1")
        .to(dom.wholeBody, 1, { scale: 0 }, "t1")
        .timeScale(5)
        .eventCallback("onComplete", resolve);
    });
  },
  frameIn: () => {
    return new Promise(resolve => {
      new TimelineMax()
        .to(dom.slider, 0, { left: "0px" })
        .to(dom.wholeBody, 1, { scale: 1, delay: 1 })
        .staggerTo(dom.faces, 1, { scale: 1 }, 0.25)
        .to(dom.slider, 1, { scale: 1 })
        .timeScale(5)
        .eventCallback("onComplete", resolve);
    });
  },
  moveSlider: position => {
    return new Promise(resolve => {
      new TimelineMax()
        .to(dom.slider, 1, { left: (30 + 75) * position + "px" })
        .to(dom.slider, 1, { scale: 1 })
        .timeScale(5)
        .eventCallback("onComplete", resolve);
    });
  },
  showBingo: () => {
    return new Promise(resolve => {
      new TimelineMax()
        .to(dom.bingo, 0, { visibility: "visible" })
        .to(dom.bingo, 1, { rotation: -5 })
        .to(dom.bingo, 1, { rotation: 5 })
        .to(dom.bingo, 1, { rotation: 0 })
        .timeScale(8)
        .eventCallback("onComplete", resolve);
    });
  }
};

async function newGame() {
  await animation.frameOut();
  score = 0;
  currentQuestion = 0;
  canSelect = true;
  correctAnswers = 0;
  shuffledQuestions = _.shuffle(questions);
  shuffledAnswers = shuffledQuestions.map(question => answers[questions.indexOf(question)]);
  updateScorePopup();
  shuffle();
  await animation.frameIn();
  updateQuestion();
}

function shuffle() {
  let reptileKeys = Object.keys(reptiles);
  options = _.shuffle(reptileKeys).slice(0, 4);

  dom.faces.forEach((face, i) => {
    face.innerText = options[i];
  });

  dom.reptileImage.style.display = 'none';
}

function updateQuestion() {
  dom.question.innerText = shuffledQuestions[currentQuestion];
}

async function select(e) {
  if (!canSelect) return;

  let position = _.findIndex(options, x => x == e.target.innerText);
  await animation.moveSlider(position);

  if (reptiles[e.target.innerText] == shuffledAnswers[currentQuestion]) {
    dom.correctSound.play();
    score++;
    correctAnswers++;

    const reptileName = reptiles[e.target.innerText].toLowerCase();
    dom.reptileImage.src = `../assets/science/img/${reptileName}.png`;
    dom.reptileImage.style.display = 'block';
    dom.reptileSounds[reptileName].play();

    await animation.showBingo();
  } else {
    dom.wrongSound.play();
  }

  currentQuestion++;

  if (currentQuestion >= 5) {
    showScorePopup();
    canSelect = false;
  } else if (currentQuestion < shuffledQuestions.length) {
    updateQuestion();
  }
}

function showScorePopup() {
  dom.score.innerText = `Score: ${score}`;
  if (correctAnswers >= 3) {
    dom.endMessage.innerText = "Congratulations!";
  } else {
    dom.endMessage.innerText = "Game Over!";
  }
  dom.scorePopup.style.display = 'block';
}

function updateScorePopup() {
  dom.scorePopup.style.display = 'none';
}

function init() {
  dom.faces.forEach(face => {
    face.addEventListener("click", select);
  });
  dom.again.addEventListener("click", newGame);
  dom.closeScorePopup.addEventListener("click", updateScorePopup);
  dom.playAgain.addEventListener("click", () => {
    updateScorePopup();
    newGame();
  });
  newGame();
}
