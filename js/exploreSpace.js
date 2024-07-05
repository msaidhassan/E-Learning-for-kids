document.addEventListener('DOMContentLoaded', () => {
  const spaceship = document.getElementById('spaceship');
  const planets = document.querySelectorAll('.planet');
  const infoBox = document.getElementById('infoBox');
  const welcomeAudio = document.getElementById('welcomeAudio');
  let currentAudio = null;

  // Show welcome message and wait for user interaction
  infoBox.textContent = "Click on a planet to start the journey!";
  infoBox.style.display = 'block';

  infoBox.addEventListener('click', () => {
    infoBox.style.display = 'none';
    playWelcomeAudio();
  });

  function playWelcomeAudio() {
    try {
      welcomeAudio.play().catch(error => {
        console.error('Error playing welcome audio:', error);
      });

      welcomeAudio.addEventListener('ended', () => {
        infoBox.textContent = "Click on a planet to start the journey!";
        infoBox.style.display = 'block';
      }, { once: true });
    } catch (error) {
      console.error('Error playing welcome audio:', error);
    }
  }

  planets.forEach((planet) => {
    planet.addEventListener('click', () => {
      moveToPlanet(planet);
    });
  });

  function moveToPlanet(planet) {
    const planetRect = planet.getBoundingClientRect();
    const containerRect = document.querySelector('.container').getBoundingClientRect();

    const spaceshipX = planetRect.left - containerRect.left + (planetRect.width / 2) - (spaceship.clientWidth / 2);
    const spaceshipY = planetRect.top - containerRect.top + (planetRect.height / 2) - (spaceship.clientHeight / 2);

    spaceship.style.transition = 'transform 1s ease';
    spaceship.style.transform = `translate(${spaceshipX}px, ${spaceshipY}px)`;

    spaceship.addEventListener('transitionend', () => showPlanetInfo(planet), { once: true });
  }

  function showPlanetInfo(planet) {
    const info = planet.getAttribute('data-info');
    const audioSrc = planet.getAttribute('data-audio');

    infoBox.textContent = info;
    infoBox.style.display = 'block';

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    currentAudio = new Audio(audioSrc);
    currentAudio.play().catch(error => {
      console.error('Error playing audio:', error);
    });

    currentAudio.addEventListener('ended', () => {
      infoBox.style.display = 'none';
    });
  }
});