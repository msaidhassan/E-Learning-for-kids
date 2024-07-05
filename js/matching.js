document.addEventListener("DOMContentLoaded", function () {
  let score = 0;

  // Function to update score
  function updateScore() {
    var scoreDisplay = document.getElementById("scoreDisplay");
    scoreDisplay.textContent = `Score: ${score}`;
  }

  var objectsContainer = document.querySelector(".objects-container");
  var binsContainer = document.querySelector(".bins-container");

  // Shuffle 
  function shuffleElements(container) {
    for (let i = container.children.length; i >= 0; i--) {
      container.appendChild(container.children[(Math.random() * i) | 0]);
    }
  }
  
  shuffleElements(objectsContainer);
  shuffleElements(binsContainer);

  const objects = document.querySelectorAll(".object");
  const bins = document.querySelectorAll(".letter");

  // Event listeners for drag and drop
  objects.forEach((object) => {
    object.addEventListener("dragstart", dragStart);
    object.addEventListener("dragend", dragEnd);
  });

  bins.forEach((bin) => {
    bin.addEventListener("dragover", dragOver);
    bin.addEventListener("dragenter", dragEnter);
    bin.addEventListener("dragleave", dragLeave);
    bin.addEventListener("drop", dragDrop);
  });

  // Functions for drag and drop events
  function dragStart() {
    this.classList.add("dragging");
  }

  function dragEnd() {
    this.classList.remove("dragging");
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function dragEnter(e) {
    e.preventDefault();
    this.classList.add("hovered");
  }

  function dragLeave() {
    this.classList.remove("hovered");
  }

  function dragDrop() {
    const draggedObject = document.querySelector(".dragging");
    const binLetter = this.getAttribute("data-bin");
    const objectLetter = draggedObject.getAttribute("data-letter");
    var audio = document.createElement("audio");

    if (binLetter === objectLetter) {
      this.style.display = "none";
      draggedObject.style.display = "none";
      audio.src = "assets/science/audio/correct.mp3";
      audio.play();
      score++;
      updateScore();
      if (score === 26) {
        binsContainer.style.display = "none";
        objectsContainer.innerHTML = "Yay! You've made it...";
        objectsContainer.style.fontSize = "30px";
        objectsContainer.style.textAlign = "center";
        objectsContainer.style.backgroundColor = '#FFFFFF';
        objectsContainer.style.width = '50%';
        objectsContainer.style.height = '200px';
        audio.src = "assets/english/audio/kids_cheering.mp3";
        audio.play();
      }
    } else {
      audio.src = "../assets/english/audio/wrong_5.mp3";
      audio.play();
    }
  }
});
