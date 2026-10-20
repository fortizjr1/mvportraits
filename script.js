const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.site-nav a').forEach((link) => link.addEventListener('click', () => nav.classList.remove('open')));

const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.work-card');
filters.forEach((filter) => filter.setAttribute('aria-selected', filter.classList.contains('active') ? 'true' : 'false'));
filters.forEach((filter) => filter.addEventListener('click', () => {
  filters.forEach((item) => item.classList.remove('active'));
  filter.classList.add('active');
  filters.forEach((item) => item.setAttribute('aria-selected', item === filter ? 'true' : 'false'));
  const selected = filter.dataset.filter;
  cards.forEach((card) => {
    const visible = selected === 'all' || card.dataset.category === selected;
    card.style.display = visible ? 'flex' : 'none';
  });
}));

document.getElementById('year').textContent = new Date().getFullYear();

// Give each service CTA a personal prompt without requiring a separate page.
document.querySelectorAll('.service a[href="#contact"]').forEach((link) => {
  const title = link.closest('.service')?.querySelector('h3')?.textContent.replace(/\s+/g, ' ').trim();
  link.addEventListener('click', () => {
    const note = document.querySelector('.contact-form-heading small');
    if (note && title) note.textContent = `Tell me a little about your ${title.toLowerCase()} plans.`;
  });
});

// Lightweight gallery preview. Replace the placeholder art with final image sources later.
const lightbox = document.querySelector('.lightbox');
const lightboxTitle = document.querySelector('#lightbox-title');
const lightboxKicker = document.querySelector('#lightbox-kicker');
const lightboxClose = document.querySelector('.lightbox-close');
cards.forEach((card) => {
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  const openLightbox = () => {
    const title = card.querySelector('h3')?.textContent.replace(/\s+/g, ' ').trim() || 'Selected work';
    const kicker = card.querySelector('small')?.textContent || '';
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxKicker) lightboxKicker.textContent = kicker;
    if (lightbox && typeof lightbox.showModal === 'function') lightbox.showModal();
  };
  card.addEventListener('click', openLightbox);
  card.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openLightbox(); } });
});
lightboxClose?.addEventListener('click', () => lightbox?.close());
lightbox?.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });

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
