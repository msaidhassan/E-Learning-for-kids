document.addEventListener('DOMContentLoaded', function () {
    const gameStart = document.querySelector('.difficulty-selection');
    const game = document.getElementById('game-container');
    let cards = document.querySelectorAll('.card');
    const message = document.querySelector('.message');
    const question = document.querySelector('.question');
    const startGameButton = document.getElementById('start-game');
    const difficultySelect = document.getElementById('difficulty');
    let difficulty = difficultySelect.value;
    let numQu = getShuffleTimes(difficulty);
    const scoreDisplay = document.querySelector('.score');
    let score = 0;
    let counter = 0;
    let numbers = [];

    startGameButton.addEventListener('click', startGame);
    difficultySelect.addEventListener('change', updateDifficulty);

    function updateDifficulty() {
        difficulty = difficultySelect.value;
        numQu = getShuffleTimes(difficulty);
    }

    function getShuffleTimes(difficulty) {
        return difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 7;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function createCards() {
        game.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const card = document.createElement('div');
            card.className = 'card';
            game.appendChild(card);
        }
        cards = document.querySelectorAll('.card');
    }

    function getRandomNumbers() {
        const numbers = [];
        let i = 0;
        while (numbers.length < 3) {
            const randomNumber = Math.floor(Math.random() * 10) + 1;
            if (!numbers.includes(randomNumber)) {
                numbers.push(randomNumber);
                updateCard(cards[i], randomNumber);
                i++;
            }
        }
        return numbers;
    }

    function updateCard(card, number) {
        card.replaceChildren();
        const img = document.createElement('img');
        img.src = `assets/math/img/${number}.png`;
        img.alt = number;
        card.setAttribute('data-number', number);
        card.appendChild(img);
        card.style.transform = ''; 
    }

    function addQuestion() {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        const randomNumber = numbers[randomIndex];
        question.textContent = `What is the position of number ${randomNumber}?`;
        question.setAttribute('data-answer', randomNumber);
    }

    async function flipCard() {
        this.style.transform += 'rotateY(180deg)';
        await sleep(300); 
        this.querySelector('img').src = `assets/math/img/${this.getAttribute('data-number')}.png`;
        this.style.transform += 'rotateY(-180deg)';

        const number = parseInt(this.getAttribute('data-number'), 10);
        const answer = parseInt(question.getAttribute('data-answer'), 10);

        message.textContent = number === answer ? 'Correct!' : 'Incorrect!';
        if (number === answer) score++;
        scoreDisplay.textContent = `Score: ${score}`;

        await sleep(500); 
        showAllCards(this);
    }

    async function showAllCards(cardFlipped) {
        for (const card of cards) {
            if (card !== cardFlipped) {
                card.style.transform += 'rotateY(180deg)';
                await sleep(300); 
                card.querySelector('img').src = `assets/math/img/${card.getAttribute('data-number')}.png`;
                card.style.transform += 'rotateY(-180deg)';
            }
        }
        counter++;
        await sleep(1500);
        repeatSequence(numQu - counter);
    }

    async function shuffleCards(times) {
        if (times === 0) return;

        const [index1, index2] = getTwoDistinctRandomIndexes(cards.length);
        const card1 = cards[index1];
        const card2 = cards[index2];

        card1.classList.add('highlight-border');
        card2.classList.add('highlight-border');

        await sleep(500); 

        const deltaX = card2.getBoundingClientRect().left - card1.getBoundingClientRect().left;
        if (times < numQu) {
            card1.style.transform += `translate(${deltaX}px)`;
            card2.style.transform += `translate(${-deltaX}px)`;
        } else {
            card1.style.transform = `translate(${deltaX}px)`;
            card2.style.transform = `translate(${-deltaX}px)`;
        }

        await sleep(1500); 

        card1.classList.remove('highlight-border');
        card2.classList.remove('highlight-border');

        await sleep(500); 
        shuffleCards(times - 1);
    }

    function getTwoDistinctRandomIndexes(length) {
        const index1 = Math.floor(Math.random() * length);
        let index2;
        do {
            index2 = Math.floor(Math.random() * length);
        } while (index1 === index2);
        return [index1, index2];
    }

    async function repeatSequence(numQu_r) {
        if (numQu_r === 0) {
            endGame();
            return;
        }
        question.style.display = 'block';
        game.style.display = 'none';
        question.textContent = `Question ${counter + 1}`;
        message.textContent = '';

        await sleep(1000); 
        question.textContent = "Save these cards in your brain";
        game.style.display = 'flex';

        scoreDisplay.textContent = `Score: ${score}`;

        createCards();
        numbers = getRandomNumbers();

        await sleep(1500); 
        for (const card of cards) {
            card.style.transform += 'rotateY(180deg)';
        }

        await sleep(300); 
        for (const card of cards) {
            card.querySelector('img').src = "assets/math/img/back.png";
            card.style.transform += 'rotateY(-180deg)';
        }

        await sleep(1000); 
        question.textContent = "Shuffle Cards";
        await shuffleCards(numQu);
        await sleep(numQu * 2000); 

        addQuestion();
        cards.forEach(card => card.addEventListener('click', flipCard));
    }

    function startGame() {
        gameStart.style.display = 'none';
        repeatSequence(numQu);
    }

    function endGame() {
        message.textContent = 'Game finished!';
        game.style.display = 'none';
        question.style.display = 'none';
    }
});

// Audio

function playAudio() {
    document.getElementById("audio").play()
}
