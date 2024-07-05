var letters = document.getElementsByClassName("letter");
var content = document.getElementById("content");
var currentLetter = null;
var currentAudio = null;
var currentImg=null;

for (var i = 0; i < letters.length; i++) {
    letters[i].addEventListener("click", function(event) {
 
    var newLetter = document.createElement("p");
    var newAudio = document.createElement("audio");
    var newImg = document.createElement("img")
    var letter = event.target.innerHTML; 


    newAudio.src = `assets/english/audio/${letter}.mp3`;
    newImg.src=`../assets/english/img/${letter.toLowerCase()}.png`

    newImg.style.height="200px"

    newAudio.play();
    
    // Remove current letter if exists and add new letter
    if (currentLetter || currentImg) {
        content.removeChild(currentLetter);
        content.removeChild(currentImg);
    }
    content.appendChild(newLetter);
    content.appendChild(newImg);
    

    newLetter.innerHTML = letter;
    
    // Update current 
    currentLetter = newLetter;
    currentAudio = newAudio;
    currentImg=newImg;
  });
}

