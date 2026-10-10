const cfg = window.WEDA_CONFIG || {};
const backendReady = Boolean(cfg.supabaseUrl && cfg.supabaseAnonKey && !cfg.supabaseUrl.includes('YOUR_PROJECT'));
const supabaseClient = backendReady && window.supabase
  ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey)
  : null;

window.WedaBackend = { ready: backendReady, client: supabaseClient };

function showFormMessage(form, message, type = 'warning') {
  const node = form.querySelector('[data-form-message]');
  if (!node) return;
  node.className = `notice notice-${type}`;
  node.textContent = message;
  node.hidden = false;
}

const contactForm = document.querySelector('[data-contact-form]');
if (contactForm) {
  contactForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    if (!supabaseClient) {
      showFormMessage(contactForm, 'Message delivery is not configured yet. Add the approved Supabase settings described in DEPLOYMENT.md.');
      return;
    }
    const button = contactForm.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = 'Sending…';
    const data = Object.fromEntries(new FormData(contactForm));
    try {
      const { error } = await supabaseClient.functions.invoke('contact', { body: data });
      if (error) throw error;
      contactForm.reset();
      showFormMessage(contactForm, 'Your message was delivered to the research inbox.', 'success');
    } catch (error) {
      showFormMessage(contactForm, 'The message could not be delivered. Please try again later.');
      console.error(error);
    } finally {
      button.disabled = false;
      button.textContent = 'Send message';
    }
  });
}
