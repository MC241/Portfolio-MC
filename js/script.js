gsap.registerPlugin(ScrollTrigger);

// ===== GERAÇÃO DE ESTRELAS =====
(function createStars() {
    const layer = document.getElementById('starsLayer');
    if (!layer) return;
    // Reduzido para 80 estrelas (melhor performance)
    const count = 80;
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star-particle';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        const size = (Math.random() * 2 + 1) + 'px';
        star.style.width = size;
        star.style.height = size;
        star.style.setProperty('--duration', (Math.random() * 4 + 2) + 's');
        star.style.setProperty('--delay', (Math.random() * 4) + 's');
        star.style.setProperty('--max-opacity', (Math.random() * 0.6 + 0.3).toString());
        layer.appendChild(star);
    }
})();

// ===== REFERÊNCIAS =====
const heroOverlay = document.getElementById('heroOverlay');
const header = document.querySelector("header");
let overlayTravel = 0;

// ===== CALCULAR ALTURA DO OVERLAY =====
function calcOverlayTravel() {
    overlayTravel = heroOverlay.offsetHeight;
}
calcOverlayTravel();
window.addEventListener('resize', calcOverlayTravel);

// ===== DEFINIR ALTURA DA NAVBAR (variável CSS) =====
function setNavOffset() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        document.documentElement.style.setProperty('--nav-h', navbar.offsetHeight + 'px');
    }
}
setNavOffset();
window.addEventListener('resize', setNavOffset);

// ===== GSAP SCROLLTRIGGER (hero pin + transição) =====
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: '#scrollDriver',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
        onUpdate(self) {
            const p = self.progress;
            // Desliza o overlay para cima
            heroOverlay.style.transform = `translateY(${-p * overlayTravel}px)`;
            // Alterna o tema do header
            if (p > 0.70) {
                header.classList.add('dark');
                updateActiveNav('projects');
            } else {
                header.classList.remove('dark');
                updateActiveNav('home');
            }
        }
    }
});

// Animação de saída do conteúdo do hero
tl.to(".hero-content, .scroll-indicator", {
    yPercent: -20,
    opacity: 0,
    ease: "none"
}, 0);

// ===== ANIMAÇÕES DE ENTRADA =====
gsap.from('.cosmos-title', {
    opacity: 0,
    scale: 0.85,
    ease: 'power2.out',
    scrollTrigger: {
        trigger: '#cosmos',
        start: 'top 50%',
        end: 'top top',
        scrub: 1,
    }
});

gsap.from('.planet-card', {
    scale: 0,
    ease: 'power2.out',
    scrollTrigger: {
        trigger: '.planets-row',
        start: 'top 90%',
        end: 'bottom 60%',
        scrub: 1,
    },
    stagger: 0.5,
});

// ===== FUNÇÃO PARA ATUALIZAR O NAV ATIVO =====
function updateActiveNav(section) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.section === section);
    });
}

// ===== NAVEGAÇÃO POR CLIQUE (âncoras suaves) =====
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const section = this.dataset.section;
        const target = document.getElementById(section);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            updateActiveNav(section);
        }
    });
});

// ===== (OPCIONAL) ATUALIZAR O SCROLLTRIGGER APÓS CARREGAMENTO =====
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});
