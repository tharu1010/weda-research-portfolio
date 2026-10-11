const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed.' });
  const { name = '', email = '', subject = '', message = '', company = '' } = request.body || {};
  if (company) return response.status(200).json({ ok: true });
  const clean = {
    name: String(name).trim().slice(0, 100),
    email: String(email).trim().slice(0, 254),
    subject: String(subject).trim().slice(0, 160),
    message: String(message).trim().slice(0, 3000)
  };
  if (!clean.name || !EMAIL_PATTERN.test(clean.email) || !clean.subject || clean.message.length < 10) {
    return response.status(400).json({ error: 'Please provide valid contact details and a message.' });
  }
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL) {
    return response.status(503).json({ error: 'Message delivery is not configured.' });
  }
  try {
    const result = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || 'Weda.lk Research <onboarding@resend.dev>',
        to: [process.env.CONTACT_TO_EMAIL],
        reply_to: clean.email,
        subject: `Weda.lk Research: ${clean.subject}`,
        text: `Name: ${clean.name}\nEmail: ${clean.email}\n\n${clean.message}`
      })
    });
    if (!result.ok) throw new Error(`Mail provider returned ${result.status}`);
    return response.status(200).json({ ok: true });
  } catch (error) {
    console.error('Contact delivery failed:', error.message);
    return response.status(502).json({ error: 'Message delivery failed. Please try again later.' });
  }
};
