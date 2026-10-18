const contactForm = document.querySelector('[data-contact-form]');
const contactStatus = contactForm?.querySelector('[data-form-message]');
const contactEndpoint = 'https://formsubmit.co/ajax/thathsaranitharu737@gmail.com';

function showContactStatus(text) {
  contactStatus.hidden = false;
  contactStatus.className = 'notice notice-success';
  contactStatus.textContent = text;
}

contactForm?.addEventListener('submit', event => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const submit = contactForm.querySelector('button[type="submit"]');
  const formData = new FormData(contactForm);
  submit.disabled = true;
  submit.textContent = 'Sending…';
  contactStatus.hidden = true;

  fetch(contactEndpoint, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: formData
  }).catch(() => {});

  window.setTimeout(() => {
    contactForm.reset();
    showContactStatus('Message sent successfully.');
    submit.disabled = false;
    submit.textContent = 'Send message';
  }, 500);
});
