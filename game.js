const colors = ["green", "blue", "purple", "yellow"];

let signal = [];
let position = 0;
let score = 0;

let alienY = 0;
let speed = 0.08;

let timeLimit = 3000;
let startTime;
let timer;
let gameOver = false;

const alien = document.getElementById("alien");
const signalBox = document.getElementById("signal");
const timerText = document.getElementById("timer");
const scoreText = document.getElementById("score");
const message = document.getElementById("message");
const buttons = document.querySelectorAll("button");


function newRound() {

    clearTimeout(timer);

    signal = [];
    position = 0;

    let length = 3 + Math.floor(score / 30);

    for (let i = 0; i < length; i++) {

        let random = Math.floor(Math.random() * 4);

        signal.push(colors[random]);
    }

    signalBox.innerHTML = "";

    signal.forEach(color => {

        let block = document.createElement("div");

        block.style.background = color;

        signalBox.appendChild(block);
    });

    startTime = Date.now();

    timer = setTimeout(() => {

        speed += 0.03;

        message.textContent = "TOO SLOW!";

        newRound();

    }, timeLimit);
}


function updateTimer() {

    if (gameOver) return;

    let elapsed = Date.now() - startTime;
    let remaining = Math.max(0, timeLimit - elapsed);

    timerText.textContent =
        "TIME: " + (remaining / 1000).toFixed(1);

    requestAnimationFrame(updateTimer);
}


function pressColor(color) {

    if (gameOver) return;

    if (color !== signal[position]) {

        speed += 0.01;

        message.textContent = "WRONG SIGNAL!";

        newRound();

        return;
    }

    position++;

    if (position === signal.length) {

        let timeTaken = Date.now() - startTime;

        score += 10;

        scoreText.textContent = "SCORE: " + score;

        if (timeTaken < 1500) {

            alienY = 0;

            message.textContent =
                "PERFECT! ALIEN PUSHED BACK!";

            alien.style.transform =
                "translateY(0px)";

        } else {

            message.textContent =
                "SIGNAL DECODED!";
        }

        newRound();
    }
}


buttons.forEach(button => {

    button.addEventListener("click", () => {

        pressColor(button.dataset.color);

    });

});


document.addEventListener("keydown", event => {

    const keys = {
        "1": "green",
        "2": "blue",
        "3": "purple",
        "4": "yellow"
    };

    if (keys[event.key]) {

        pressColor(keys[event.key]);

    }

});


function moveAlien() {

    if (gameOver) return;

    alienY += speed;

    alien.style.transform =
        "translateY(" + alienY + "px)";

    if (alienY >= 300) {

        gameOver = true;

        clearTimeout(timer);

        message.textContent =
            "THE ALIEN REACHED YOU!";

        timerText.textContent = "TIME: 0.0";

        buttons.forEach(button => {

            button.disabled = true;

        });

        return;
    }

    requestAnimationFrame(moveAlien);
}


newRound();
updateTimer();
moveAlien();