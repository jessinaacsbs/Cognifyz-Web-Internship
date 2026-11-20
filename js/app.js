/* Shared: navbar (hamburger), tabs, toast, image fallback, login / create-account */
(function () {
  const B = document.body.dataset.base || '';
  const get = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
  const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  window.cgz = { get, set, session: () => get('cgz_session', null), B };
  const s = window.cgz.session();
  const path = location.pathname;

  const nav = document.createElement('header');
  nav.className = 'nav';
  nav.innerHTML = `<div class="wrap"><a class="brand" href="${B}index.html">Cogni<span>fyz</span></a>
  <button class="burger" aria-label="Open menu" aria-expanded="false">&#9776;</button>
  <nav class="links">
    <a href="${B}index.html">Home</a>
    <a href="${B}Level-1/task1-html-css.html">Level 1</a>
    <a href="${B}Level-2/task1-frameworks.html">Level 2</a>
    <a href="${B}Level-3/task1-image-gallery.html">Level 3</a>
    <a href="${B}Level-3/task2-landing-page.html">Internship</a>
    <a class="acct" href="${B}account.html">${s ? 'Hi, ' + s.name.split(' ')[0] : 'My Account'}</a>
  </nav></div>`;
  document.body.prepend(nav);
  const burger = nav.querySelector('.burger'), links = nav.querySelector('.links');
  burger.onclick = () => { const o = links.classList.toggle('open'); burger.setAttribute('aria-expanded', o); };

  const T = {
    1: [['task1-html-css', 'Task 1: HTML/CSS'], ['task2-javascript', 'Task 2: JavaScript']],
    2: [['task1-frameworks', 'Task 1: Frameworks'], ['task2-responsive', 'Task 2: Responsive']],
    3: [['task1-image-gallery', 'Task 1: Images'], ['task2-landing-page', 'Task 2: Landing page']]
  };
  const lv = document.body.dataset.level;
  if (lv) {
    const t = document.createElement('div');
    t.className = 'tabs wrap';
    t.innerHTML = `<strong style="align-self:center">Level ${lv}</strong>` + T[lv].map(([f, n]) => `<a href="${f}.html" class="${path.endsWith(f + '.html') ? 'on' : ''}">${n}</a>`).join('');
    nav.after(t);
  }

  window.toast = (m) => { const d = document.createElement('div'); d.className = 'toast'; d.textContent = m; document.body.append(d); setTimeout(() => d.remove(), 2600); };

  // fallback if a web image fails to load
  document.addEventListener('error', (e) => {
    const i = e.target;
    if (i.tagName === 'IMG' && !i.dataset.f) { i.dataset.f = 1; i.src = 'https://picsum.photos/seed/' + encodeURIComponent(i.alt || 'cgz') + '/800/500'; }
  }, true);

  // ---------- account page ----------
  const box = document.getElementById('authBox');
  if (!box) return;
  let mode = 'login';
  const next = new URLSearchParams(location.search).get('next');
  function render() {
    const u = window.cgz.session();
    if (u) {
      const apps = get('cgz_apps', []).filter(a => a.email === u.email);
      box.innerHTML = `<h2>Welcome, ${u.name.replace(/</g, '&lt;')}</h2><p>${u.email}</p>
      <h3>My applications</h3>${apps.length ? '<ul class="tick">' + apps.map(a => `<li>${a.role} (${a.date})</li>`).join('') + '</ul>' : '<p>No applications yet.</p>'}
      <div class="row"><a class="btn" href="${B}Level-3/task2-landing-page.html#apply">Apply for internship</a><button class="btn ghost" id="out" style="color:#0f172a;border-color:#0f172a">Log out</button></div>`;
      document.getElementById('out').onclick = () => { localStorage.removeItem('cgz_session'); location.reload(); };
      return;
    }
    box.innerHTML = `<div class="seg"><button data-m="login" class="${mode == 'login' ? 'on' : ''}">Log in</button><button data-m="signup" class="${mode == 'signup' ? 'on' : ''}">Create account</button></div>
    <form id="f" novalidate>
      ${mode == 'signup' ? '<label for="n">Full name</label><input id="n" autocomplete="name">' : ''}
      <label for="e">Email</label><input id="e" type="email" autocomplete="email">
      <label for="p">Password (min 6 characters)</label><input id="p" type="password" autocomplete="${mode == 'login' ? 'current-password' : 'new-password'}">
      ${mode == 'signup' ? '<label for="c">Confirm password</label><input id="c" type="password" autocomplete="new-password">' : ''}
      <div class="msg err" id="m" role="alert"></div>
      <button class="btn" style="width:100%">${mode == 'login' ? 'Log in' : 'Create account'}</button>
    </form>`;
    box.querySelectorAll('.seg button').forEach(b => b.onclick = () => { mode = b.dataset.m; render(); });
    document.getElementById('f').onsubmit = (ev) => {
      ev.preventDefault();
      const v = id => (document.getElementById(id) || {}).value || '';
      const m = document.getElementById('m'), email = v('e').trim().toLowerCase(), pass = v('p');
      const users = get('cgz_users', []);
      if (!/^\S+@\S+\.\S+$/.test(email)) return m.textContent = 'Enter a valid email address.';
      if (pass.length < 6) return m.textContent = 'Password must be at least 6 characters.';
      if (mode == 'signup') {
        if (!v('n').trim()) return m.textContent = 'Enter your name.';
        if (pass !== v('c')) return m.textContent = 'Passwords do not match.';
        if (users.some(u => u.email === email)) return m.textContent = 'That email already has an account. Log in instead.';
        users.push({ name: v('n').trim(), email, pass }); set('cgz_users', users);
        set('cgz_session', { name: v('n').trim(), email });
      } else {
        const u = users.find(u => u.email === email && u.pass === pass);
        if (!u) return m.textContent = 'Email or password is incorrect.';
        set('cgz_session', { name: u.name, email });
      }
      if (next) location.href = next; else location.reload();
    };
  }
  render();
})();
