/* ═══════════════════════════
   PROJECT PHASOR — main.js
   ═══════════════════════════ */

// ── ACTIVE NAV HIGHLIGHT ──
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => navObserver.observe(s));

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Slight stagger for sibling elements
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
      const delay    = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${Math.min(delay * 0.06, 0.3)}s`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ── MOBILE MENU ──
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('open');
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.remove('open');
}

// Close on outside click
document.addEventListener('click', e => {
  const menu   = document.getElementById('mobile-menu');
  const burger = document.querySelector('.nav-burger');
  if (menu.classList.contains('open') && !menu.contains(e.target) && !burger.contains(e.target)) {
    menu.classList.remove('open');
  }
});

// ── ENDORSERS TOGGLE ──
function toggleEndorsers() {
  const hidden  = document.querySelectorAll('.hidden-endorser');
  const btn     = document.getElementById('show-more-btn');
  const arrow   = document.getElementById('toggle-arrow');
  const isHidden = hidden[0].style.display !== 'block';

  hidden.forEach(el => {
    el.style.display = isHidden ? 'block' : 'none';
    if (isHidden) {
      // Trigger reveal for newly visible cards
      setTimeout(() => el.classList.add('visible'), 50);
    } else {
      el.classList.remove('visible');
    }
  });

  btn.querySelector('span') || (btn.innerHTML = btn.innerHTML);
  arrow.textContent = isHidden ? '↑' : '↓';
  btn.childNodes[0].textContent = isHidden ? 'Show fewer endorsers ' : 'Show all endorsers ';
}

// ── CONTACT FORM ──
function handleSubmit(e) {
  e.preventDefault();
  const btn    = e.target.querySelector('.form-submit');
  const inputs = e.target.querySelectorAll('input, select, textarea');

  btn.textContent = 'Submitted ✓';
  btn.style.background    = 'rgba(200,169,126,0.12)';
  btn.style.color         = 'var(--beige)';
  btn.style.border        = '1px solid rgba(200,169,126,0.4)';
  btn.disabled = true;

  inputs.forEach(i => i.disabled = true);
}

// ── NAV SCROLL SHADOW ──
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  if (window.scrollY > 20) {
    nav.style.background = 'rgba(26,22,18,0.97)';
  } else {
    nav.style.background = 'rgba(26,22,18,0.9)';
  }
}, { passive: true });
