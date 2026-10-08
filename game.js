const colors = ["green","blue","purple","yellow"];
let signal = [], pos = 0, score = 0;
let speed = 0.08, y = 0, start, timer, over = false;

const alien = document.getElementById("alien");
const box = document.getElementById("signal");
const msg = document.getElementById("message");

function round() {
    clearTimeout(timer);
    signal = [];
    pos = 0;

    let n = 3 + Math.floor(score / 30);

    for (let i = 0; i < n; i++)
        signal.push(colors[Math.floor(Math.random() * 4)]);

    box.innerHTML = signal.map(c =>
        `<div style="background:${c}"></div>`
    ).join("");

    start = Date.now();

    timer = setTimeout(() => {
        speed += .03;
        msg.textContent = "TOO SLOW!";
        round();
    }, 3000);
}

function press(c) {
    if (over) return;

    if (c != signal[pos]) {
        speed += .01;
        msg.textContent = "WRONG SIGNAL!";
        round();
        return;
    }

    pos++;

    if (pos == signal.length) {
        let time = Date.now() - start;
        score += 10;

        document.getElementById("score").textContent =
            "SCORE: " + score;

        if (time < 1500) {
            y = 0;
            msg.textContent = "PERFECT! ALIEN PUSHED BACK!";
        } else {
            msg.textContent = "SIGNAL DECODED!";
        }

        round();
    }
}

document.querySelectorAll("button").forEach(b =>
    b.onclick = () => press(b.dataset.color)
);

document.onkeydown = e => {
    let keys = {"1":"green","2":"blue","3":"purple","4":"yellow"};
    if (keys[e.key]) press(keys[e.key]);
};

function move() {
    if (over) return;

    y += speed;
    alien.style.transform = `translateY(${y}px)`;

    if (y >= 300) {
        over = true;
        clearTimeout(timer);
        msg.textContent = "THE ALIEN REACHED YOU!";
        return;
    }

    requestAnimationFrame(move);
}

round();
move();