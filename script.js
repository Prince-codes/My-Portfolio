// --- SMOOTH SCROLL (Lenis) ---
const lenis = new Lenis();
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

const isMobile = window.matchMedia('(max-width: 768px)').matches;

// ═══════════════════════════════════════════════════════
// CUSTOM CURSOR
// ═══════════════════════════════════════════════════════
if (!isMobile) {
    const cursor = document.getElementById('cursor');
    const cursorRing = document.getElementById('cursor-ring');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top  = mouseY + 'px';
    });

    // Lagged ring
    function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top  = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover swell on interactive elements
    document.querySelectorAll('a, button, .project-card, .skill-chip, .dock-item, .contact-card, .cta-button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%,-50%) scale(1.8)';
            cursorRing.style.width  = '60px';
            cursorRing.style.height = '60px';
            cursorRing.style.opacity = '0.3';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%,-50%) scale(1)';
            cursorRing.style.width  = '36px';
            cursorRing.style.height = '36px';
            cursorRing.style.opacity = '0.6';
        });
    });
}

// ═══════════════════════════════════════════════════════
// DOCK ANIMATION
// ═══════════════════════════════════════════════════════
const dock = document.getElementById('dock');
const dockItems = document.querySelectorAll('.dock-item');
const root = document.documentElement;

// Dynamic base size calculation to ensure consistency
function getBaseSizes() {
    if (window.innerWidth <= 600) {
        return { width: 40, height: 40, fontSize: 1 };
    } else if (window.innerWidth <= 768) {
        return { width: 45, height: 45, fontSize: 1.1 };
    } else {
        return { width: 50, height: 50, fontSize: 1.2 };
    }
}

let baseSizes = getBaseSizes();

// Update base sizes on window resize
window.addEventListener('resize', () => {
    baseSizes = getBaseSizes();
    if (!isMobile) resetDockItems();
});

function resetDockItems() {
    dockItems.forEach(item => {
        item.style.width = `${baseSizes.width}px`;
        item.style.height = `${baseSizes.height}px`;
        item.style.fontSize = `${baseSizes.fontSize}rem`;
        item.style.transform = 'scale(1) translateY(0)';
    });
}

if (dock && !isMobile) {
    dock.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        dockItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const itemCenterX = rect.left + rect.width / 2;
            const distance = Math.abs(mouseX - itemCenterX);
            const maxDistance = 150;
            
            // Symmetric scaling with better curve
            let scale = 1;
            if (distance < maxDistance) {
                const influence = 1 - (distance / maxDistance);
                scale = 1 + 0.6 * influence;
            }
            
            // Use transform for smooth scaling - more efficient than separately setting dimensions
            item.style.transform = `scale(${scale}) translateY(${-8 * (scale - 1)}px)`;
        });
    });
    
    dock.addEventListener('mouseleave', resetDockItems);
}

if (dock) {
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY + window.innerHeight / 2;
        document.querySelectorAll('section').forEach(section => {
            if (section.offsetTop <= currentScrollY && section.offsetTop + section.offsetHeight > currentScrollY) {
                const sectionId = section.getAttribute('id');
                dockItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) item.classList.add('active');
                });
            }
        });
    });
    document.querySelector('.dock-item[href="#home"]').classList.add('active');
}

