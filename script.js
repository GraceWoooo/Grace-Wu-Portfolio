/* ---- LOADER ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
    document.body.style.overflow = '';
    initReveal();
  }, 1600);
});
document.body.style.overflow = 'hidden';

/* ---- CUSTOM CURSOR ---- */
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');
let mouseX = 0, mouseY = 0;
let curX = 0, curY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

(function animateCursor() {
  curX += (mouseX - curX) * 0.28;
  curY += (mouseY - curY) * 0.28;
  cursor.style.left = curX + 'px';
  cursor.style.top  = curY + 'px';
  requestAnimationFrame(animateCursor);
})();

document.querySelectorAll('a, button, .project-card, .contact-card, .highlight-card').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ---- STICKY NAV ---- */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

/* ---- MOBILE MENU ---- */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ---- STARFIELD CANVAS ---- */
(function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, stars = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  for (let i = 0; i < 180; i++) {
    stars.push({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      r: Math.random() * 0.9 + 0.1,
      a: Math.random(),
      speed: Math.random() * 0.003 + 0.001,
      pulse: Math.random() * Math.PI * 2
    });
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.pulse += s.speed;
      const alpha = (Math.sin(s.pulse) * 0.4 + 0.6) * 0.5;
      ctx.beginPath();
      ctx.arc(
        (s.x / 1920) * W,
        (s.y / 1080) * H,
        s.r, 0, Math.PI * 2
      );
      ctx.fillStyle = `rgba(148, 175, 212, ${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

/* ---- SCROLL REVEAL ---- */
function initReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-line');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => {
    obs.observe(el);
    // Wrap hero lines for animation
    if (el.classList.contains('reveal-line')) {
      const text = el.innerHTML;
      el.innerHTML = `<span class="reveal-line-inner">${text}</span>`;
    }
  });

  // Trigger hero elements immediately
  document.querySelectorAll('.hero .reveal-fade, .hero .reveal-line').forEach(el => {
    el.classList.add('in-view');
  });
}

/* ---- SMOOTH SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ---- ACTIVE NAV LINK ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(l => {
    l.style.color = l.getAttribute('href') === '#' + current
      ? 'var(--text-1)' : '';
  });
});

