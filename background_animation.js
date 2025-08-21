const canvas = document.getElementById("canvas-bg");
const ctx = canvas.getContext("2d");
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
let mouseX = 0
let mouseY = 0

function ideal_particle_number(){
    return width * height / 10000
}

const starting_number = ideal_particle_number();
const connect_threshold = 200;
const particles = [];

class Particle {
    constructor(x, y, vx, vy, r = 5) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.r = r;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
    }

    isOutOfBounds() {
        return (this.x < -50 || this.x > width + 50 || this.y < -50 || this.y > height + 50);
    }
}

function randomVelocity() {
    let speed = Math.random() + 0.5;
    let angle = Math.random() * 2 * Math.PI;
    return { vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed };
}

function spawnParticleAtEdge() {
    let edge = Math.floor(Math.random() * 4);
    let x, y;
    if (edge === 0) { // top
        x = Math.random() * width; y = -5;
    } else if (edge === 1) { // right
        x = width + 5; y = Math.random() * height;
    } else if (edge === 2) { // bottom
        x = Math.random() * width; y = height + 5;
    } else { // left
        x = -5; y = Math.random() * height;
    }
    const { vx, vy } = randomVelocity();
    return new Particle(x, y, vx, vy);
}

function initParticles() {
    for (let i = 0; i < starting_number; i++) {
        let x = Math.random() * width;
        let y = Math.random() * height;
        const { vx, vy } = randomVelocity();
        particles.push(new Particle(x, y, vx, vy));
    }
}

function drawConnections() {
    ctx.lineWidth = 5;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < connect_threshold) {
                ctx.globalAlpha = 1 - dist / connect_threshold;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    for (let j = 0; j < particles.length; j++) {
        let dx = mouseX - particles[j].x;
        let dy = mouseY - particles[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < connect_threshold) {
            ctx.globalAlpha = 1 - dist / connect_threshold;
            ctx.beginPath();
            ctx.moveTo(mouseX, mouseY);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
        }
    }

    ctx.globalAlpha = 1;
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.update();
        p.draw();
        if (p.isOutOfBounds()) {
            particles.splice(i, 1);
            if(particles.length < ideal_particle_number()) particles.push(spawnParticleAtEdge());
        }
    }

    // Draw links
    drawConnections();

    requestAnimationFrame(animate);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    width = canvas.width;
    height = canvas.height;
}

function connectMouse(mouseEvent){
    mouseX = mouseEvent.clientX;
    mouseY = mouseEvent.clientY;
}

window.addEventListener("mousemove", connectMouse);
window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // call once at start

initParticles();
animate();