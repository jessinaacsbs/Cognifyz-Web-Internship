/* Level 1: Task 1 form + Task 2 JavaScript */
const $ = (id) => document.getElementById(id);
const colors = ['#4f46e5', '#0891b2', '#059669', '#d97706', '#dc2626', '#9333ea'];
let ci = 0;
if ($('colorBtn')) $('colorBtn').onclick = (e) => { ci = (ci + 1) % colors.length; e.target.style.background = colors[ci]; e.target.style.borderColor = colors[ci]; e.target.textContent = 'Color: ' + colors[ci]; };

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning!' : h < 17 ? 'Good afternoon!' : h < 21 ? 'Good evening!' : 'Good night!';
}
if ($('greetBtn')) $('greetBtn').onclick = () => alert(greeting() + ' Welcome to Cognifyz.');

if ($('addBtn')) $('addBtn').onclick = () => {
  const a = parseFloat($('a').value), b = parseFloat($('b').value), r = $('result');
  if (isNaN(a) || isNaN(b)) { r.className = 'msg err'; r.textContent = 'Enter two numbers.'; return; }
  r.className = 'msg ok'; r.textContent = `${a} + ${b} = ${+(a + b).toFixed(10)}`;
};
if ($('subForm')) $('subForm').onsubmit = (e) => {
  e.preventDefault();
  const v = $('subIn').value.trim(), m = $('subMsg');
  m.className = v ? 'msg ok' : 'msg err'; m.textContent = v ? `Thanks, ${v}! Submitted.` : 'Please type something first.';
};
