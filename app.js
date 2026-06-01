// ============================================================
// KAROL JIA SITE — app.js v3
// ============================================================

// ---------- year + time ----------
document.getElementById('year').textContent = new Date().getFullYear();

const liveMD = document.getElementById('liveTimeMD');
const liveSH = document.getElementById('liveTimeSH');
function tick(){
  const now = new Date();
  if (liveMD) {
    liveMD.textContent = now.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York'
    });
  }
  if (liveSH) {
    liveSH.textContent = now.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Shanghai'
    });
  }
}
tick();
setInterval(tick, 30 * 1000);

// ---------- theme toggle ----------
const body  = document.body;
const themeBtn = document.getElementById('themeToggle');
const saved = localStorage.getItem('theme');
if (saved) body.setAttribute('data-theme', saved);
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
    cat.classList.remove('visible');
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
  { text: 'multiagent LLM systems',       emoji: '🤖' },
  { text: 'AI hallucinations as teachers', emoji: '🧠' },
  { text: 'evaluative judgment',           emoji: '⚖️' },
  { text: 'who bears the cost of verification', emoji: '💸' },
  { text: 'productive failure',            emoji: '🔁' },
  { text: 'cats, mostly',                  emoji: '🐈' }
];

let pIdx = 0, cIdx = 0, deleting = false;

function heroStep(){
  if (!typedEl) return;
  const cur = phrases[pIdx];
  if (!deleting){
    cIdx++;
    typedEl.textContent = cur.text.slice(0, cIdx);
    if (cIdx === cur.text.length){
      burstEmoji(cur.emoji);
      setTimeout(() => { deleting = true; heroStep(); }, 1700);
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
  // spawn 1–3 emoji per burst, slightly staggered in time and position
  const count = 1 + Math.floor(Math.random() * 3); // 1, 2, or 3
  for (let i = 0; i < count; i++){
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'float-emoji';
      el.textContent = em;
      el.style.right  = (30 + Math.random() * 260) + 'px';
      el.style.bottom = (25 + Math.random() * 40) + '%';
      // small per-instance scale variation so multiples don't look stamped
      const scale = 0.92 + Math.random() * 0.16; // 0.92–1.08
      el.style.setProperty('--emoji-scale', scale.toFixed(2));
      stage.appendChild(el);
      setTimeout(() => el.remove(), 3500);
    }, i * 180); // 180ms stagger
  }
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
    const wrapCls = ln.dataset.wrap; // e.g. 'typed-text' for the accent line
    const inner = document.createElement('span');
    inner.className = wrapCls ? wrapCls : 'plain-text';
    ln.innerHTML = ''; // clear
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
      // little speed variation, pause longer at punctuation
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

  function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

  async function runStream(){
    while (true){
      // type each line in order
      for (const ln of lines){
        await typeLine(ln);
        await sleep(450);
      }
      // hold the full paragraph for a beat
      await sleep(4500);
      // erase from bottom up
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
