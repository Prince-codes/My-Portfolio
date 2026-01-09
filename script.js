// --- SMOOTH SCROLL (Lenis is used) ---
const lenis = new Lenis();
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Detect if mobile
const isMobile = window.matchMedia('(max-width: 768px)').matches;

// --- DOCK ANIMATION (Mimicking React Dock) ---
const dock = document.getElementById('dock');
const dockItems = document.querySelectorAll('.dock-item');
const baseWidth = 50;
const root = document.documentElement;

if (dock && !isMobile) {
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
}

// Handle Dock Active State on Scroll/Click
if (dock) {
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

// ---  ANIME.JS STAGGER & SCROLL ANIMATIONS ---

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
            delay: anime.stagger(isMobile ? 15 : 30)
        }, 0);

    // Scroll Trigger for Section headers - reduced stagger on mobile
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                anime({
                    targets: entry.target.querySelectorAll('.letter'),
                    translateY: [50, 0],
                    opacity: [0,1],
                    easing: "easeOutExpo",
                    duration: isMobile ? 600 : 800,
                    delay: anime.stagger(isMobile ? 10 : 20)
                });
                observer.unobserve(entry.target);
            }
        });
    }, {threshold: 0.5});

    document.querySelectorAll('.animate-header').forEach(h => observer.observe(h));
}


// --- TYPEWRITER ---
const taglineText = "𝚂𝚒𝚙𝚙𝚒𝚗𝚐 𝚌𝚘𝚏𝚏𝚎𝚎 ☕ >> 𝚃𝚞𝚛𝚗𝚒𝚗𝚐 𝚌𝚊𝚏𝚏𝚎𝚒𝚗𝚎 𝚒𝚗𝚝𝚘 <𝚌𝚘𝚍𝚎/>;";
let charIndex = 0;
function type() {
    if (charIndex < taglineText.length) {
        document.getElementById('typewriter-text').innerHTML += taglineText.charAt(charIndex);
        charIndex++;
        setTimeout(type, 50);
    }
}
setTimeout(type, 1500); 

// --- CLICK SPARK ---
document.addEventListener('click', (e) => {
    // Reduce spark particles on mobile for better performance
    const sparkCount = isMobile ? 4 : 8;
    const neonBlue = root.style.getPropertyValue('--neon-blue') || '#7BBBFF';

    for(let i=0; i<sparkCount; i++) {
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

// ---  THEME TOGGLE  ---
const toggleSwitch = document.querySelector('#switch');

const darkTheme = {
    '--bg-dark': '#0d1117', '--bg-panel': '#161b22', '--card-bg': '#161b22', 
    '--accent-muted': '#4A5C6A', '--text-gray': '#f0f6fc', '--text-white': '#f0f6fc', 
    '--neon-blue': '#58a6ff', '--accent-purple': '#B8A9FF', '--glass': 'rgba(17, 33, 45, 0.7)', 
    '--border': 'rgba(123, 187, 255, 0.2)', '--shadow-color': 'rgba(0, 0, 0, 0.4)'
};

const lightTheme = {
    '--bg-dark': '#232323', '--bg-panel': '#232323', '--card-bg': '#232323', 
    '--accent-muted': '#FFFFFF', '--text-gray': '#FFFFFF', '--text-white': '#FFFFFF', 
    '--neon-blue': '#008DF8', '--accent-purple': '#6D43A6', '--glass': 'rgba(35, 35, 35, 0.7)', 
    '--border': 'rgba(255, 255, 255, 0.2)', '--shadow-color': 'rgba(0, 0, 0, 0.4)'
};

const catppuccinFrappe = {
    '--bg-dark': '#303446', '--bg-panel': '#303446', '--card-bg': '#303446', 
    '--accent-muted': '#D9E0EE', '--text-gray': '#D9E0EE', '--text-white': '#D9E0EE', 
    '--neon-blue': '#96CDFB', '--accent-purple': '#F2CDCD', '--glass': 'rgba(48, 52, 70, 0.7)', 
    '--border': 'rgba(217, 224, 238, 0.2)', '--shadow-color': 'rgba(0, 0, 0, 0.4)'
};

const cityLights = {
    '--bg-dark': '#171D23', '--bg-panel': '#171D23', '--card-bg': '#171D23', 
    '--accent-muted': '#B7C5D3', '--text-gray': '#B7C5D3', '--text-white': '#B7C5D3', 
    '--neon-blue': '#539AFC', '--accent-purple': '#D2A6FF', '--glass': 'rgba(23, 29, 35, 0.7)', 
    '--border': 'rgba(183, 197, 211, 0.2)', '--shadow-color': 'rgba(0, 0, 0, 0.4)'
};

const themes = [darkTheme, lightTheme, catppuccinFrappe, cityLights];
const themeColors = [
    ['#253745', '#4A5C6A', '#11212D'], // dark
    ['#008DF8', '#6D43A6', '#00D8EB'], // argonaut
    ['#96CDFB', '#F2CDCD', '#89DCEB'], // frappe
    ['#539AFC', '#D2A6FF', '#70E1E8'] // city lights
];
let currentThemeIndex = 0;

function applyTheme(themeIndex) {
    const theme = themes[themeIndex];
    for (const [key, value] of Object.entries(theme)) {
        root.style.setProperty(key, value);
    }
    document.body.setAttribute('data-theme', ['dark', 'argonaut', 'frappe', 'citylights'][themeIndex]);
    
    balls.forEach(b => {
        b.color = themeColors[themeIndex][Math.floor(Math.random()*3)];
    });
}

toggleSwitch.addEventListener('change', function(e) {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    applyTheme(currentThemeIndex);
});

// --- CANVAS BALLPIT  ---
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
    // Reduce ball count on mobile for better performance
    const ballCount = isMobile ? 30 : 60;
    for (let i = 0; i < ballCount; i++) {
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

// --- CONTACT CARD FLIP ---
const card = document.getElementById("contactCard");

card.addEventListener("click", () => {
    card.classList.toggle("flipped");
});

// Initialization on load
window.onload = () => {
    resize();
    animateBalls();
    initAnime();
};
