// ============================================================
// KAROL JIA SITE — app.js v3.1
// ============================================================

(function () {
  // ---------- year + time ----------
  var yearTarget = document.getElementById('year');

  if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear();
  }

  function updateTimes() {
    var easternTarget = document.getElementById('easternTime');
    var shanghaiTarget = document.getElementById('shanghaiTime');
    var legacyLiveTime = document.getElementById('liveTime');
    var now = new Date();

    var easternTime = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    }).format(now);

    var shanghaiTime = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Shanghai',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    }).format(now);

    if (easternTarget) {
      easternTarget.textContent = easternTime;
    }

    if (shanghaiTarget) {
      shanghaiTarget.textContent = shanghaiTime;
    }

    if (legacyLiveTime) {
      legacyLiveTime.textContent = easternTime;
    }
  }

  updateTimes();
  setInterval(updateTimes, 30 * 1000);

  // ---------- theme toggle ----------
  var body = document.body;
  var themeBtn = document.getElementById('themeToggle');
  var saved = localStorage.getItem('theme');

  if (saved) {
    body.setAttribute('data-theme', saved);
  }

  function syncThemeIcon() {
    if (!themeBtn) return;
    themeBtn.textContent = body.getAttribute('data-theme') === 'dark' ? '☀' : '☾';
  }

  syncThemeIcon();

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      body.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      syncThemeIcon();
    });
  }

  // ============================================================
  // CAT CURSOR — only inside #hero
  // ============================================================
  var hero = document.getElementById('hero');
  var cat = document.getElementById('cat-cursor');
  var catBtn = document.getElementById('catToggle');
  var catLbl = document.getElementById('catToggleLabel');

  var isTouch = window.matchMedia('(pointer: coarse)').matches;
  var catOn = localStorage.getItem('catCursor') !== 'off' && !isTouch;

  function applyCatState() {
    if (catOn) {
      body.classList.add('cat-cursor-on');

      if (catLbl) {
        catLbl.textContent = 'cat: on 🐈';
      }
    } else {
      body.classList.remove('cat-cursor-on');

      if (cat) {
        cat.classList.remove('visible');
      }

      if (catLbl) {
        catLbl.textContent = 'cat: off';
      }
    }

    if (isTouch && catBtn) {
      catBtn.style.display = 'none';
    }
  }

  applyCatState();

  if (catBtn) {
    catBtn.addEventListener('click', function () {
      catOn = !catOn;
      localStorage.setItem('catCursor', catOn ? 'on' : 'off');
      applyCatState();
    });
  }

  if (hero && cat) {
    hero.addEventListener('mousemove', function (event) {
      if (!catOn) return;

      cat.style.left = event.clientX + 'px';
      cat.style.top = event.clientY + 'px';
      cat.classList.add('visible');
    });

    hero.addEventListener('mouseleave', function () {
      cat.classList.remove('visible');
    });
  }

  // ============================================================
  // HERO TYPEWRITER
  // ============================================================
  var typedEl = document.getElementById('typed');
  var stage = document.getElementById('emoji-stage');

  var phrases = [
    { text: 'AI in education', emoji: '💻' },
    { text: 'educational equity', emoji: '⚖️' },
    { text: 'how policy fails', emoji: '📋' },
    { text: 'classrooms across borders', emoji: '🏫' },
    { text: 'what algorithms forget', emoji: '🤔' },
    { text: 'cats, mostly', emoji: '🐈' }
  ];

  var pIdx = 0;
  var cIdx = 0;
  var deleting = false;

  function heroStep() {
    if (!typedEl) return;

    var cur = phrases[pIdx];

    if (!deleting) {
      cIdx++;
      typedEl.textContent = cur.text.slice(0, cIdx);

      if (cIdx === cur.text.length) {
        burstEmoji(cur.emoji);

        setTimeout(function () {
          deleting = true;
          heroStep();
        }, 1700);

        return;
      }

      setTimeout(heroStep, 55 + Math.random() * 40);
    } else {
      cIdx--;
      typedEl.textContent = cur.text.slice(0, cIdx);

      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
      }

      setTimeout(heroStep, 28);
    }
  }

  function burstEmoji(em) {
    if (!stage) return;

    var count = 1 + Math.floor(Math.random() * 3);

    for (var i = 0; i < count; i++) {
      var el = document.createElement('div');
      el.className = 'float-emoji';
      el.textContent = em;
      el.style.right = (35 + Math.random() * 230) + 'px';
      el.style.bottom = (26 + Math.random() * 36) + '%';
      el.style.animationDelay = (i * 80) + 'ms';

      stage.appendChild(el);

      setTimeout(function (node) {
        node.remove();
      }, 3700, el);
    }
  }

  heroStep();

  // ============================================================
  // STREAM-OF-CONSCIOUSNESS BLOCK
  // ============================================================
  var streamRoot = document.getElementById('streamBlock');

  if (streamRoot) {
    var lines = Array.from(streamRoot.querySelectorAll('.ln'));

    lines.forEach(function (ln) {
      var wrapCls = ln.dataset.wrap;
      var inner = document.createElement('span');

      inner.className = wrapCls ? wrapCls : 'plain-text';
      ln.innerHTML = '';
      ln.appendChild(inner);

      var caret = document.createElement('span');
      caret.className = 'micro-caret';
      ln.appendChild(caret);
    });

    function sleep(ms) {
      return new Promise(function (resolve) {
        setTimeout(resolve, ms);
      });
    }

    async function typeLine(ln) {
      ln.classList.add('typing');

      var inner = ln.querySelector('.plain-text, .typed-text');
      var full = ln.dataset.text || '';

      for (var i = 0; i <= full.length; i++) {
        inner.textContent = full.slice(0, i);

        var last = full.charAt(i - 1);
        var delay = 22 + Math.random() * 35;

        if (',;:'.includes(last)) delay += 180;
        if ('.?!'.includes(last)) delay += 320;

        await sleep(delay);
      }

      ln.classList.remove('typing');
    }

    async function eraseLine(ln) {
      var inner = ln.querySelector('.plain-text, .typed-text');

      if (!inner) return;

      var txt = inner.textContent;
      ln.classList.add('typing');

      for (var i = txt.length; i >= 0; i--) {
        inner.textContent = txt.slice(0, i);
        await sleep(8);
      }

      ln.classList.remove('typing');
    }

    async function runStream() {
      while (true) {
        for (var i = 0; i < lines.length; i++) {
          await typeLine(lines[i]);
          await sleep(450);
        }

        await sleep(4500);

        for (var j = lines.length - 1; j >= 0; j--) {
          await eraseLine(lines[j]);
          await sleep(100);
        }

        await sleep(600);
      }
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runStream();
            io.disconnect();
          }
        });
      }, { threshold: 0.15 });

      io.observe(streamRoot);
    } else {
      runStream();
    }
  }
})();
