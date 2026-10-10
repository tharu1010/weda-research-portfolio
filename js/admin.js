const backend = window.WedaBackend;
const loginForm = document.querySelector('[data-login-form]');
const panel = document.querySelector('[data-admin-panel]');
const loginMessage = document.querySelector('[data-admin-message]');
const uploadForm = document.querySelector('[data-upload-form]');
const itemsRoot = document.querySelector('[data-admin-items]');

function message(node, text, success = false) { node.hidden = false; node.className = `notice notice-${success ? 'success' : 'warning'}`; node.textContent = text; }
function setSession(session) { loginForm.hidden = Boolean(session); panel.hidden = !session; if (session) loadItems(); }
function button(label, className, handler) { const node = document.createElement('button'); node.type = 'button'; node.className = `button button-small ${className}`; node.textContent = label; node.addEventListener('click', handler); return node; }

async function loadItems() {
  itemsRoot.innerHTML = '<p>Loading files…</p>';
  const { data, error } = await backend.client.from('library_items').select('*').order('created_at', { ascending: false });
  if (error) return message(itemsRoot, error.message);
  itemsRoot.replaceChildren();
  if (!data.length) { itemsRoot.innerHTML = '<p class="library-empty">No uploaded files yet.</p>'; return; }
  data.forEach(item => {
    const row = document.createElement('article'); row.className = 'admin-item';
    const info = document.createElement('div'); const title = document.createElement('strong'); title.textContent = item.title; const detail = document.createElement('p'); detail.textContent = `${item.kind} · ${item.category} · ${item.is_public ? 'Public' : 'Pending'}`; info.append(title, detail);
    const actions = document.createElement('div'); actions.className = 'admin-item-actions';
    actions.append(button(item.is_public ? 'Make pending' : 'Publish', 'button-secondary', async () => { const { error: updateError } = await backend.client.from('library_items').update({ is_public: !item.is_public }).eq('id', item.id); if (updateError) alert(updateError.message); else loadItems(); }));
    actions.append(button('Edit details', 'button-secondary', async () => { const titleValue = prompt('Document title', item.title); if (titleValue === null) return; const description = prompt('Description', item.description); if (description === null) return; const { error: updateError } = await backend.client.from('library_items').update({ title: titleValue.trim(), description: description.trim() }).eq('id', item.id); if (updateError) alert(updateError.message); else loadItems(); }));
    actions.append(button('Delete', 'button-danger', async () => { if (!confirm(`Permanently delete “${item.title}”?`)) return; const { error: storageError } = await backend.client.storage.from('research-assets').remove([item.storage_path]); if (storageError) return alert(storageError.message); const { error: deleteError } = await backend.client.from('library_items').delete().eq('id', item.id); if (deleteError) alert(deleteError.message); else loadItems(); }));
    row.append(info, actions); itemsRoot.append(row);
  });
}

if (!backend?.ready) message(loginMessage, 'Backend configuration is missing. Follow DEPLOYMENT.md before using administration.');
else {
  backend.client.auth.getSession().then(({ data }) => setSession(data.session));
  backend.client.auth.onAuthStateChange((_event, session) => setSession(session));
  loginForm.addEventListener('submit', async event => { event.preventDefault(); const { email, password } = Object.fromEntries(new FormData(loginForm)); const { error } = await backend.client.auth.signInWithPassword({ email, password }); if (error) message(loginMessage, error.message); else loginForm.reset(); });
  document.querySelector('[data-sign-out]').addEventListener('click', () => backend.client.auth.signOut());
  document.querySelector('[data-refresh-items]').addEventListener('click', loadItems);
  uploadForm.addEventListener('submit', async event => {
    event.preventDefault(); const data = new FormData(uploadForm); const file = data.get('file'); const kind = data.get('kind');
    const allowed = kind === 'documents' ? ['application/pdf'] : ['application/pdf','application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    const limit = kind === 'documents' ? (window.WEDA_CONFIG.maxDocumentBytes || 15728640) : (window.WEDA_CONFIG.maxPresentationBytes || 31457280); const output = document.querySelector('[data-upload-message]');
    if (!allowed.includes(file.type) || file.size > limit) return message(output, `Choose an allowed file smaller than ${Math.round(limit / 1048576)} MB.`);
    const safe = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-'); const path = `${crypto.randomUUID()}/${safe}`; const submit = uploadForm.querySelector('button[type="submit"]'); submit.disabled = true; submit.textContent = 'Uploading…';
    try {
      const { error: uploadError } = await backend.client.storage.from('research-assets').upload(path, file, { contentType: file.type, upsert: false }); if (uploadError) throw uploadError;
      const record = { title:data.get('title'),description:data.get('description'),category:data.get('category'),component:data.get('component')||null,version:data.get('version')||null,kind,storage_path:path,mime_type:file.type,size_bytes:file.size,is_public:data.get('is_public')==='on' };
      const { error } = await backend.client.from('library_items').insert(record); if (error) { await backend.client.storage.from('research-assets').remove([path]); throw error; }
      uploadForm.reset(); message(output, 'File uploaded and metadata saved.', true); loadItems();
    } catch (error) { message(output, error.message); } finally { submit.disabled = false; submit.textContent = 'Upload file'; }
  });
}