// ═══════════════════════════════════════════════════════
// ANIME.JS STAGGER ANIMATIONS
// ═══════════════════════════════════════════════════════
function initAnime() {
    document.querySelectorAll('.animate-title, .animate-header').forEach(el => {
        el.innerHTML = el.textContent.replace(/\S/g, "<span class='letter' style='display:inline-block'>$&</span>");
    });

    anime.timeline()
        .add({
            targets: '.availability-badge',
            translateY: [20, 0], opacity: [0, 1],
            easing: 'easeOutQuad', duration: 600, delay: 100
        })
        .add({
            targets: '.hero-subtitle',
            translateY: [20, 0], opacity: [0, 1],
            easing: 'easeOutQuad', duration: 800, delay: 200
        }, 200)
        .add({
            targets: '.hero-title .letter',
            translateY: [100, 0], opacity: [0, 1],
            easing: 'easeOutExpo', duration: 1200,
            delay: anime.stagger(isMobile ? 15 : 30)
        }, 0);

    // Scroll observer for section headers
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime({
                    targets: entry.target.querySelectorAll('.letter'),
                    translateY: [50, 0], opacity: [0, 1],
                    easing: 'easeOutExpo',
                    duration: isMobile ? 600 : 800,
                    delay: anime.stagger(isMobile ? 10 : 20)
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.animate-header').forEach(h => observer.observe(h));
}

// ═══════════════════════════════════════════════════════
// SECTION REVEAL ON SCROLL
// ═══════════════════════════════════════════════════════
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ═══════════════════════════════════════════════════════
// COUNTER ANIMATION
// ═══════════════════════════════════════════════════════
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 1200;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current) + (target > 5 ? '+' : '');
    }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.counter').forEach(animateCounter);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stats-row').forEach(s => counterObserver.observe(s));

// ═══════════════════════════════════════════════════════
// TYPEWRITER
// ═══════════════════════════════════════════════════════
const taglineText = "𝚂𝚒𝚙𝚙𝚒𝚗𝚐 𝚌𝚘𝚏𝚏𝚎𝚎 ☕ >> 𝚃𝚞𝚛𝚗𝚒𝚗𝚐 𝚌𝚊𝚏𝚏𝚎𝚒𝚗𝚎 𝚒𝚗𝚝𝚘 <𝚌𝚘𝚍𝚎/>;";
let charIndex = 0;
const twEl = document.getElementById('typewriter-text');

function type() {
    if (charIndex < taglineText.length) {
        twEl.textContent += taglineText.charAt(charIndex);
        twEl.style.color = '#ffffff';
        twEl.style.opacity = '1';
        charIndex++;
        setTimeout(type, 50);
    }
}
setTimeout(type, 800);

// ═══════════════════════════════════════════════════════
// PROJECT CARD — MOUSE SPOTLIGHT + TILT
// ═══════════════════════════════════════════════════════
if (!isMobile) {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotX = ((y - cy) / cy) * -6;
            const rotY = ((x - cx) / cx) *  6;
            card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
            card.style.setProperty('--mouse-x', (x / rect.width * 100) + '%');
            card.style.setProperty('--mouse-y', (y / rect.height * 100) + '%');
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ═══════════════════════════════════════════════════════
// CLICK SPARK
// ═══════════════════════════════════════════════════════
document.addEventListener('click', (e) => {
    const sparkCount = isMobile ? 4 : 8;
    const neonBlue = root.style.getPropertyValue('--neon-blue') || '#7BBBFF';
    for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement('div');
        spark.classList.add('spark');
        document.body.appendChild(spark);
        spark.style.left = e.pageX + 'px';
        spark.style.top  = e.pageY + 'px';
        spark.style.background = neonBlue;
        const angle = Math.random() * Math.PI * 2;
        const vel   = Math.random() * 50 + 20;
        spark.style.setProperty('--dx', Math.cos(angle) * vel + 'px');
        spark.style.setProperty('--dy', Math.sin(angle) * vel + 'px');
        setTimeout(() => spark.remove(), 600);
    }
});

// ═══════════════════════════════════════════════════════
// HERO GLITCH ON HOVER
// ═══════════════════════════════════════════════════════
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    heroTitle.addEventListener('mouseenter', () => {
        heroTitle.classList.add('glitch');
        setTimeout(() => heroTitle.classList.remove('glitch'), 1000);
    });
}

