const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

canvas.id = "bg-animation";
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.zIndex = "-2";
canvas.style.background = "#080808";

let particles = [];
let mouse = { x: null, y: null, radius: 150 };

window.addEventListener("mousemove", (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
});

// Clear mouse position when it leaves the window
window.addEventListener("mouseout", () => {
      mouse.x = null;
      mouse.y = null;
});

window.addEventListener("resize", () => {
      resize();
});

function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
}

class Particle {
      constructor() {
            this.reset();
      }

      reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
            this.speedX = (Math.random() * 0.8) - 0.4;
            this.speedY = (Math.random() * 0.8) - 0.4;
            this.color = "rgba(0, 204, 255, 0.6)"; // Pink Theme #f3edefff
      }

      update() {
            // Normal Movement
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce off walls
            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;

            // Mouse Repel Interaction
            if (mouse.x !== null && mouse.y !== null) {
                  let dx = mouse.x - this.x;
                  let dy = mouse.y - this.y;
                  let distance = Math.sqrt(dx * dx + dy * dy);

                  if (distance < mouse.radius) {
                        const force = (mouse.radius - distance) / mouse.radius;
                        const directionX = dx / distance;
                        const directionY = dy / distance;
                        const moveX = directionX * force * 10;
                        const moveY = directionY * force * 10;

                        // Repel away from mouse
                        this.x -= moveX;
                        this.y -= moveY;
                  }
            }
      }

      draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();

            // Soft glow for each dot
            ctx.shadowBlur = 8;
            ctx.shadowColor = "#00fffb72";
      }
}

function init() {
      particles = [];
      // Adjust density based on screen area
      const numberOfParticles = (canvas.width * canvas.height) / 11000;
      for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
      }
}

function connect() {
      for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                  let dx = particles[a].x - particles[b].x;
                  let dy = particles[a].y - particles[b].y;
                  let distance = Math.sqrt(dx * dx + dy * dy);

                  if (distance < 150) {
                        let opacity = 1 - (distance / 150);
                        ctx.strokeStyle = `rgba(255, 0, 79, ${opacity * 0.3})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                  }
            }
      }
}

function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Solid background base
      ctx.fillStyle = "#080808";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
      }
      connect();
      requestAnimationFrame(animate);
}

resize();
animate();
