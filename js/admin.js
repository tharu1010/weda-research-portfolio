const backend = window.WedaBackend;
const loginForm = document.querySelector('[data-login-form]');
const panel = document.querySelector('[data-admin-panel]');
const loginMessage = document.querySelector('[data-admin-message]');
const uploadForm = document.querySelector('[data-upload-form]');

function message(node, text, success = false) {
  node.hidden = false;
  node.className = `notice notice-${success ? 'success' : 'warning'}`;
  node.textContent = text;
}
function setSession(session) { loginForm.hidden = Boolean(session); panel.hidden = !session; }

if (!backend?.ready) message(loginMessage, 'Backend configuration is missing. Follow DEPLOYMENT.md before using administration.');
else {
  backend.client.auth.getSession().then(({ data }) => setSession(data.session));
  backend.client.auth.onAuthStateChange((_event, session) => setSession(session));
  loginForm.addEventListener('submit', async event => {
    event.preventDefault();
    const { email, password } = Object.fromEntries(new FormData(loginForm));
    const { error } = await backend.client.auth.signInWithPassword({ email, password });
    if (error) message(loginMessage, error.message); else loginForm.reset();
  });
  document.querySelector('[data-sign-out]').addEventListener('click', () => backend.client.auth.signOut());
  uploadForm.addEventListener('submit', async event => {
    event.preventDefault();
    const data = new FormData(uploadForm); const file = data.get('file'); const kind = data.get('kind');
    const allowed = kind === 'documents' ? ['application/pdf'] : ['application/pdf','application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    const limit = kind === 'documents' ? (window.WEDA_CONFIG.maxDocumentBytes || 15728640) : (window.WEDA_CONFIG.maxPresentationBytes || 31457280);
    const output = document.querySelector('[data-upload-message]');
    if (!allowed.includes(file.type) || file.size > limit) return message(output, `Choose an allowed file smaller than ${Math.round(limit/1048576)} MB.`);
    const safe = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-');
    const path = `${crypto.randomUUID()}/${safe}`;
    const { error: uploadError } = await backend.client.storage.from('research-assets').upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) return message(output, uploadError.message);
    const record = { title:data.get('title'), description:data.get('description'), category:data.get('category'), component:data.get('component')||null, version:data.get('version')||null, kind, storage_path:path, mime_type:file.type, size_bytes:file.size, is_public:data.get('is_public')==='on' };
    const { error } = await backend.client.from('library_items').insert(record);
    if (error) { await backend.client.storage.from('research-assets').remove([path]); return message(output, error.message); }
    uploadForm.reset(); message(output, 'File uploaded and metadata saved.', true);
  });
}