// ═══════════════════════════════════════════════════════
// THEME SYSTEM — 6 themes with picker UI
// ═══════════════════════════════════════════════════════
const themes = [
    {
        name: 'GitHub Dark',
        vars: {
            '--bg-dark': '#0d1117', '--bg-panel': '#161b22', '--card-bg': '#161b22',
            '--accent-muted': '#4A5C6A', '--text-gray': '#c9d1d9', '--text-white': '#f0f6fc',
            '--neon-blue': '#58a6ff', '--accent-purple': '#B8A9FF',
            '--glass': 'rgba(17, 33, 45, 0.75)', '--border': 'rgba(88, 166, 255, 0.18)',
            '--shadow-color': 'rgba(0,0,0,0.45)'
        },
        balls: ['#1c2d3f', '#253745', '#0d1f2d']
    },
    {
        name: 'Dracula',
        vars: {
            '--bg-dark': '#1e1f29', '--bg-panel': '#282a36', '--card-bg': '#282a36',
            '--accent-muted': '#6272a4', '--text-gray': '#cdd6f4', '--text-white': '#f8f8f2',
            '--neon-blue': '#bd93f9', '--accent-purple': '#ff79c6',
            '--glass': 'rgba(30, 31, 41, 0.8)', '--border': 'rgba(189, 147, 249, 0.22)',
            '--shadow-color': 'rgba(0,0,0,0.5)'
        },
        balls: ['#2d2f3e', '#363848', '#1a1b26']
    },
    {
        name: 'Nord',
        vars: {
            '--bg-dark': '#242933', '--bg-panel': '#2e3440', '--card-bg': '#2e3440',
            '--accent-muted': '#4c566a', '--text-gray': '#d8dee9', '--text-white': '#eceff4',
            '--neon-blue': '#88c0d0', '--accent-purple': '#81a1c1',
            '--glass': 'rgba(36, 41, 51, 0.8)', '--border': 'rgba(136, 192, 208, 0.2)',
            '--shadow-color': 'rgba(0,0,0,0.4)'
        },
        balls: ['#3b4252', '#434c5e', '#2e3440']
    },
    {
        name: 'Catppuccin',
        vars: {
            '--bg-dark': '#292c3c', '--bg-panel': '#303446', '--card-bg': '#303446',
            '--accent-muted': '#626880', '--text-gray': '#c6d0f5', '--text-white': '#cdd6f4',
            '--neon-blue': '#96CDFB', '--accent-purple': '#ca9ee6',
            '--glass': 'rgba(41, 44, 60, 0.8)', '--border': 'rgba(150, 205, 251, 0.18)',
            '--shadow-color': 'rgba(0,0,0,0.4)'
        },
        balls: ['#363a4f', '#414559', '#292c3c']
    },
    {
        name: 'Tokyo Night',
        vars: {
            '--bg-dark': '#13141f', '--bg-panel': '#1a1b2e', '--card-bg': '#1f2035',
            '--accent-muted': '#414868', '--text-gray': '#a9b1d6', '--text-white': '#c0caf5',
            '--neon-blue': '#7aa2f7', '--accent-purple': '#bb9af7',
            '--glass': 'rgba(19, 20, 31, 0.82)', '--border': 'rgba(122, 162, 247, 0.2)',
            '--shadow-color': 'rgba(0,0,0,0.5)'
        },
        balls: ['#1a1b2e', '#24253d', '#16172a']
    },
    {
        name: 'Solarized',
        vars: {
            '--bg-dark': '#001e26', '--bg-panel': '#002b36', '--card-bg': '#073642',
            '--accent-muted': '#586e75', '--text-gray': '#93a1a1', '--text-white': '#fdf6e3',
            '--neon-blue': '#268bd2', '--accent-purple': '#2aa198',
            '--glass': 'rgba(0, 30, 38, 0.82)', '--border': 'rgba(38, 139, 210, 0.22)',
            '--shadow-color': 'rgba(0,0,0,0.5)'
        },
        balls: ['#002b36', '#073642', '#00161c']
    }
];

let currentThemeIndex = 0;

function applyTheme(index) {
    const t = themes[index];
    for (const [k, v] of Object.entries(t.vars)) root.style.setProperty(k, v);
    document.body.setAttribute('data-theme', t.name.toLowerCase().replace(/\s/g, '-'));
    balls.forEach(b => { b.color = t.balls[Math.floor(Math.random() * t.balls.length)]; });

    // Update swatch active state
    document.querySelectorAll('.swatch').forEach((s, i) => s.classList.toggle('active', i === index));

    // Update trigger label
    const label = document.getElementById('themeLabel');
    if (label) label.textContent = t.name;

    currentThemeIndex = index;
}

// Picker open/close
const themeBtn     = document.getElementById('themeBtn');
const themePanel   = document.getElementById('themePanel');
const themePicker  = document.getElementById('themePicker');

