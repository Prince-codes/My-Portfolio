// --- 1. SMOOTH SCROLL (Lenis) ---
const lenis = new Lenis();
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// --- 2. DOCK ANIMATION (Mimicking React Dock) ---
const dock = document.getElementById('dock');
const dockItems = document.querySelectorAll('.dock-item');
const baseWidth = 50;
const root = document.documentElement;

if (dock) {
    dock.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        
        dockItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const itemCenterX = rect.left + rect.width / 2;
            const distance = Math.abs(mouseX - itemCenterX);
            
            let scale = 1;
            if (distance < 150) {
                // Scale up to 1.6x when mouse is directly over
                scale = 1 + (1.6 - 1) * (1 - distance / 150); 
            }
            
            item.style.width = `${baseWidth * scale}px`;
            item.style.height = `${baseWidth * scale}px`;
            item.style.fontSize = `${1.2 * scale}rem`;
        });
    });

    dock.addEventListener('mouseleave', () => {
        dockItems.forEach(item => {
            item.style.width = `${baseWidth}px`;
            item.style.height = `${baseWidth}px`;
            item.style.fontSize = `1.2rem`;
        });
    });

    // Handle Dock Active State on Scroll/Click
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY + window.innerHeight / 2;
        document.querySelectorAll('section').forEach(section => {
            if (section.offsetTop <= currentScrollY && section.offsetTop + section.offsetHeight > currentScrollY) {
                const sectionId = section.getAttribute('id');
                dockItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    });

    // Initial check for active state
    document.querySelector('.dock-item[href="#home"]').classList.add('active');
}

// --- 3. ANIME.JS STAGGER & SCROLL ANIMATIONS ---

function initAnime() {
    // Wrap header letters
    document.querySelectorAll('.animate-title, .animate-header').forEach(el => {
        el.innerHTML = el.textContent.replace(/\S/g, "<span class='letter' style='display:inline-block'>$&</span>");
    });

    // Intro Animation
    anime.timeline()
        .add({
            targets: '.hero-subtitle',
            translateY: [20, 0],
            opacity: [0, 1],
            easing: "easeOutQuad",
            duration: 800,
            delay: 300
        })
        .add({
            targets: '.hero-title .letter',
            translateY: [100,0],
            opacity: [0,1],
            easing: "easeOutExpo",
            duration: 1200,
            delay: anime.stagger(30)
        }, 0); // Start title animation at the same time as subtitle for smooth feel


    // Scroll Trigger for Section headers
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                anime({
                    targets: entry.target.querySelectorAll('.letter'),
                    translateY: [50, 0],
                    opacity: [0,1],
                    easing: "easeOutExpo",
                    duration: 800,
                    delay: anime.stagger(20)
                });
                observer.unobserve(entry.target);
            }
        });
    }, {threshold: 0.5});

    document.querySelectorAll('.animate-header').forEach(h => observer.observe(h));
}


// --- 4. TYPEWRITER ---
const taglineText = "𝚂𝚒𝚙𝚙𝚒𝚗𝚐 𝚌𝚘𝚏𝚏𝚎𝚎 ☕ >> 𝚃𝚞𝚛𝚗𝚒𝚗𝚐 𝚌𝚊𝚏𝚏𝚎𝚒𝚗𝚎 𝚒𝚗𝚝𝚘 <𝚌𝚘𝚍𝚎/>;";
let charIndex = 0;
function type() {
    if (charIndex < taglineText.length) {
        document.getElementById('typewriter-text').innerHTML += taglineText.charAt(charIndex);
        charIndex++;
        setTimeout(type, 50);
    }
}
setTimeout(type, 1500); // Wait for hero animation to start

// --- 5. CLICK SPARK ---
document.addEventListener('click', (e) => {
    const neonBlue = root.style.getPropertyValue('--neon-blue') || '#7BBBFF';

    for(let i=0; i<8; i++) {
        const spark = document.createElement('div');
        spark.classList.add('spark');
        document.body.appendChild(spark);
        
        spark.style.left = e.pageX + 'px';
        spark.style.top = e.pageY + 'px';
        spark.style.background = neonBlue;
        
        const angle = Math.random() * Math.PI * 2;
        const vel = Math.random() * 50 + 20;
        
        spark.style.setProperty('--dx', Math.cos(angle) * vel + 'px');
        spark.style.setProperty('--dy', Math.sin(angle) * vel + 'px');
        
        setTimeout(() => spark.remove(), 600);
    }
});

// --- 6. THEME TOGGLE (FIXED) ---
const toggleSwitch = document.querySelector('#switch');

const darkTheme = {
    '--bg-dark': '#06141B', '--bg-panel': '#11212D', '--card-bg': '#253745', 
    '--accent-muted': '#4A5C6A', '--text-gray': '#9BA8AB', '--text-white': '#CCD0CF', 
    '--neon-blue': '#7BBBFF', '--accent-purple': '#B8A9FF', '--glass': 'rgba(17, 33, 45, 0.7)', 
    '--border': 'rgba(123, 187, 255, 0.2)', '--shadow-color': 'rgba(0, 0, 0, 0.4)'
};

const lightTheme = {
    '--bg-dark': '#F2FDFF', '--bg-panel': '#e0e6e8', '--card-bg': '#ffffff', 
    '--accent-muted': '#CCD0CF', '--text-gray': '#4A5C6A', '--text-white': '#050F2A', 
    '--neon-blue': '#050F2A', '--accent-purple': '#7BBBFF', '--glass': 'rgba(255, 255, 255, 0.8)', 
    '--border': 'rgba(5, 15, 42, 0.1)', '--shadow-color': 'rgba(0, 0, 0, 0.1)'
};

function applyTheme(theme) {
    for (const [key, value] of Object.entries(theme)) {
        root.style.setProperty(key, value);
    }
    document.body.setAttribute('data-theme', theme === darkTheme ? 'dark' : 'light');
    
    // Update canvas balls for new theme
    const isLight = theme === lightTheme;
    balls.forEach(b => {
        const lightColors = ['#B8A9FF', '#7BBBFF', '#CCD0CF'];
        const darkColors = ['#253745', '#4A5C6A', '#11212D'];
        b.color = isLight ? lightColors[Math.floor(Math.random()*3)] : darkColors[Math.floor(Math.random()*3)];
    });
}

toggleSwitch.addEventListener('change', function(e) {
    if(e.target.checked) {
        applyTheme(lightTheme);
    } else {
        applyTheme(darkTheme);
    }
});

// --- 7. CANVAS BALLPIT (Physics-ish) ---
const canvas = document.getElementById('ballpit');
const ctx = canvas.getContext('2d');
let balls = [];
let mouse = { x: undefined, y: undefined };

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initBalls();
}

window.addEventListener('resize', resize);
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class Ball {
    constructor(x, y, r, color) {
        this.x = x; this.y = y; this.r = r; this.color = color;
        this.baseX = x; this.baseY = y;
        this.density = (Math.random() * 30) + 1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    update() {
        // Interaction (Repulsion)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = 150;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < maxDistance) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            // Return to base position
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx/10;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy/10;
            }
        }
        this.draw();
    }
}

function initBalls() {
    balls = [];
    const colors = ['#253745', '#4A5C6A', '#11212D'];
    for (let i = 0; i < 60; i++) {
        let r = Math.random() * 15 + 5;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let color = colors[Math.floor(Math.random() * colors.length)];
        balls.push(new Ball(x, y, r, color));
    }
}

function animateBalls() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach(ball => ball.update());
    requestAnimationFrame(animateBalls);
}

// Initialization on load
window.onload = () => {
    resize();
    animateBalls();
    initAnime();
};
