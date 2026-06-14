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
const personName = document.getElementById("personName");
const message = document.getElementById("message");

let started = false;
let startTime = 0;

const heartPath = [];
const particles = [];

class Particle {

    constructor(x, y, color) {

        this.x = x;
        this.y = y;

        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;

        this.life = 100;
        this.color = color;
        this.size = Math.random() * 2 + 1;
    }

    update() {

        this.x += this.vx;
        this.y += this.vy;

        this.vx *= 0.98;
        this.vy *= 0.98;

        this.life--;

        const alpha = this.life / 100;

        ctx.beginPath();

        ctx.fillStyle = this.color;

        ctx.shadowBlur = 12;
        ctx.shadowColor = this.color;

        ctx.globalAlpha = alpha;

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.globalAlpha = 1;
    }
}

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
    }, 1000);

    started = true;
    startTime = performance.now();
});

function animate() {

    requestAnimationFrame(animate);

    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";

    ctx.fillStyle = "rgba(0,0,0,0.25)";
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
        (performance.now() * 0.08) % 360;

    const color =
        `hsl(${hue},100%,60%)`;

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

    heartPath.push({
        x,
        y,
        color
    });

    ctx.beginPath();

    for (let i = 0; i < heartPath.length; i++) {

        const point = heartPath[i];

        if (i === 0) {

            ctx.moveTo(
                point.x,
                point.y
            );

        } else {

            ctx.lineTo(
                point.x,
                point.y
            );
        }
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.shadowBlur = 25;
    ctx.shadowColor = color;

    ctx.stroke();

    for (let i = 0; i < 10; i++) {

        particles.push(
            new Particle(
                x,
                y,
                color
            )
        );
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

    if (progress >= 1) {

        message.style.opacity = "1";

        const pulse =
            1 +
            Math.sin(
                performance.now() * 0.005
            ) * 0.04;

        message.style.transform =
            `translate(-50%,-50%) scale(${pulse})`;

        message.style.color = "#ffffff";

        message.style.textShadow =
            `0 0 10px ${color},
             0 0 20px ${color},
             0 0 40px ${color}`;
    }
}

animate();