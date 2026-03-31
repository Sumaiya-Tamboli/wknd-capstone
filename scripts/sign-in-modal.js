(async function () {
  if (window.__signInModalReady) return;
  window.__signInModalReady = true;
 
  // ── 1. Fetch fields using RELATIVE URL — no CORS issue ────────────
  // EDS serves your sheet at the same origin on both localhost & AEM Live
  // Your sheet doc is at /sign-in-form so JSON is at /sign-in-form.json
  let fields = [];
  try {
    const res = await fetch('/sign-in-form.json');
    const json = await res.json();
    fields = json.data || [];
    console.log('[sign-in-modal] Loaded', fields.length, 'fields from sheet');
  } catch (err) {
    console.error('[sign-in-modal] Sheet fetch failed:', err);
    return;
  }
 
  if (!fields.length) {
    console.warn('[sign-in-modal] Sheet returned no fields');
    return;
  }
 
  // ── 2. Build modal DOM ─────────────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.id = 'sign-in-overlay';
  overlay.className = 'sim-overlay';
 
  const modal = document.createElement('div');
  modal.className = 'sim-modal';
 
  const closeBtn = document.createElement('button');
  closeBtn.className = 'sim-close';
  closeBtn.innerHTML = '&times;';
  modal.appendChild(closeBtn);
 
  const h2 = document.createElement('h2');
  h2.textContent = 'Sign In';
  modal.appendChild(h2);
 
  const hr = document.createElement('hr');
  hr.className = 'sim-divider';
  modal.appendChild(hr);
 
  const sub = document.createElement('p');
  sub.className = 'sim-subtitle';
  sub.textContent = 'Welcome Back';
  modal.appendChild(sub);
 
  // ── 3. Build form from sheet rows ──────────────────────────────────
  const form = document.createElement('form');
  form.noValidate = true;
  const validationRules = {};
 
  fields.forEach((field) => {
    const type  = (field.Type || '').toLowerCase().trim();
    const name  = (field.Name || '').trim();
    const label = (field.Label || '').trim();
    const ph    = (field.Placeholder || '').trim();
    const req   = field.Required === 'true';
    const valid = (field.Validation || '').trim();
 
    if (valid) {
      validationRules[name] = {};
      valid.split(',').forEach((r) => {
        const [k, v] = r.split(':');
        validationRules[name][k.trim()] = v ? parseInt(v.trim(), 10) : true;
      });
    }
 
    if (type === 'submit') {
      const btn = document.createElement('button');
      btn.type = 'submit';
      btn.textContent = label || 'Sign In';
      form.appendChild(btn);
    } else if (type === 'link') {
      const a = document.createElement('a');
      a.className = 'sim-forgot';
      a.textContent = (label || 'FORGOT YOUR PASSWORD?').toUpperCase();
      a.href = '#';
      a.addEventListener('click', (e) => e.preventDefault());
      form.appendChild(a);
    } else {
      const lbl = document.createElement('label');
      lbl.htmlFor = name;
      lbl.textContent = label;
      const input = document.createElement('input');
      input.type = type;
      input.name = name;
      input.id = name;
      input.placeholder = ph || label.toUpperCase();
      if (req) input.required = true;
      form.appendChild(lbl);
      form.appendChild(input);
    }
  });
 
  const status = document.createElement('p');
  status.className = 'sim-status';
  form.appendChild(status);
 
  modal.appendChild(form);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
 
  // ── 4. Open / close ────────────────────────────────────────────────
  function openModal() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => form.querySelector('input')?.focus(), 80);
  }
 
  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    status.textContent = '';
    status.className = 'sim-status';
    form.querySelectorAll('input').forEach((i) => { i.style.borderColor = ''; });
    form.reset();
  }
 
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
  });
 
  // ── 5. Validate ────────────────────────────────────────────────────
  function validate() {
    let ok = true;
    form.querySelectorAll('input').forEach((input) => {
      const rules = validationRules[input.name] || {};
      const val = input.value.trim();
      input.style.borderColor = '';
      if (input.required && !val) { input.style.borderColor = '#f44336'; ok = false; }
      else if (rules.min && val.length < rules.min) { input.style.borderColor = '#f44336'; ok = false; }
    });
    return ok;
  }
 
  // ── 6. Submit → redirect ───────────────────────────────────────────
  const SIGN_IN_PAGE = 'https://main--WKND-CAPSTONE-adobe.aem.page/sign';
 
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = '';
    status.className = 'sim-status';
 
    if (!validate()) {
      status.textContent = 'Please fill in all required fields correctly.';
      status.classList.add('error');
      return;
    }
 
    status.textContent = 'Redirecting...';
    window.location.href = SIGN_IN_PAGE;
  });
 
  // ── 7. Intercept SIGN IN nav link ─────────────────────────────────
  const bound = new WeakSet();
 
  function bindTriggers() {
    document.querySelectorAll('a, button').forEach((el) => {
      if (bound.has(el)) return;
      const href = (el.getAttribute('href') || '').toLowerCase();
      const txt  = el.textContent.trim().toUpperCase();
      if (
        href.includes('sign-in') || href.includes('signin') || href.includes('login') ||
        txt === 'SIGN IN' || txt === 'LOG IN' || txt === 'LOGIN' ||
        el.classList.contains('nav-sign-in') || el.dataset.action === 'sign-in'
      ) {
        bound.add(el);
        el.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          openModal();
        });
        console.log('[sign-in-modal] ✅ Bound:', txt, href);
      }
    });
  }
 
  bindTriggers();
  document.addEventListener('nav:decorated', bindTriggers);
  new MutationObserver(bindTriggers).observe(document.body, { childList: true, subtree: true });
 
  console.log('[sign-in-modal] ✅ Modal ready');
})();

