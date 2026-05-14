// ---------- year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- theme toggle ----------
const root = document.body;
const toggle = document.getElementById('themeToggle');

// remember user choice
const saved = localStorage.getItem('theme');
if (saved) root.setAttribute('data-theme', saved);
updateToggleIcon();

toggle?.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateToggleIcon();
});

function updateToggleIcon() {
  if (!toggle) return;
  toggle.textContent = root.getAttribute('data-theme') === 'dark' ? '☀' : '☾';
}

// ---------- live local time ----------
const liveTime = document.getElementById('liveTime');
function tick() {
  if (!liveTime) return;
  const now = new Date();
  const opts = { hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York' };
  liveTime.textContent = now.toLocaleTimeString('en-US', opts) + ' ET';
}
tick();
setInterval(tick, 30 * 1000);
