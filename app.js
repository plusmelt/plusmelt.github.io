// ============================================================
// KAROL JIA SITE — app.js v3
// ============================================================

// ---------- year + world times ----------
const yearTarget = document.getElementById('year');

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

function updateWorldTimes() {
  const easternTarget = document.getElementById('easternTime');
  const shanghaiTarget = document.getElementById('shanghaiTime');

  if (!easternTarget && !shanghaiTarget) {
    return;
  }

  const now = new Date();

  if (easternTarget) {
    easternTarget.textContent = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    }).format(now);
  }

  if (shanghaiTarget) {
    shanghaiTarget.textContent = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Shanghai',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    }).format(now);
  }
}

updateWorldTimes();
setInterval(updateWorldTimes, 30 * 1000);

// ---------- theme toggle ----------
const body  = document.body;
const themeBtn = document.getElementById('themeToggle');
const saved = localStorage.getItem('theme');

if (saved) {
  body.setAttribute('data-theme', saved);
}

syncThemeIcon();

themeBtn?.addEventListener('click', () => {
  const next = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  syncThemeIcon();
});

function syncThemeIcon(){
  if (!themeBtn) return;
  themeBtn.textContent = body.getAttribute('data-theme') === 'dark' ? '☀' : '☾';
}

// ============================================================
// CAT CURSOR — only inside #hero
// ============================================================
const hero    = document.getElementById('hero');
const cat     = document.getElementById('cat-cursor');
const catBtn  = document.getElementById('catToggle');
const catLbl  = document.getElementById('catToggleLabel');

// detect touch device — disable cat cursor on touch screens entirely
const isTouch = window.matchMedia('(pointer: coarse)').matches;

// load preference
let catOn = localStorage.getItem('catCursor') !== 'off' && !isTouch;
applyCatState();

catBtn?.addEventListener('click', () => {
  catOn = !catOn;
  localStorage.setItem('catCursor', catOn ? 'on' : 'off');
  applyCatState();
});

function applyCatState(){
  if (catOn){
    body.classList.add('cat-cursor-on');
    if (catLbl) catLbl.textContent = 'cat: on 🐈';
  } else {
    body.classList.remove('cat-cursor-on');

    if (cat) {
      cat.classList.remove('visible');
    }

    if (catLbl) catLbl.textContent = 'cat: off';
  }

  if (isTouch && catBtn) catBtn.style.display = 'none';
}

// move the cat — only when inside hero
if (hero && cat){
  hero.addEventListener('mousemove', (e) => {
    if (!catOn) return;
    cat.style.left = e.clientX + 'px';
    cat.style.top  = e.clientY + 'px';
    cat.classList.add('visible');
  });

  hero.addEventListener('mouseleave', () => {
    cat.classList.remove('visible');
  });
}

// ============================================================
// HERO TYPEWRITER — short looping phrases
// ============================================================
const typedEl = document.getElementById('typed');
const stage   = document.getElementById('emoji-stage');

const phrases = [
  { text: 'AI in education',           emoji: '💻' },
  { text: 'educational equity',        emoji: '⚖️' },
  { text: 'how policy fails',          emoji: '📋' },
  { text: 'classrooms across borders', emoji: '🌏''🧑‍🏫' },
  { text: 'what algorithms forget',    emoji: '🤔' },
  { text: 'cats, mostly',              emoji: '🐈' '😺'}
];

let pIdx = 0;
let cIdx = 0;
let deleting = false;

function heroStep(){
  if (!typedEl) return;

  const cur = phrases[pIdx];

  if (!deleting){
    cIdx++;
    typedEl.textContent = cur.text.slice(0, cIdx);

    if (cIdx === cur.text.length){
      burstEmoji(cur.emoji);
      setTimeout(() => {
        deleting = true;
        heroStep();
      }, 1700);
      return;
    }

    setTimeout(heroStep, 55 + Math.random() * 40);
  } else {
    cIdx--;
    typedEl.textContent = cur.text.slice(0, cIdx);

    if (cIdx === 0){
      deleting = false;
      pIdx = (pIdx + 1) % phrases.length;
    }

    setTimeout(heroStep, 28);
  }
}

heroStep();

function burstEmoji(em){
  if (!stage) return;

  const el = document.createElement('div');
  el.className = 'float-emoji';
  el.textContent = em;
  el.style.right  = (40 + Math.random() * 200) + 'px';
  el.style.bottom = (30 + Math.random() * 30) + '%';
  stage.appendChild(el);

  setTimeout(() => el.remove(), 3500);
}

// ============================================================
// STREAM-OF-CONSCIOUSNESS BLOCK — multi-line typewriter
// ============================================================
// Each .ln types itself out in sequence, leaves a small pause, then next line starts.
// On reaching the end, it pauses long, then erases all lines and starts again.

const streamRoot = document.getElementById('streamBlock');

if (streamRoot){
  const lines = Array.from(streamRoot.querySelectorAll('.ln'));

  // Build internal markup for each line: an inner span that holds text,
  // plus a caret. Wrapping behavior depends on data-wrap.
  lines.forEach(ln => {
    const wrapCls = ln.dataset.wrap;
    const inner = document.createElement('span');
    inner.className = wrapCls ? wrapCls : 'plain-text';
    ln.innerHTML = '';
    ln.appendChild(inner);

    const caret = document.createElement('span');
    caret.className = 'micro-caret';
    ln.appendChild(caret);
  });

  async function typeLine(ln){
    ln.classList.add('typing');
    const inner = ln.querySelector('.plain-text, .typed-text');
    const full  = ln.dataset.text || '';

    for (let i = 0; i <= full.length; i++){
      inner.textContent = full.slice(0, i);

      const last = full.charAt(i - 1);
      let delay = 22 + Math.random() * 35;

      if (',;:'.includes(last)) delay += 180;
      if ('.?!'.includes(last)) delay += 320;

      await sleep(delay);
    }

    ln.classList.remove('typing');
  }

  async function eraseLine(ln){
    const inner = ln.querySelector('.plain-text, .typed-text');

    if (!inner) return;

    const txt = inner.textContent;
    ln.classList.add('typing');

    for (let i = txt.length; i >= 0; i--){
      inner.textContent = txt.slice(0, i);
      await sleep(8);
    }

    ln.classList.remove('typing');
  }

  function sleep(ms){
    return new Promise(r => setTimeout(r, ms));
  }

  async function runStream(){
    while (true){
      for (const ln of lines){
        await typeLine(ln);
        await sleep(450);
      }

      await sleep(4500);

      for (let i = lines.length - 1; i >= 0; i--){
        await eraseLine(lines[i]);
        await sleep(100);
      }

      await sleep(600);
    }
  }

  // start only when the stream block is near viewport,
  // so users don't miss it scrolling fast
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        runStream();
        io.disconnect();
      }
    });
  }, { threshold: 0.15 });

  io.observe(streamRoot);
}
