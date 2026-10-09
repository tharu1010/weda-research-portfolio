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

const hero = document.querySelector('.hero');
if (hero && !reduced && matchMedia('(pointer: fine)').matches) {
  hero.addEventListener('pointermove', event => {
    const x = ((event.clientX / innerWidth) - 0.5) * 10;
    const y = ((event.clientY / innerHeight) - 0.5) * 10;
    hero.style.setProperty('--hero-x', `${x}px`);
    hero.style.setProperty('--hero-y', `${y}px`);
  });
}

// The public contact form is progressively enhanced so the page remains honest
// when no delivery backend has been configured.
if (document.title.startsWith('Contact Us')) {
  const main = document.querySelector('main');
  const section = document.createElement('section');
  section.className = 'section section-white';
  section.innerHTML = `<div class="container grid grid-2"><div><span class="eyebrow">Send an enquiry</span><h2>Contact the research team</h2><p>Delivery activates only after an approved inbox and secure backend are configured. The form never simulates a successful submission.</p></div><form class="card form-stack" data-contact-form><div class="field"><label for="contact-name">Full name</label><input id="contact-name" name="name" required maxlength="100" autocomplete="name"></div><div class="field"><label for="contact-email">Email address</label><input id="contact-email" name="email" type="email" required maxlength="254" autocomplete="email"></div><div class="field"><label for="contact-subject">Subject</label><input id="contact-subject" name="subject" required maxlength="160"></div><div class="field"><label for="contact-message">Message</label><textarea id="contact-message" name="message" required minlength="10" maxlength="3000" rows="7"></textarea></div><input class="honeypot" name="company" tabindex="-1" autocomplete="off" aria-hidden="true"><button class="button" type="submit">Send message</button><div data-form-message hidden role="status" aria-live="polite"></div></form></div>`;
  main.append(section);
  const load = src => new Promise((resolve, reject) => { const script=document.createElement('script'); script.src=src; script.onload=resolve; script.onerror=reject; document.head.append(script); });
  load('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2').then(() => load('./js/config.js')).then(() => load('./js/backend.js')).catch(() => {
    const node = section.querySelector('[data-form-message]'); node.hidden=false; node.className='notice notice-warning'; node.textContent='Message delivery could not be loaded. Please try again later.';
  });
}
