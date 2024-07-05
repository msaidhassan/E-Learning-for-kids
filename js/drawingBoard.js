var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var drawing = false;
var color = "black"; // Default color for drawing

function mouseDown(event) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
}

function mouseMove(event) {
    if (drawing) {
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.strokeStyle = color;
        ctx.stroke();
    }
}

function mouseUp() {
    drawing = false;
}

function erase() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

var crayons = document.getElementsByClassName("crayon");

function setupColoring() {
    // Loop through each crayon
    for (var i = 0; i < crayons.length; i++) {
        // Get the data-color attribute value
        var crayonColor = crayons[i].getAttribute("data-color");

        // Set the background color using the data-color value
        crayons[i].style.backgroundColor = crayonColor;

        // Add click event listener to each crayon div
        crayons[i].addEventListener("click", function() {
            // Update color variable with selected color
            color = this.getAttribute("data-color");
        });
    }
}

setupColoring();

// Event listeners for drawing on canvas
canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("mousemove", mouseMove);
canvas.addEventListener("mouseup", mouseUp);

