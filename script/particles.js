class ParticleNetwork {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = {
            x: null,
            y: null,
            radius: 150
        };

        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        this.resize();
        this.createParticles();
    }

    resize() {
        // Find the hero section height to constrain the canvas.
        const heroSection = document.getElementById('hero');
        const height = heroSection ? heroSection.offsetHeight : window.innerHeight;

        this.canvas.width = window.innerWidth;
        this.canvas.height = height;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });

        // Add mouse move listener to the hero area
        const heroSection = document.getElementById('hero');
        if (heroSection) {
            heroSection.addEventListener('mousemove', (event) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.x = event.clientX - rect.left;
                this.mouse.y = event.clientY - rect.top;
            });

            heroSection.addEventListener('mouseout', () => {
                this.mouse.x = null;
                this.mouse.y = null;
            });
        }
    }

    createParticles() {
        this.particles = [];
        let numberOfParticles = (this.canvas.height * this.canvas.width) / 10000;

        // Ensure reasonable bounds
        numberOfParticles = Math.min(numberOfParticles, 150);

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((this.canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((this.canvas.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 2) - 1;
            let directionY = (Math.random() * 2) - 1;

            // Match the Neo-brutalist theme colors: Cyan, Pink, Yellow, or pure Black
            const colors = ['#66d9ef', '#ff79c6', '#ffd93d', '#000000'];
            let color = colors[Math.floor(Math.random() * colors.length)];

            this.particles.push(new Particle(this, x, y, directionX, directionY, size, color));
        }
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update();
        }
        this.connect();
    }

    connect() {
        let opacityValue = 1;
        for (let a = 0; a < this.particles.length; a++) {
            for (let b = a; b < this.particles.length; b++) {
                let distance = ((this.particles[a].x - this.particles[b].x) * (this.particles[a].x - this.particles[b].x)) +
                    ((this.particles[a].y - this.particles[b].y) * (this.particles[a].y - this.particles[b].y));

                if (distance < (this.canvas.width / 7) * (this.canvas.height / 7)) {
                    opacityValue = 1 - (distance / 10000);
                    // Get current theme color format
                    const isDark = document.body.dataset.theme === 'dark';
                    const strokeColor = isDark ? `rgba(255, 255, 255, ${opacityValue})` : `rgba(0, 0, 0, ${opacityValue})`;

                    this.ctx.strokeStyle = strokeColor;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[a].x, this.particles[a].y);
                    this.ctx.lineTo(this.particles[b].x, this.particles[b].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

class Particle {
    constructor(network, x, y, directionX, directionY, size, color) {
        this.network = network;
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        this.network.ctx.beginPath();
        this.network.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        this.network.ctx.fillStyle = this.color;
        this.network.ctx.fill();

        // Optional outline to fit the brutalist aesthetic
        this.network.ctx.strokeStyle = '#000';
        this.network.ctx.lineWidth = 1;
        this.network.ctx.stroke();
    }

    update() {
        // Check boundaries
        if (this.x > this.network.canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > this.network.canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Check mouse collision
        let dx = this.network.mouse.x - this.x;
        let dy = this.network.mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.network.mouse.radius + this.size) {
            if (this.network.mouse.x < this.x && this.x < this.network.canvas.width - this.size * 10) {
                this.x += 3;
            }
            if (this.network.mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 3;
            }
            if (this.network.mouse.y < this.y && this.y < this.network.canvas.height - this.size * 10) {
                this.y += 3;
            }
            if (this.network.mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 3;
            }
        }

        // Move particle
        this.x += this.directionX * 0.5;
        this.y += this.directionY * 0.5;

        // Draw particle
        this.draw();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ParticleNetwork('particle-canvas');
});
