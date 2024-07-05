
// Login Form
const cookiesContent = document.querySelector(".cookies-content");
const acceptCookies = document.querySelector(".accept-cookies-btn");
const customizeCookiesBtn = document.querySelector(".customize-btn");
const cookiesSettings = document.querySelector(".cookies-settings-content");
const cookiesSettingsBtn = document.querySelector(".cookies-settings-btn");
const inputs = document.querySelectorAll(".input");


// Login Function

acceptCookies.addEventListener("click", () => {
    cookiesContent.style.display = "none";
});

customizeCookiesBtn.addEventListener("click", () => {
    cookiesContent.style.display = "none";
    cookiesSettings.style.display = "block";
});

cookiesSettingsBtn.addEventListener("click", () => {
    cookiesContent.style.display = "block";
    cookiesSettings.style.display = "none";
})



function addcl(){
    let parent = this.parentNode.parentNode;
    parent.classList.add("focus");
}

function remcl(){
    let parent = this.parentNode.parentNode;
    if(this.value == ""){
        parent.classList.remove("focus");
    }
}


inputs.forEach(input => {
    input.addEventListener("focus", addcl);
    input.addEventListener("blur", remcl);
});


function login() {
    var user = document.loginform.username.value;
    var pass = document.loginform.password.value;

    const letters = /^[A-Za-z]+$/;
    const password_expression = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/;

    if (user == "" && pass == "") {
        
        alert ("Please Enter Username and Password");

    } else if (user == "") {

        alert("Please enter Username");

    } else if (!letters.test(user)) {

        alert("Incorrect Username");

    }  else if (pass == "") {

        alert("Please enter Password");
    }  else if (!password_expression.test(pass)) {

        alert('Incorrect Password!');
    } 
    else {

        document.loginform.submit();

    }

}

// Registration Form
let registerBtn = document.querySelector(".register-btn");

function registration() {
    const firstName = document.registration_form.firstname.value;
    const lastName = document.registration_form.lastname.value;
    const email = document.registration_form.email.value;
    const password = document.registration_form.password.value;
    
    const letters = /^[A-Za-z]+$/;
    const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    const password_expression = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/;

    if (firstName == "" && lastName == "" && email == "" && password == "") {
        
        alert ("Please provide your personal info for registration");

    } else if (!letters.test(firstName) && !letters.test(lastName)) {

        alert("Name fields required only alphabet characters");

    } else if (email == "") {

        alert("Please enter your user email id");

    } else if (!filter.test(email)) {
        
        alert("Invalid Email");

    } else if (password == "") {

        alert("Please enter password");

    } else if (!password_expression.test(password)) {

        alert('Using uppercase , lowercase, special characters and numeric values are required');
    } 
    else {

        document.registration_form.submit();

    }
}

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
	<img src="../assets/science/img/boy.png" class="avatar">
	</div>`;

	chatArea.insertAdjacentHTML("beforeend", temp);
	inputMsg.value = '';

});


