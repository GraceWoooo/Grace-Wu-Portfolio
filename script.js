/* =====================================================
   GRACE WU — PORTFOLIO
   Sections in this file:
     1. Loader
     2. Scroll reveal
     3. Custom cursor (desktop only)
     4. Nav: scrolled state + current section
     5. Mobile menu
     6. Modal helper (focus trap, Esc, scroll lock)
     7. Pitch deck password modal
     8. Email modal (sends through FormSubmit)
   ===================================================== */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- 1. LOADER ---- */
/* Shows "GW" briefly, then reveals the page. It no longer waits for
   every image to finish downloading. */
const loader = document.getElementById('loader');
document.body.style.overflow = 'hidden';
setTimeout(() => {
  loader.classList.add('done');
  document.body.style.overflow = '';
  initReveal();
}, reduceMotion ? 0 : 800);

/* ---- 2. SCROLL REVEAL ---- */
function initReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-line');

  // Wrap the hero name lines so they can slide up
  document.querySelectorAll('.reveal-line').forEach(el => {
    el.innerHTML = `<span class="reveal-line-inner">${el.innerHTML}</span>`;
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => obs.observe(el));

  // Hero elements show straight away
  requestAnimationFrame(() => {
    document.querySelectorAll('.hero .reveal-fade, .hero .reveal-line').forEach(el => {
      el.classList.add('in-view');
    });
  });
}

/* ---- 3. CUSTOM CURSOR (desktop only) ---- */
const cursorDot = document.getElementById('cursor-dot');
if (cursorDot && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top  = e.clientY + 'px';
  }, { passive: true });

  document.querySelectorAll('a, button, summary, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ---- 4. NAV: SCROLLED STATE + CURRENT SECTION ---- */
const header   = document.getElementById('header');
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');
let navTicking = false;

function updateNav() {
  navTicking = false;
  header.classList.toggle('scrolled', window.scrollY > 40);

  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 140) current = s.id;
  });
  navLinks.forEach(link => {
    const isCurrent = link.getAttribute('href') === '#' + current;
    link.classList.toggle('active', isCurrent);
    if (isCurrent) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
}
window.addEventListener('scroll', () => {
  if (!navTicking) { navTicking = true; requestAnimationFrame(updateNav); }
}, { passive: true });
updateNav();

/* ---- 5. MOBILE MENU ---- */
const hamburger = document.getElementById('hamburger');

function setMenu(open) {
  document.body.classList.toggle('menu-open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
hamburger.addEventListener('click', () => {
  setMenu(!document.body.classList.contains('menu-open'));
});
navLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
    setMenu(false);
    hamburger.focus();
  }
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) setMenu(false);
});

/* ---- 6. MODAL HELPER ---- */
/* Shared by both modals: keeps Tab inside the modal, closes on Esc or a
   click outside, stops the page scrolling behind it, and puts focus back
   on the button that opened it. */
function createModal(overlay, { onClose } = {}) {
  let opener = null;

  function focusable() {
    return [...overlay.querySelectorAll('a[href], button:not([disabled]), input:not([tabindex="-1"]), textarea')]
      .filter(el => el.offsetParent !== null);
  }

  function open(firstFocus) {
    opener = document.activeElement;
    overlay.classList.add('open');
    document.body.classList.add('modal-open');
    setTimeout(() => (firstFocus || focusable()[0]).focus(), 100);
  }

  function close() {
    if (!overlay.classList.contains('open')) return;
    overlay.classList.remove('open');
    document.body.classList.remove('modal-open');
    if (onClose) onClose();
    if (opener) opener.focus();
  }

  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  overlay.addEventListener('keydown', e => {
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    const items = focusable();
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  return { open, close };
}

/* ---- 7. PITCH DECK PASSWORD MODAL ---- */
/* Note: the passwords live in index.html (data-password on each button),
   so this keeps casual visitors out but is not real security. */
(function initDeckModal() {
  const overlay   = document.getElementById('deckModal');
  const input     = document.getElementById('deckModalInput');
  const errorMsg  = document.getElementById('deckModalError');
  const titleEl   = document.getElementById('deckModalTitle');
  const inputWrap = input.parentElement;

  let currentDeck = '';
  let currentPassword = '';

  function reset() {
    input.value = '';
    errorMsg.classList.remove('visible');
    inputWrap.classList.remove('shake');
  }

  const modal = createModal(overlay, { onClose: reset });

  document.querySelectorAll('.deck-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentDeck     = btn.dataset.deck;
      currentPassword = btn.dataset.password;
      titleEl.textContent = btn.dataset.title;
      reset();
      modal.open(input);
    });
  });

  function checkPassword() {
    if (input.value === currentPassword) {
      modal.close();
      window.open(currentDeck, '_blank');
    } else {
      inputWrap.classList.remove('shake');
      void inputWrap.offsetWidth; // restart the shake animation
      inputWrap.classList.add('shake');
      errorMsg.classList.add('visible');
      input.value = '';
      input.focus();
    }
  }

  document.getElementById('deckModalClose').addEventListener('click', modal.close);
  document.getElementById('deckModalSubmit').addEventListener('click', checkPassword);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') checkPassword(); });
})();

/* ---- 8. EMAIL MODAL (sends through FormSubmit) ---- */
(function initMailModal() {
  const card    = document.getElementById('emailCard');
  const overlay = document.getElementById('mailModal');
  if (!card || !overlay) return;
  const form    = document.getElementById('mailForm');
  const sendBtn = document.getElementById('mailSend');
  const status  = document.getElementById('mailStatus');
  const ADDRESS = 'grace.siyu.wu@gmail.com';
  const fallback = 'You can also email me directly at <a href="mailto:' + ADDRESS + '">' + ADDRESS + '</a>.';

  const modal = createModal(overlay);

  function setStatus(kind, html) {
    status.className = 'mail-status' + (kind ? ' ' + kind : '');
    status.innerHTML = html;
  }

  card.addEventListener('click', e => {
    e.preventDefault();
    setStatus('', '');
    modal.open(document.getElementById('mailName'));
  });
  document.getElementById('mailModalClose').addEventListener('click', modal.close);

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (form.elements._honey.value) return; // filled in by a bot
    const data = Object.fromEntries(new FormData(form));
    data._replyto  = data.email;
    data._subject  = 'Portfolio message from ' + data.name;
    data._template = 'table';
    sendBtn.disabled = true;
    setStatus('', 'Sending...');
    try {
      const res = await fetch('https://formsubmit.co/ajax/' + ADDRESS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && String(json.success) === 'true') {
        form.reset();
        setStatus('ok', "Sent! I'll get back to you soon.");
      } else if (/activ/i.test(json.message || '')) {
        setStatus('err', "This form isn't switched on yet. " + fallback);
      } else {
        throw new Error(json.message || 'HTTP ' + res.status);
      }
    } catch (err) {
      setStatus('err', "That didn't go through. " + fallback);
    } finally {
      sendBtn.disabled = false;
    }
  });
})();
