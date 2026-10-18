const contactForm = document.querySelector('[data-contact-form]');
const contactStatus = contactForm?.querySelector('[data-form-message]');
const contactEmail = 'tharuthathsarani737@gmail.com';

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
    if (result.status === 503) {
      const mailSubject = encodeURIComponent(payload.subject);
      const mailBody = encodeURIComponent(`Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`);
      window.location.href = `mailto:${contactEmail}?subject=${mailSubject}&body=${mailBody}`;
      showContactStatus('Your email app has been opened. The message has not been sent yet—please press Send in your email app.');
      return;
    }
    if (!result.ok) throw new Error(body.error || 'Message delivery failed.');
    contactForm.reset(); showContactStatus('Your message was sent successfully.', true);
  } catch (error) { showContactStatus(error.message || 'Message delivery failed. Please try again later.'); }
  finally { submit.disabled = false; submit.textContent = 'Send message'; }
});
