/* ARM Business School — luxury site interactions */
(function () {
  'use strict';

  /* ---------- nav scrolled state ---------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
    var totop = document.getElementById('totop');
    if (totop) totop.classList.toggle('show', window.scrollY > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- burger / mobile nav ---------- */
  var burger = document.getElementById('burger');
  var mobileNav = document.getElementById('mobileNav');
  if (burger && mobileNav) {
    burger.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- back to top ---------- */
  var totop = document.getElementById('totop');
  if (totop) {
    totop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- animated counters ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    var dur = 1400, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animateCount(e.target);
          cio.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- fee calculator ---------- */
  var feeCalc = document.getElementById('feeCalc');
  if (feeCalc) {
    var totalEl = document.getElementById('calcTotal');
    var instEl = document.getElementById('calcInst');
    function fmt(n) { return 'Rs ' + n.toLocaleString('en-PK'); }
    function recalc() {
      var mode = feeCalc.querySelector('input[name="mode"]:checked');
      mode = mode ? mode.value : 'online';
      var total = 0;
      feeCalc.querySelectorAll('.calc-item input[type="checkbox"]').forEach(function (cb) {
        if (cb.checked) total += parseInt(cb.getAttribute('data-' + mode), 10) || 0;
      });
      if (totalEl) totalEl.textContent = fmt(total);
      if (instEl) instEl.textContent = total > 0 ? 'Two installments of ' + fmt(total / 2) : '—';
    }
    feeCalc.addEventListener('change', recalc);
    recalc();
  }

  /* ---------- mock subjects dropdown ---------- */
  var MOCK_SUBJECTS = [
    'CAF-01 Financial Accounting and Reporting',
    'CAF-02 Taxation Principles and Compliance',
    'CAF-03 Data, Systems and Risks',
    'CAF-04 Business Law Dynamics',
    'CAF-05 Management Accounting',
    'CAF-06 Corporate Reporting',
    'CAF-07 Business Insights and Analysis',
    'CAF-08 Audit and Assurance Essentials',
    'PRC-1 Fundamentals of Accounting',
    'PRC-2 Quantitative Analysis for Business',
    'PRC-3 Business and Economic Insights',
    'CFAP-01 Advanced Corporate Reporting',
    'CFAP-02 Corporate Laws and Governance',
    'CFAP-03 Sustainability Reporting and Assurance',
    'CFAP-04 Strategic Business Finance',
    'CFAP-05 Tax Practices and Planning',
    'CFAP-06 Audit, Assurance and Data',
    'Strategic Case Study'
  ];
  var mSub = document.getElementById('m-subject');
  if (mSub && !mSub.options.length) {
    MOCK_SUBJECTS.forEach(function (s) {
      var o = document.createElement('option');
      o.textContent = s;
      mSub.appendChild(o);
    });
  }

  /* ---------- mock submission form -> WhatsApp ---------- */
  var mockForm = document.getElementById('mockForm');
  if (mockForm) {
    mockForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var g = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
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

  /* ---------- enquiry form -> WhatsApp ---------- */
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

  /* ---------- footer year ---------- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
