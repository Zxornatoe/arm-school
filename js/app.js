/* ARM Business School — front-end behaviour (separate JS file) */
(function () {
  // Always start at the top on (re)load — no scroll-position restore
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
  window.scrollTo(0, 0);
  var head = document.getElementById('masthead');
  var burger = document.getElementById('burger');
  var mobile = document.getElementById('mobileNav');
  var totop = document.getElementById('totop');

  // Sticky masthead shadow + back-to-top visibility
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (head) head.classList.toggle('scrolled', y > 8);
    if (totop) totop.classList.toggle('show', y > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  if (burger && mobile) {
    burger.addEventListener('click', function () {
      var open = mobile.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    mobile.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        mobile.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (totop) {
    totop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Scroll-reveal animations (IntersectionObserver, graceful fallback)
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // Animated stat counters (data-count="62" data-suffix="")
  var counters = document.querySelectorAll('[data-count]');
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1200;
    var t0 = null;
    function tick(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          animateCount(en.target);
          cio.unobserve(en.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  // Active nav for the current page (multi-page site)
  function normPage(s) {
    s = (s || '').toLowerCase().replace(/\.html$/, '').split('#')[0];
    s = s.replace(/^\.\//, '').replace(/^\//, '');
    return s === '' ? 'index' : s;
  }
  var page = normPage(location.pathname.split('/').pop() || '');
  document.querySelectorAll('.nav a, .mobile-nav a').forEach(function (a) {
    if (normPage(a.getAttribute('href')) === page) a.classList.add('active');
  });

  // Fallback reveal on scroll (runs synchronously, content can never stay hidden).
  function rectReveal() {
    revealEls.forEach(function (el) {
      if (el.classList.contains('in')) return;
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - 60 && r.bottom > 60) el.classList.add('in');
    });
  }
  window.addEventListener('scroll', rectReveal, { passive: true });
  window.addEventListener('resize', rectReveal);
  rectReveal();
  // Motion: follow the OS reduced-motion setting.
  var motionOff = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function splitWords(el) {
    var words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(function (w, i) {
      return '<span class="wmask"><span style="--i:' + i + '">' + w + '</span></span>';
    }).join(' ');
  }
  // Word-split masked rise for headings (skipped when motion is off)
  if (!motionOff) {
    document.querySelectorAll('.sec-head h2, .page-hero h1').forEach(splitWords);
    requestAnimationFrame(function () { document.body.classList.add('ready'); });
    setTimeout(function () { document.body.classList.add('ready'); }, 120);
  }

  // Scrollspy: highlight the nav link of the section in view
  var spyLinks = document.querySelectorAll('.nav a[href^="#"]');
  var spyMap = {};
  spyLinks.forEach(function (a) {
    var s = document.getElementById(a.getAttribute('href').slice(1));
    if (s) spyMap[s.id] = a;
  });
  if ('IntersectionObserver' in window && spyLinks.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          spyLinks.forEach(function (a) { a.classList.remove('active'); });
          var a = spyMap[en.target.id];
          if (a) a.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(spyMap).forEach(function (id) { spy.observe(document.getElementById(id)); });
  }

  // Gentle hero parallax (transform only, no blur/glass)
  var heroBg = document.querySelector('.hero__bg');
  if (heroBg && !motionOff) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY || 0;
        if (y < window.innerHeight) heroBg.style.transform = 'translateY(' + (y * 0.22) + 'px)';
        ticking = false;
      });
    }, { passive: true });
  }

  // Fee calculator (fees.html): tick subjects + pick mode -> total + 2 installments
  var calcBox = document.getElementById('feeCalc');
  if (calcBox) {
    var modeRadios = calcBox.querySelectorAll('input[name="mode"]');
    var boxes = calcBox.querySelectorAll('.calc-item input[type="checkbox"]');
    var totalEl = document.getElementById('calcTotal');
    var instEl = document.getElementById('calcInst');
    function calcUpdate() {
      var mode = 'online';
      modeRadios.forEach(function (r) { if (r.checked) mode = r.value; });
      var total = 0;
      boxes.forEach(function (b) {
        if (b.checked) total += parseInt(b.getAttribute('data-' + mode) || '0', 10);
      });
      var fmt = function (n) { return 'Rs ' + n.toLocaleString('en-PK'); };
      if (totalEl) totalEl.textContent = fmt(total);
      if (instEl) instEl.textContent = total ? ('2 × ' + fmt(Math.round(total / 2))) : '—';
    }
    modeRadios.forEach(function (r) { r.addEventListener('change', calcUpdate); });
    boxes.forEach(function (b) { b.addEventListener('change', calcUpdate); });
    calcUpdate();
  }

  // Mock subjects dropdown (mocks.html) — EDIT THIS LIST to open/close mocks.
  // (Real site: teachers open mocks in the marking system; here this list IS that switch.)
  var MOCK_SUBJECTS = ['FAR', 'DSR', 'BLD', 'Tax', 'MA', 'CR', 'BIA',
    'CFAP-01', 'CFAP-02', 'CFAP-03', 'CFAP-04', 'CFAP-05', 'CFAP-06'];
  var mSub = document.getElementById('m-subject');
  if (mSub && !mSub.options.length) {
    MOCK_SUBJECTS.forEach(function (s) {
      var o = document.createElement('option');
      o.textContent = s;
      mSub.appendChild(o);
    });
  }

  // Mock submission form (mocks.html) -> WhatsApp handoff
  var mockForm = document.getElementById('mockForm');
  if (mockForm) {
    mockForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var g = function (id) { return document.getElementById(id).value.trim(); };
      var text = 'Assalam-o-Alaikum, mock submission: ' +
        'Subject: ' + g('m-subject') +
        '. Mock: ' + (g('m-mock') || '-') +
        '. CRN: ' + (g('m-crn') || '-') +
        '. Name: ' + (g('m-name') || '-') +
        '. Email for result: ' + (g('m-email') || '-') +
        '. Note: ' + (g('m-note') || '-');
      window.open('https://wa.me/923327948519?text=' + encodeURIComponent(text), '_blank');
    });
  }

  // TA rail prev/next buttons
  document.querySelectorAll('[data-railbtn]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var rail = document.getElementById(btn.getAttribute('data-railbtn'));
      if (!rail) return;
      var dir = btn.classList.contains('prev') ? -1 : 1;
      rail.scrollBy({ left: dir * Math.min(560, rail.clientWidth * 0.8), behavior: 'smooth' });
    });
  });

  // Click-to-play video embeds (FAQ troubleshooting video)
  document.querySelectorAll('[data-video]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var box = document.createElement('div');
      box.className = 'vframe';
      box.innerHTML = '<iframe src="https://www.youtube.com/embed/' + el.getAttribute('data-video') + '?autoplay=1&rel=0" title="Troubleshooting video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
      el.replaceWith(box);
    });
  });

  // Image protection: blocks right-click saving and dragging (casual copying only).
  document.addEventListener('contextmenu', function (e) {
    if (e.target && e.target.closest && e.target.closest('img')) e.preventDefault();
  });
  document.querySelectorAll('img').forEach(function (img) {
    img.setAttribute('draggable', 'false');
  });
  // Footer year
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  // Demo enquiry form -> WhatsApp handoff (no backend needed on localhost)
  var form = document.getElementById('enquiryForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('c-name').value.trim();
      var level = document.getElementById('c-level').value;
      var phone = document.getElementById('c-phone').value.trim();
      var msg = document.getElementById('c-msg').value.trim();
      var text = 'Assalam-o-Alaikum, I am ' + (name || 'a student') +
        '. Level: ' + level + '. Phone: ' + (phone || '-') +
        '. Message: ' + (msg || '-');
      window.open('https://wa.me/923327948519?text=' + encodeURIComponent(text), '_blank');
    });
  }
})();
