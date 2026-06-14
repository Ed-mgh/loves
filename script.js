const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);

const intro = document.getElementById("intro");
const startBtn = document.getElementById("startBtn");
const nameInput = document.getElementById("nameInput");

const message = document.getElementById("message");
const personName = document.getElementById("personName");

let started = false;
let startTime = 0;
let finished = false;

const heartPoints = [];
const particles = [];

function heart(t) {

    return {

        x: 16 * Math.pow(Math.sin(t), 3),

        y:
            13 * Math.cos(t)
            - 5 * Math.cos(2 * t)
            - 2 * Math.cos(3 * t)
            - Math.cos(4 * t)

    };
}

class Particle {

    constructor(x, y, color) {

        this.x = x;
        this.y = y;

        this.vx = (Math.random() - 0.5) * 3;
        this.vy = (Math.random() - 0.5) * 3;

        this.life = 80;

        this.color = color;
    }

    update() {

        this.x += this.vx;
        this.y += this.vy;

        this.vx *= 0.98;
        this.vy *= 0.98;

        this.life--;

        ctx.save();

        ctx.globalAlpha = this.life / 80;

        ctx.beginPath();

        ctx.fillStyle = this.color;

        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;

        ctx.arc(
            this.x,
            this.y,
            2,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();
    }
}

startBtn.addEventListener("click", () => {

    const name = nameInput.value.trim();

    if (!name) {

        alert("Ingresa un nombre");
        return;
    }

    personName.textContent = name;

    intro.style.opacity = "0";

    setTimeout(() => {

        intro.style.display = "none";

    }, 800);

    started = true;
    startTime = performance.now();
});

function drawHeart(color, beat = 1) {

    ctx.save();

    ctx.translate(
        canvas.width / 2,
        canvas.height / 2
    );

    ctx.scale(beat, beat);

    ctx.translate(
        -canvas.width / 2,
        -canvas.height / 2
    );

    ctx.beginPath();

    for (let i = 0; i < heartPoints.length; i++) {

        const p = heartPoints[i];

        if (i === 0) {

            ctx.moveTo(p.x, p.y);

        } else {

            ctx.lineTo(p.x, p.y);
        }
    }

    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.strokeStyle = color;

    ctx.shadowBlur = 30;
    ctx.shadowColor = color;

    ctx.stroke();

    ctx.restore();
}

function animate() {

    requestAnimationFrame(animate);

    ctx.shadowBlur = 0;

    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if (!started) return;

    const elapsed =
        performance.now() - startTime;

    const duration = 10000;

    const progress =
        Math.min(elapsed / duration, 1);

    const hue =
        (performance.now() * 0.05) % 360;

    const color =
        `hsl(${hue},100%,60%)`;

    if (progress < 1) {

        const t =
            progress * Math.PI * 2;

        const p = heart(t);

        const scale =
            Math.min(
                canvas.width,
                canvas.height
            ) / 35;

        const x =
            canvas.width / 2 +
            p.x * scale;

        const y =
            canvas.height / 2 -
            p.y * scale;

        heartPoints.push({ x, y });

        for (let i = 0; i < 8; i++) {

            particles.push(
                new Particle(
                    x,
                    y,
                    color
                )
            );
        }

        drawHeart(color);

        ctx.beginPath();

        ctx.fillStyle = color;

        ctx.shadowBlur = 40;
        ctx.shadowColor = color;

        ctx.arc(
            x,
            y,
            7,
            0,
            Math.PI * 2
        );

        ctx.fill();

    } else {

        finished = true;

        const beat =
            1 +
            Math.sin(
                performance.now() * 0.004
            ) * 0.025;

        drawHeart(color, beat);

        message.style.opacity = "1";

        message.style.color = "#fff";

        message.style.textShadow =
            `
            0 0 10px ${color},
            0 0 20px ${color},
            0 0 40px ${color}
            `;
    }

    for (
        let i = particles.length - 1;
        i >= 0;
        i--
    ) {

        particles[i].update();

        if (
            particles[i].life <= 0
        ) {

            particles.splice(i, 1);
        }
    }
}

animate();
