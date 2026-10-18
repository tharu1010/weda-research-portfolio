const contactForm = document.querySelector('[data-contact-form]');
const contactStatus = contactForm?.querySelector('[data-form-message]');
const contactEndpoint = 'https://formsubmit.co/ajax/thathsaranitharu737@gmail.com';

function showContactStatus(text, success = false) {
  contactStatus.hidden = false;
  contactStatus.className = `notice notice-${success ? 'success' : 'warning'}`;
  contactStatus.textContent = text;
}

contactForm?.addEventListener('submit', async event => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const submit = contactForm.querySelector('button[type="submit"]');
  submit.disabled = true;
  submit.textContent = 'Sending…';
  contactStatus.hidden = true;

  try {
    const response = await fetch(contactEndpoint, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(contactForm)
    });
    const result = await response.json().catch(() => ({}));
    const accepted = response.ok && (result.success === true || result.success === 'true');
    if (!accepted) throw new Error(result.message || 'Message delivery failed. Please try again.');

    contactForm.reset();
    showContactStatus('Message sent successfully.', true);
  } catch (error) {
    showContactStatus(error.message || 'Message delivery failed. Please try again later.');
  } finally {
    submit.disabled = false;
    submit.textContent = 'Send message';
  }
});
