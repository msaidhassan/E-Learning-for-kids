// Online Chat
const popup = document.querySelector('.chat-popup');
const chatBtn = document.querySelector('.chat-btn');
const submitBtn = document.querySelector('.submit');
const chatArea = document.querySelector('.chat-area');
const inputMsg = document.querySelector('.input-area-msg');

//   chat button toggler 

chatBtn.addEventListener("click", () => {
	popup.classList.toggle('show');
})

// send msg 
submitBtn.addEventListener("click", () => {
	let userInput = inputMsg.value;

	let temp = `<div class="out-msg">
	<span class="my-msg">${userInput}</span>
	<img src="assets/science/img/boy.jpg" class="avatar">
	</div>`;

	chatArea.insertAdjacentHTML("beforeend", temp);
	inputMsg.value = '';

});

// Count Down
const countDown = () => {
    const countDate = new Date("January 1, 2025 00:00:00").getTime();
    const now = new Date().getTime();
    const gap = countDate - now;

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Calculate the date
    const textDay = Math.floor(gap / day);
    const textHour = Math.floor((gap % day) / hour);
    const textMinute = Math.floor((gap % hour) / minute);
    const textSecond = Math.floor((gap % minute) / second);

    document.querySelector(".day").innerText = textDay;
    document.querySelector(".hour").innerText = textHour;
    document.querySelector(".minute").innerText = textMinute;
    document.querySelector(".second").innerText = textSecond;
}

setInterval(countDown, 1000);











