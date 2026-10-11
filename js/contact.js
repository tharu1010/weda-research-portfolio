const contactForm = document.querySelector('[data-contact-form]');
const contactStatus = contactForm?.querySelector('[data-form-message]');

function showContactStatus(text, success = false) {
  contactStatus.hidden = false;
  contactStatus.className = `notice notice-${success ? 'success' : 'warning'}`;
  contactStatus.textContent = text;
}

contactForm?.addEventListener('submit', async event => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const submit = contactForm.querySelector('button[type="submit"]');
  submit.disabled = true; submit.textContent = 'Sending…'; contactStatus.hidden = true;
  try {
    const payload = Object.fromEntries(new FormData(contactForm));
    const result = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const body = await result.json().catch(() => ({}));
    if (!result.ok) throw new Error(body.error || 'Message delivery failed.');
    contactForm.reset(); showContactStatus('Your message was sent successfully.', true);
  } catch (error) { showContactStatus(error.message || 'Message delivery failed. Please try again later.'); }
  finally { submit.disabled = false; submit.textContent = 'Send message'; }
});
