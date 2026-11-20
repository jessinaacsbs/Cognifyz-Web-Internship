/* Level 2 / Task 2: live viewport readout */
const out = document.getElementById('vw');
if (out) {
  const f = () => { const w = innerWidth; out.textContent = w + 'px: ' + (w <= 760 ? 'mobile layout (hamburger menu)' : w <= 900 ? 'tablet layout' : 'desktop layout'); };
  addEventListener('resize', f); f();
}
