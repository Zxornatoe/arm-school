/* ARM Business School — clay rebuild front-end behaviour (vanilla JS) */
(function () {
  'use strict';

  // Mobile nav toggle
  var burger = document.getElementById('burger');
  var mobileNav = document.getElementById('mobileNav');
  if (burger && mobileNav) {
    burger.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    mobileNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        mobileNav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Open menu');
      }
    });
  }

  // Back to top
  var totop = document.getElementById('totop');
  function onScrollTop() {
    if (totop) totop.classList.toggle('show', (window.scrollY || window.pageYOffset || 0) > 700);
  }
  window.addEventListener('scroll', onScrollTop, { passive: true });
  onScrollTop();
  if (totop) {
    totop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Reveal on scroll (.reveal -> .in via IntersectionObserver)
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

  // Fee calculator (fees.html): tick subjects + pick mode -> total + 2 installments
  var calcBox = document.getElementById('feeCalc');
  if (calcBox) {
    var modeRadios = calcBox.querySelectorAll('input[name="mode"]');
    var boxes = calcBox.querySelectorAll('.calc-item input[type="checkbox"]');
    var totalEl = document.getElementById('calcTotal');
    var instEl = document.getElementById('calcInst');
    var fmt = function (n) { return 'Rs ' + n.toLocaleString('en-PK'); };
    function calcUpdate() {
      var mode = 'online';
      modeRadios.forEach(function (r) { if (r.checked) mode = r.value; });
      var total = 0;
      boxes.forEach(function (b) {
        if (b.checked) total += parseInt(b.getAttribute('data-' + mode) || '0', 10);
      });
      if (totalEl) totalEl.textContent = fmt(total);
      if (instEl) instEl.textContent = total > 0 ? ('2 × ' + fmt(Math.round(total / 2))) : '—';
    }
    modeRadios.forEach(function (r) { r.addEventListener('change', calcUpdate); });
    boxes.forEach(function (b) { b.addEventListener('change', calcUpdate); });
    calcUpdate();
  }

  // Mock subjects dropdown (mocks.html)
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

  // Enquiry form (contact.html) -> WhatsApp handoff
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

  // Footer year
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
