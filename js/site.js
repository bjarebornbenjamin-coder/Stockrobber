/* Stockrobber: page behaviour. Runs after scrollcraft.js.
   Everything the owner needs to edit sits in LINKS. */
(function () {
  'use strict';

  // ---------------------------------------------------------------- LINKS
  // Fill in the real addresses. "#" keeps a link inert until it is set.
  var LINKS = {
    patreonVip: '#',          // Patreon, VIP-medlemskap
    patreonExklusiv: '#',     // Patreon, Exklusiv
    kurs: '#',                // Kurssidan för Fundamental analys
    kurser: '#',              // Alla kurser
    cart: '#',                // Varukorg
    skolaGrunder: '#',        // Lilla aktieskolan, undersidor
    skolaTeknisk: '#',
    skolaFundamental: '#',
    omMig: '#',               // Om Stockrobber, undersidor
    media: '#',
    faq: '#',
    formEndpoint: '',         // t.ex. https://formspree.io/f/xxxxxxx
    email: ''                 // reserv: öppnar e-postprogrammet om formEndpoint saknas
  };

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  var clamp01 = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; };
  var smooth = function (x) { x = clamp01(x); return x * x * (3 - 2 * x); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };

  document.querySelectorAll('[data-link]').forEach(function (a) {
    var url = LINKS[a.getAttribute('data-link')];
    if (url && url !== '#') {
      a.href = url;
      if (/^https?:/.test(url) && url.indexOf(location.host) === -1) a.rel = 'noopener';
    }
  });
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // ------------------------------------------------------------- hero words
  var title = document.querySelector('[data-split]');
  if (title) {
    var words = title.textContent.trim().split(/\s+/);
    title.setAttribute('aria-label', title.textContent.trim());
    title.innerHTML = words.map(function (w, i) {
      return '<span class="w" aria-hidden="true"><span style="--i:' + i + '">' + w + '</span></span>';
    }).join(' ');
  }

  // -------------------------------------------------------------------- nav
  var bar = document.getElementById('bar');
  var nav = document.getElementById('nav');
  var menuBtn = document.querySelector('.bar__menu');
  var subs = Array.prototype.slice.call(document.querySelectorAll('.has-sub'));

  function setSub(li, open) {
    li.classList.toggle('is-open', open);
    li.querySelector('.nav__toggle').setAttribute('aria-expanded', String(open));
  }
  function closeSubs(except) { subs.forEach(function (li) { if (li !== except) setSub(li, false); }); }

  subs.forEach(function (li) {
    var btn = li.querySelector('.nav__toggle');
    var hoverTimer;
    btn.addEventListener('click', function () {
      var open = !li.classList.contains('is-open');
      closeSubs(li); setSub(li, open);
    });
    li.addEventListener('pointerenter', function (e) {
      if (e.pointerType !== 'mouse' || !finePointer.matches || innerWidth <= 1100) return;
      clearTimeout(hoverTimer); closeSubs(li); setSub(li, true);
    });
    li.addEventListener('pointerleave', function (e) {
      if (e.pointerType !== 'mouse' || innerWidth <= 1100) return;
      hoverTimer = setTimeout(function () { setSub(li, false); }, 180);
    });
    li.addEventListener('focusout', function (e) {
      if (!li.contains(e.relatedTarget) && innerWidth > 1100) setSub(li, false);
    });
  });

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) bar.classList.add('is-solid'); else onScrollBar();
  }
  menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) { setMenu(false); closeSubs(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = subs.filter(function (li) { return li.classList.contains('is-open'); })[0];
    if (open) { setSub(open, false); open.querySelector('.nav__toggle').focus(); return; }
    if (nav.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('.has-sub')) closeSubs(); });

  function onScrollBar() {
    if (nav.classList.contains('is-open')) return;
    bar.classList.toggle('is-solid', scrollY > 40);
  }
  addEventListener('scroll', onScrollBar, { passive: true });
  onScrollBar();

  // ---------------------------------------------------- hero: engraving
  // Banknote guilloché, drawn once: interleaved waves behind, a rosette
  // medallion behind the portrait. Pure SVG, no raster.
  var SVGNS = 'http://www.w3.org/2000/svg';
  function pathFrom(pts) {
    return pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('');
  }
  document.querySelectorAll('[data-guilloche="waves"]').forEach(function (svg) {
    var d = '';
    for (var k = 0; k < 44; k++) {
      var pts = [];
      for (var x = -20; x <= 420; x += 4) {
        pts.push([x, 10 + k * 9.2 + 14 * Math.sin(x * 0.024 + k * 0.33) + 9 * Math.sin(x * 0.009 - k * 0.21)]);
      }
      d += pathFrom(pts);
    }
    var path = document.createElementNS(SVGNS, 'path'); path.setAttribute('d', d); svg.appendChild(path);
  });
  document.querySelectorAll('[data-guilloche="rosette"]').forEach(function (svg) {
    var d = '';
    for (var k = 0; k < 40; k++) {
      var pts = [];
      for (var t = 0; t <= Math.PI * 2 + 0.01; t += 0.012) {
        var r = 150 + 11 * Math.sin(18 * t + k * 0.36) + 6 * Math.sin(7 * t - k * 0.52) - k * 1.15;
        pts.push([200 + r * Math.cos(t), 200 + r * Math.sin(t)]);
      }
      d += pathFrom(pts) + 'Z';
    }
    var path = document.createElementNS(SVGNS, 'path'); path.setAttribute('d', d); svg.appendChild(path);
  });

  var scene = document.querySelector('[data-scene]');
  if (scene && finePointer.matches && !reduce) {
    var tx = 0, ty = 0, cx = 0, cy = 0, moving = false;
    addEventListener('pointermove', function (e) {
      tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5;
      if (!moving) { moving = true; requestAnimationFrame(ease); }
    }, { passive: true });
    var ease = function () {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      scene.style.setProperty('--mx', cx.toFixed(4)); scene.style.setProperty('--my', cy.toFixed(4));
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) requestAnimationFrame(ease); else moving = false;
    };
  }

  // ------------------------------------------------------------ the engine
  var sc = window.ScrollCraft ? ScrollCraft.mount(document.body) : null;
  function actFor(el) {
    if (!sc || !el) return null;
    for (var i = 0; i < sc.acts.length; i++) if (sc.acts[i].el === el) return sc.acts[i];
    return null;
  }
  var ingressEl = document.querySelector('.ingress');
  var courseEl = document.querySelector('.course');
  var proofEl = document.querySelector('.proof');
  var ingressAct = actFor(ingressEl);
  var readSpans = Array.prototype.slice.call(document.querySelectorAll('[data-read] > span'));
  var courseAct = actFor(courseEl);

  // --------------------------------------------- ingress: the chart turns
  var chart = document.querySelector('[data-chart]');
  var candles = [];
  var trendPath, trendLen = 0;
  if (chart) {
    var NS = 'http://www.w3.org/2000/svg';
    var N = 30, W = 1000, H = 560, pad = 24, turn = 17;
    var seed = 7;
    var rnd = function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    var data = [], price = 100;
    for (var i = 0; i < N; i++) {
      var drift = i < turn ? -1.1 : 2.3;
      var open = price;
      var close = open + drift + (rnd() - 0.5) * (i < turn ? 7 : 4.5);
      var high = Math.max(open, close) + rnd() * 3.2;
      var low = Math.min(open, close) - rnd() * 3.2;
      data.push({ o: open, c: close, h: high, l: low });
      price = close;
    }
    var lo = Infinity, hi = -Infinity;
    data.forEach(function (d) { lo = Math.min(lo, d.l); hi = Math.max(hi, d.h); });
    var y = function (v) { return pad + (1 - (v - lo) / (hi - lo)) * (H - pad * 2); };
    var step = (W - pad * 2) / N, cw = step * 0.5;
    for (var g = 0; g < 5; g++) {
      var gl = document.createElementNS(NS, 'line');
      var gy = pad + g * (H - pad * 2) / 4;
      gl.setAttribute('x1', 0); gl.setAttribute('x2', W); gl.setAttribute('y1', gy); gl.setAttribute('y2', gy);
      gl.setAttribute('class', 'c-grid'); chart.appendChild(gl);
    }
    var pts = [];
    data.forEach(function (d, i) {
      var x = pad + i * step + step / 2;
      var up = d.c >= d.o;
      var grp = document.createElementNS(NS, 'g');
      grp.setAttribute('class', up ? 'c-up' : 'c-down');
      var wick = document.createElementNS(NS, 'line');
      wick.setAttribute('x1', x); wick.setAttribute('x2', x);
      wick.setAttribute('y1', y(d.h)); wick.setAttribute('y2', y(d.l));
      wick.setAttribute('class', 'c-wick');
      var body = document.createElementNS(NS, 'rect');
      var top = y(Math.max(d.o, d.c)), bot = y(Math.min(d.o, d.c));
      body.setAttribute('x', x - cw / 2); body.setAttribute('width', cw);
      body.setAttribute('y', top); body.setAttribute('height', Math.max(2, bot - top));
      body.setAttribute('rx', 1.5); body.setAttribute('class', 'c-body');
      grp.appendChild(wick); grp.appendChild(body);
      grp.style.opacity = reduce ? 1 : 0;
      chart.appendChild(grp);
      candles.push(grp);
      // 4-candle moving average
      var s = 0, n = 0;
      for (var k = Math.max(0, i - 3); k <= i; k++) { s += data[k].c; n++; }
      pts.push([x, y(s / n)]);
    });
    trendPath = document.createElementNS(NS, 'path');
    trendPath.setAttribute('class', 'c-trend');
    trendPath.setAttribute('d', pts.map(function (p, i) {
      return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1);
    }).join(' '));
    chart.appendChild(trendPath);
    trendLen = trendPath.getTotalLength();
    trendPath.style.strokeDasharray = trendLen;
    trendPath.style.strokeDashoffset = reduce ? 0 : trendLen;
  }

  // -------------------------------------------- signature: the ticker
  // The five bars of the logo. Two start red and short. The page's turn
  // (ingress) flips the third, the proof flips the fourth, and by the close
  // all five stand in an uptrend.
  var H0 = [12, 20, 17, 7, 20], HF = [9, 13, 17, 21, 24];
  var tickers = Array.prototype.slice.call(document.querySelectorAll('[data-ticker]')).map(function (g) {
    return Array.prototype.slice.call(g.querySelectorAll('rect'));
  });
  function setTicker(t, redA, redB) {
    tickers.forEach(function (rects) {
      rects.forEach(function (r, k) {
        var s = smooth((t - 0.08 - k * 0.07) / 0.5);
        var h = lerp(H0[k], HF[k], s);
        r.setAttribute('height', h.toFixed(2));
        r.setAttribute('y', (43 - h).toFixed(2));
      });
      rects[2].classList.toggle('is-red', redA);
      rects[3].classList.toggle('is-red', redB);
    });
  }

  // ---------------------------------------------------------- the book
  var book = document.querySelector('[data-book]');
  var shadow = document.querySelector('.book__shadow');
  function setBook(p) {
    if (!book) return;
    var a = smooth(p / 0.34);
    var o = smooth((p - 0.3) / 0.42);
    var c = smooth((p - 0.72) / 0.28);
    book.style.setProperty('--ry', (lerp(-34, -14, a) + lerp(0, 8, c)).toFixed(2) + 'deg');
    book.style.setProperty('--rx', lerp(10, 4, a).toFixed(2) + 'deg');
    book.style.setProperty('--open', (-162 * o).toFixed(2) + 'deg');
    book.style.setProperty('--lift', lerp(24, 0, a).toFixed(1) + 'px');
    book.style.setProperty('--shift', (book.offsetWidth * 0.5 * o).toFixed(1) + 'px');
    if (shadow) shadow.style.setProperty('--shadow', lerp(0.7, 1.05, a).toFixed(3));
  }

  // ------------------------------------------------------------ one loop
  var last = {};
  function frame() {
    var docH = document.documentElement.scrollHeight - innerHeight;
    var t = docH > 0 ? clamp01(scrollY / docH) : 0;

    var ip = ingressAct ? ingressAct.p : 0;
    if (readSpans.length && !reduce && ip !== last.ip) {
      for (var r = 0; r < readSpans.length; r++) readSpans[r].classList.toggle('is-dim', ip < 0.26 + r * 0.09);
    }
    if (chart && !reduce && ip !== last.ip) {
      var n = candles.length;
      for (var i = 0; i < n; i++) {
        var on = ip >= 0.2 + i * (0.36 / n);
        if (candles[i]._on !== on) { candles[i]._on = on; candles[i].style.opacity = on ? 1 : 0; }
      }
      trendPath.style.strokeDashoffset = (trendLen * (1 - smooth((ip - 0.2) / 0.4))).toFixed(1);
      last.ip = ip;
    }

    var proofTop = proofEl ? proofEl.getBoundingClientRect().top : 1e9;
    var pastTurn = ip >= 0.48;
    var pastProof = proofTop < innerHeight * 0.45;
    var tk = reduce ? 1 : t;
    var key = tk.toFixed(4) + pastTurn + pastProof;
    if (key !== last.tk) { setTicker(tk, !(pastTurn || reduce), !(pastProof || reduce)); last.tk = key; }

    var cp = reduce ? 1 : (courseAct ? courseAct.p : 0);
    if (cp !== last.cp) { setBook(cp); last.cp = cp; }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // ------------------------------------------------------------- contact
  var form = document.getElementById('contact-form');
  if (form) {
    var status = form.querySelector('.form__status');
    var fields = [
      { el: form.elements.name, err: document.getElementById('f-name-err'), ok: function (v) { return v.trim().length > 1; } },
      { el: form.elements.email, err: document.getElementById('f-email-err'), ok: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); } },
      { el: form.elements.message, err: document.getElementById('f-msg-err'), ok: function (v) { return v.trim().length > 2; } }
    ];
    fields.forEach(function (f) {
      f.el.setAttribute('aria-describedby', f.err.id);
      f.el.addEventListener('input', function () {
        if (f.el.getAttribute('aria-invalid') === 'true' && f.ok(f.el.value)) { f.el.removeAttribute('aria-invalid'); f.err.hidden = true; }
      });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      fields.forEach(function (f) {
        var good = f.ok(f.el.value);
        if (good) f.el.removeAttribute('aria-invalid'); else f.el.setAttribute('aria-invalid', 'true');
        f.err.hidden = good;
        if (!good && !firstBad) firstBad = f.el;
      });
      status.className = 'form__status';
      if (firstBad) { firstBad.focus(); return; }

      var payload = { name: form.elements.name.value, email: form.elements.email.value, message: form.elements.message.value };
      var btn = form.querySelector('button[type="submit"]');

      if (LINKS.formEndpoint) {
        btn.disabled = true; status.textContent = 'Skickar…';
        fetch(LINKS.formEndpoint, {
          method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload)
        }).then(function (r) {
          if (!r.ok) throw new Error(r.status);
          form.reset();
          status.textContent = 'Meddelandet är skickat. Du får svar till ' + payload.email + '.';
          status.classList.add('is-ok');
        }).catch(function () {
          status.textContent = 'Meddelandet kunde inte skickas. Kontrollera anslutningen och försök igen.';
          status.classList.add('is-err');
        }).then(function () { btn.disabled = false; });
      } else if (LINKS.email) {
        location.href = 'mailto:' + LINKS.email + '?subject=' + encodeURIComponent('Fråga från ' + payload.name) +
          '&body=' + encodeURIComponent(payload.message + '\n\n' + payload.name + ', ' + payload.email);
        status.textContent = 'Ditt e-postprogram öppnas med meddelandet ifyllt.';
        status.classList.add('is-ok');
      } else {
        status.textContent = 'Formuläret är inte kopplat ännu. Lägg in formEndpoint eller email i js/site.js.';
        status.classList.add('is-err');
      }
    });
  }
})();
