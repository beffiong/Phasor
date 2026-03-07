
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
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });
function toggleMenu() { document.getElementById('mob').classList.toggle('open'); }
function closeMob() { document.getElementById('mob').classList.remove('open'); }
document.addEventListener('click', e => {
  const m = document.getElementById('mob');
  if (m.classList.contains('open') && !m.contains(e.target) && !document.querySelector('.nav-burger').contains(e.target)) m.classList.remove('open');
});
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.fsub');
  btn.textContent = 'Request Sent ✓';
  btn.disabled = true;
  btn.style.cssText = 'background:rgba(217,79,43,.1);color:#d94f2b;border:1px solid rgba(217,79,43,.3);';
  e.target.querySelectorAll('input,select,textarea').forEach(i => i.disabled = true);
}
