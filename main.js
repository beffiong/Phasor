/* Scroll reveal with per-sibling stagger.
   Compute --reveal-delay upfront for each .reveal element based on its
   position among siblings under the same parent. The CSS picks up the
   variable via `transition-delay: var(--reveal-delay)`. */
(function () {
  var els = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (!els.length) return;

  var groups = new Map();
  els.forEach(function (el) {
    var p = el.parentElement;
    if (!groups.has(p)) groups.set(p, []);
    groups.get(p).push(el);
  });
  groups.forEach(function (siblings) {
    siblings.forEach(function (el, i) {
      el.style.setProperty('--reveal-delay', Math.min(i * 90, 360) + 'ms');
    });
  });

  if (typeof IntersectionObserver === 'undefined') {
    els.forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -32px 0px' });
  els.forEach(function (el) { obs.observe(el); });
})();

/* Nav: dark-to-light transition based on hero height */
(function () {
  var nav = document.getElementById('nav');
  var hero = document.getElementById('hero');
  if (!nav || !hero) return;

  function updateNav() {
    var heroBottom = hero.offsetTop + hero.offsetHeight;
    nav.classList.toggle('nav-light', window.scrollY > heroBottom - 80);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
})();

/* Mobile menu */
function toggleMenu() { document.getElementById('mob').classList.toggle('open'); }
function closeMob() { document.getElementById('mob').classList.remove('open'); }
document.addEventListener('click', function (e) {
  var m = document.getElementById('mob');
  if (!m) return;
  var burger = document.querySelector('.nav-burger');
  if (m.classList.contains('open') && !m.contains(e.target) && burger && !burger.contains(e.target)) {
    m.classList.remove('open');
  }
});
