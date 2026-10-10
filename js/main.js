const navToggle = document.querySelector('.menu-toggle');
const navList = document.querySelector('.nav-list');
const header = document.querySelector('.site-header');

if (navToggle && navList) {
  const closeMenu = () => {
    navList.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  };
  navToggle.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navList.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
}
const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduced && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -32px' });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
}

if (header) {
  const updateHeader = () => header.classList.toggle('is-scrolled', scrollY > 24);
  updateHeader();
  addEventListener('scroll', updateHeader, { passive: true });
}

const scopeLinks = [...document.querySelectorAll('.scope-nav a')];
const scopeSections = [...document.querySelectorAll('[data-scope-section]')];
if (scopeLinks.length && scopeSections.length && 'IntersectionObserver' in window) {
  const scopeObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    scopeLinks.forEach(link => link.classList.toggle('active', link.hash === `#${visible.target.id}`));
  }, { rootMargin: '-28% 0px -58% 0px', threshold: [0, .15, .4] });
  scopeSections.forEach(section => scopeObserver.observe(section));
}

const hero = document.querySelector('.hero');
if (hero && !reduced && matchMedia('(pointer: fine)').matches) {
  hero.addEventListener('pointermove', event => {
    const x = ((event.clientX / innerWidth) - 0.5) * 10;
    const y = ((event.clientY / innerHeight) - 0.5) * 10;
    hero.style.setProperty('--hero-x', `${x}px`);
    hero.style.setProperty('--hero-y', `${y}px`);
  });
}
