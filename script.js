/**
 * CONVITE DE CASAMENTO - JAVASCRIPT COMPLETO
 * Controla: Música automática, confete, animação do envelope, contagem regressiva, carrossel
 */

// ─── CONFIGURAÇÕES ───────────────────────────────────────────────────────────
const WEDDING_DATE = new Date('2026-12-27T00:00:00').getTime();
const NOIVO_WHATSAPP = '5500000000000'; // Substituir pelo número real
const NOIVA_WHATSAPP = '5500000000001'; // Substituir pelo número real
const CAROUSEL_INTERVAL = 4000; // Tempo entre slides em ms (4 segundos)

// ─── ELEMENTOS DO DOM ────────────────────────────────────────────────────────
const envelopeScreen = document.getElementById('envelopeScreen');
const envelopeBtn = document.getElementById('envelopeBtn');
const conviteContent = document.getElementById('conviteContent');
const envelopeText = document.querySelector('.envelope-text');
const backgroundMusic = document.getElementById('backgroundMusic');
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');

const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

// ─── CARROSSEL ───────────────────────────────────────────────────────────────
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
let carouselInterval;

// ─── CONFIGURAÇÃO DO CANVAS ──────────────────────────────────────────────────
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ─── PARTÍCULAS DE CONFETE ───────────────────────────────────────────────────
let particles = [];

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = Math.random() * 4 - 2;
        this.gravity = 0.2;
        this.size = Math.random() * 6 + 3;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        this.opacity = 1;
        this.color = ['#3d6b4f', '#b8965a', '#c8d9b0', '#f5f0e8'][Math.floor(Math.random() * 4)];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.rotation += this.rotationSpeed;
        this.opacity -= 0.01;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }

    isAlive() {
        return this.opacity > 0 && this.y < canvas.height;
    }
}

// ─── FUNÇÃO: Criar Confete ───────────────────────────────────────────────────
function createConfetti() {
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = -10;
        particles.push(new Particle(x, y));
    }
}

// ─── FUNÇÃO: Animar Confete ──────────────────────────────────────────────────
function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter(p => p.isAlive());

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    if (particles.length > 0) {
        requestAnimationFrame(animateConfetti);
    }
}

// ─── FUNÇÃO: Atualizar Contagem Regressiva ──────────────────────────────────
function updateCountdown() {
    const now = Date.now();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
        daysEl.textContent = '0';
        hoursEl.textContent = '0';
        minutesEl.textContent = '0';
        secondsEl.textContent = '0';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
}

// ─── FUNÇÃO: Mostrar Slide do Carrossel ──────────────────────────────────────
function showSlide(index) {
    // Remove classe active de todos os slides e dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Adiciona classe active ao slide e dot atual
    slides[index].classList.add('active');
    dots[index].classList.add('active');

    currentSlide = index;
}

// ─── FUNÇÃO: Próximo Slide ───────────────────────────────────────────────────
function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// ─── FUNÇÃO: Iniciar Carrossel Automático ────────────────────────────────────
function startCarousel() {
    showSlide(0); // Mostrar primeiro slide
    carouselInterval = setInterval(nextSlide, CAROUSEL_INTERVAL);
}

// ─── FUNÇÃO: Parar Carrossel ─────────────────────────────────────────────────
function stopCarousel() {
    clearInterval(carouselInterval);
}

// ─── FUNÇÃO: Abrir Envelope ─────────────────────────────────────────────────
function openEnvelope() {
    envelopeBtn.classList.add('clicked');
    envelopeText.classList.add('hidden');

    // Criar confete
    createConfetti();
    animateConfetti();

    // Reproduzir música
    if (backgroundMusic) {
        backgroundMusic.play().catch(() => {
            console.log('Música não pôde ser reproduzida automaticamente');
        });
    }

    setTimeout(() => {
        envelopeScreen.classList.add('hidden');
        conviteContent.classList.remove('hidden');
        startCarousel(); // Iniciar carrossel quando abrir o convite
    }, 700);
}

// ─── FUNCTION: Iniciar Música Automática ────────────────────────────────────
function initAutoMusic() {
    // Tentar reproduzir música automaticamente
    if (backgroundMusic) {
        backgroundMusic.volume = 0.3; // Volume em 30%
        const playPromise = backgroundMusic.play();

        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Falha na reprodução automática - usuário precisa interagir
                document.addEventListener('click', () => {
                    if (backgroundMusic.paused) {
                        backgroundMusic.play();
                    }
                }, { once: true });
            });
        }
    }
}

// ─── EVENT LISTENERS ────────────────────────────────────────────────────────
envelopeBtn.addEventListener('click', openEnvelope);

// Clique nos dots do carrossel
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        stopCarousel();
        showSlide(index);
        startCarousel(); // Reiniciar carrossel
    });
});

// Redimensionar canvas quando a janela mudar
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ─── INICIALIZAÇÃO ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Atualizar contagem regressiva imediatamente
    updateCountdown();

    // Atualizar a cada segundo
    setInterval(updateCountdown, 1000);

    // Atualizar links de WhatsApp com números corretos
    const novoLinks = document.querySelectorAll('a[href*="wa.me"]');
    novoLinks.forEach(link => {
        if (link.href.includes('5500000000000')) {
            link.href = `https://wa.me/${NOIVO_WHATSAPP}?text=Olá!%20Confirmo%20minha%20presença%20no%20casamento%20de%20Fransuilame%20e%20Samara%20🌿`;
        } else if (link.href.includes('5500000000001' )) {
            link.href = `https://wa.me/${NOIVA_WHATSAPP}?text=Olá!%20Confirmo%20minha%20presença%20no%20casamento%20de%20Fransuilame%20e%20Samara%20🌿`;
        }
    } );

    // Iniciar música automática (com fallback)
    initAutoMusic();
});

// ─── SUPORTE A TOQUE (Mobile) ──────────────────────────────────────────────
document.addEventListener('touchstart', () => {
    // Ativa o hover em dispositivos mobile
}, { passive: true });

// ─── PERMITIR REPRODUÇÃO DE ÁUDIO APÓS INTERAÇÃO ──────────────────────────
document.addEventListener('click', () => {
    if (backgroundMusic && backgroundMusic.paused) {
        backgroundMusic.play().catch(() => {
            console.log('Música ainda não pode ser reproduzida');
        });
    }
});
