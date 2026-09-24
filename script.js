/* Fitness Zone Gym — Jaipur
   Vanilla JS, no dependencies, no build step. */
(function () {
  'use strict';

  var doc = document;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile navigation ---------- */
  var toggle = doc.getElementById('navToggle');
  var nav = doc.getElementById('primaryNav');

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }

  function openNav() {
    if (!nav || !toggle) return;
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      if (toggle.getAttribute('aria-expanded') === 'true') { closeNav(); } else { openNav(); }
    });

    /* Close after choosing a link (mobile) */
    nav.addEventListener('click', function (e) {
      var link = e.target.closest ? e.target.closest('a') : null;
      if (link) { closeNav(); }
    });

    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeNav();
        toggle.focus();
      }
    });

    /* Click outside closes the panel */
    doc.addEventListener('click', function (e) {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      closeNav();
    });

    /* Reset state when we cross into the desktop layout */
    var mq = window.matchMedia('(min-width: 1024px)');
    var onDesktop = function (m) { if (m.matches) { closeNav(); } };
    if (mq.addEventListener) { mq.addEventListener('change', onDesktop); }
    else if (mq.addListener) { mq.addListener(onDesktop); }
  }

  /* ---------- Sticky header shadow ---------- */
  var header = doc.getElementById('siteHeader');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 8) { header.classList.add('is-stuck'); }
      else { header.classList.remove('is-stuck'); }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Smooth anchor scrolling (respecting reduced motion) ---------- */
  if (!reduceMotion) {
    doc.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var target = doc.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = (header ? header.offsetHeight : 0) + 8;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
      /* Keep keyboard focus meaningful */
      if (!target.hasAttribute('tabindex')) { target.setAttribute('tabindex', '-1'); }
      target.focus({ preventScroll: true });
    });
  }

  /* ---------- Scroll reveal (stagger list, MASTER.md motion tier) ---------- */
  var revealables = Array.prototype.slice.call(
    doc.querySelectorAll('.card, .review-card, .review-stat, .info-card, .trainer-copy, .section-head')
  );

  function showAll() {
    revealables.forEach(function (el) { el.classList.remove('reveal'); el.classList.add('is-in'); });
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    revealables.forEach(function (el) { el.classList.add('reveal', 'preload'); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.remove('preload');
        var siblings = Array.prototype.slice.call(el.parentNode.children);
        var i = Math.min(siblings.indexOf(el), 5);
        el.style.transitionDelay = (i * 60) + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
        window.setTimeout(function () { el.style.transitionDelay = ''; }, 700);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Footer year ---------- */
  var year = doc.getElementById('year');
  if (year) { year.textContent = String(new Date().getFullYear()); }

  /* ---------- Mark that JS is active (progressive enhancement) ---------- */
  doc.documentElement.classList.remove('no-js');
})();
