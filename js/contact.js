const contactForm = document.querySelector('[data-contact-form]');

function showContactMessage(message, success = false) {
  const node = contactForm.querySelector('[data-form-message]');
  node.hidden = false;
  node.className = `notice notice-${success ? 'success' : 'warning'}`;
  node.textContent = message;
}

contactForm?.addEventListener('submit', async event => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const data = Object.fromEntries(new FormData(contactForm));
  if (data.company) return;
  const submit = contactForm.querySelector('button[type="submit"]');
  submit.disabled = true;
  submit.textContent = 'Sending…';
  try {
    const response = await fetch('https://formsubmit.co/ajax/tharuthathsarani737@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ name: data.name, email: data.email, subject: data.subject, message: data.message, _subject: `Weda.lk Research: ${data.subject}` })
    });
    const result = await response.json();
    if (!response.ok || result.success === false) throw new Error(result.message || 'Submission failed');
    contactForm.reset();
    showContactMessage('Message sent successfully. Thank you for contacting the Weda.lk research team.', true);
  } catch (error) {
    showContactMessage('Message could not be sent. Please try again, or email tharuthathsarani737@gmail.com directly.');
    console.error(error);
  } finally {
    submit.disabled = false;
    submit.textContent = 'Send message';
  }
});
