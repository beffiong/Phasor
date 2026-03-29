/* Scroll reveal */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const siblings = Array.from(e.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
      const delay = Math.min(siblings.indexOf(e.target) * 0.08, 0.42);
      e.target.style.transitionDelay = delay + 's';
      e.target.classList.add('visible');
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -32px 0px' });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

/* Nav: dark-to-light transition based on hero height */
const nav = document.getElementById('nav');
const hero = document.getElementById('hero');

function updateNav() {
  const heroBottom = hero.offsetTop + hero.offsetHeight;
  nav.classList.toggle('nav-light', window.scrollY > heroBottom - 80);
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* Mobile menu */
function toggleMenu() { document.getElementById('mob').classList.toggle('open'); }
function closeMob() { document.getElementById('mob').classList.remove('open'); }
document.addEventListener('click', e => {
  const m = document.getElementById('mob');
  if (m.classList.contains('open') && !m.contains(e.target) && !document.querySelector('.nav-burger').contains(e.target)) m.classList.remove('open');
});
