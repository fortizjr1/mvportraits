const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.site-nav a').forEach((link) => link.addEventListener('click', () => nav.classList.remove('open')));

const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.work-card');
filters.forEach((filter) => filter.addEventListener('click', () => {
  filters.forEach((item) => item.classList.remove('active'));
  filter.classList.add('active');
  const selected = filter.dataset.filter;
  cards.forEach((card) => {
    const visible = selected === 'all' || card.dataset.category === selected;
    card.style.display = visible ? 'flex' : 'none';
  });
}));

document.getElementById('year').textContent = new Date().getFullYear();

const railLinks = [...document.querySelectorAll('.section-rail a[data-rail]')];
const railCurrent = document.querySelector('.section-rail-current');
const railTargets = railLinks.map((link) => ({
  id: link.dataset.rail,
  label: link.querySelector('span')?.textContent || '',
  element: document.getElementById(link.dataset.rail) || document.body,
}));
const updateRail = () => {
  const marker = window.innerHeight * 0.38;
  let current = railTargets[0];
  railTargets.forEach((target) => {
    if (target.element.getBoundingClientRect().top <= marker) current = target;
  });
  railLinks.forEach((link) => link.classList.toggle('active', link.dataset.rail === current.id));
  if (railCurrent) railCurrent.textContent = current.label;
};
window.addEventListener('scroll', updateRail, { passive: true });
updateRail();

// Cinematic scroll reveals that stay quiet when the visitor prefers reduced motion.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion) {
  document.querySelectorAll('main > section:not(.hero)').forEach((section) => section.classList.add('reveal'));
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((section) => revealObserver.observe(section));

  window.addEventListener('scroll', () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    document.documentElement.style.setProperty('--scroll-progress', `${window.scrollY / scrollable}`);
  }, { passive: true });
}