if (themeBtn) {
    themeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        themePicker.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!themePicker.contains(e.target)) themePicker.classList.remove('open');
    });

    document.querySelectorAll('.swatch').forEach(swatch => {
        swatch.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(swatch.getAttribute('data-theme-index'));
            applyTheme(idx);
            setTimeout(() => themePicker.classList.remove('open'), 180);
        });
    });
}


// ═══════════════════════════════════════════════════════
// CANVAS BALLPIT
// ═══════════════════════════════════════════════════════
const canvas = document.getElementById('ballpit');
const ctx = canvas.getContext('2d');
let balls = [];
let mouse = { x: undefined, y: undefined };

function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    initBalls();
}
window.addEventListener('resize', resize);
window.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; });

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
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
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
            if (this.x !== this.baseX) this.x -= (this.x - this.baseX) / 10;
            if (this.y !== this.baseY) this.y -= (this.y - this.baseY) / 10;
        }
        this.draw();
    }
}

function initBalls() {
    balls = [];
    const colors = ['#253745', '#4A5C6A', '#11212D'];
    const ballCount = isMobile ? 30 : 60;
    for (let i = 0; i < ballCount; i++) {
        let r     = Math.random() * 15 + 5;
        let x     = Math.random() * canvas.width;
        let y     = Math.random() * canvas.height;
        let color = colors[Math.floor(Math.random() * colors.length)];
        balls.push(new Ball(x, y, r, color));
    }
}

function animateBalls() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach(ball => ball.update());
    requestAnimationFrame(animateBalls);
}

// ═══════════════════════════════════════════════════════
// MATRIX RAIN EASTER EGG
// Type "matrix" anywhere on the page to trigger it
// ═══════════════════════════════════════════════════════
const matrixCanvas  = document.getElementById('matrix-canvas');
const matrixCtx     = matrixCanvas.getContext('2d');
let matrixActive    = false;
let matrixAnimFrame = null;
let matrixTimeout   = null;
let typedBuffer     = '';

const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ01ﾊﾐﾋｲｳｦABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
let matrixColumns = [];

function startMatrix() {
    if (matrixActive) return;
    matrixActive = true;
    matrixCanvas.style.display = 'block';
    matrixCanvas.width  = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    const fontSize = 14;
    const cols = Math.floor(matrixCanvas.width / fontSize);
    matrixColumns = Array(cols).fill(1);

    function drawMatrix() {
        matrixCtx.fillStyle = 'rgba(13, 17, 23, 0.05)';
        matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        matrixCtx.fillStyle = '#58a6ff';
        matrixCtx.font = fontSize + 'px JetBrains Mono';
        matrixColumns.forEach((y, x) => {
            const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            matrixCtx.fillText(char, x * fontSize, y * fontSize);
            if (y * fontSize > matrixCanvas.height && Math.random() > 0.975) matrixColumns[x] = 0;
            matrixColumns[x]++;
        });
        matrixAnimFrame = requestAnimationFrame(drawMatrix);
    }
    drawMatrix();

    // Auto-stop after 4 seconds
    matrixTimeout = setTimeout(stopMatrix, 4000);
}

function stopMatrix() {
    matrixActive = false;
    cancelAnimationFrame(matrixAnimFrame);
    clearTimeout(matrixTimeout);
    matrixCtx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    matrixCanvas.style.display = 'none';
}

document.addEventListener('keydown', (e) => {
    typedBuffer = (typedBuffer + e.key).slice(-6).toLowerCase();
    if (typedBuffer === 'matrix') {
        typedBuffer = '';
        matrixActive ? stopMatrix() : startMatrix();
    }
    if (e.key === 'Escape' && matrixActive) stopMatrix();
});

// ═══════════════════════════════════════════════════════
// CONTACT CARD FLIP
// ═══════════════════════════════════════════════════════
const card = document.getElementById('contactCard');
card.addEventListener('click', () => { card.classList.toggle('flipped'); });

// ═══════════════════════════════════════════════════════
// INIT ON LOAD
// ═══════════════════════════════════════════════════════
window.onload = () => {
    resize();
    animateBalls();
    initAnime();
};
