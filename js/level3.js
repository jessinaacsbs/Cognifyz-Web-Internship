/* Level 3: lightbox, countdown, apply form */
const $ = (id) => document.getElementById(id);
const lb = $('lightbox');
if (lb) {
  document.querySelectorAll('.gallery img').forEach(i => i.onclick = () => { lb.querySelector('img').src = i.src.replace(/w=\d+/, 'w=1400'); lb.classList.add('show'); });
  lb.onclick = () => lb.classList.remove('show');
  addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('show'); });
}
if ($('timer')) {
  let end = cgz.get('cgz_deadline', null);
  if (!end || end < Date.now()) { end = Date.now() + 14 * 864e5; cgz.set('cgz_deadline', end); }
  const p = n => String(n).padStart(2, '0');
  const tick = () => { let s = Math.max(0, Math.floor((end - Date.now()) / 1000)); const d = Math.floor(s / 86400); s %= 86400;
    $('timer').firstChild.textContent = `${p(d)}d ${p(Math.floor(s / 3600))}:${p(Math.floor(s % 3600 / 60))}:${p(s % 60)}`; };
  tick(); setInterval(tick, 1000);
}
if ($('applyForm')) {
  const u = cgz.session();
  if (u) $('who').textContent = `Applying as ${u.name} (${u.email})`;
  $('applyForm').onsubmit = (e) => {
    e.preventDefault();
    if (!u) { toast('Please log in first'); setTimeout(() => location.href = cgz.B + 'account.html?next=' + encodeURIComponent(location.pathname + '#apply'), 900); return; }
    const apps = cgz.get('cgz_apps', []);
    apps.push({ email: u.email, role: $('role').value, date: new Date().toLocaleDateString() });
    cgz.set('cgz_apps', apps);
    toast('Application submitted!');
  };
}
