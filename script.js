/* =============================================
   PROPERTY SYSTEMS LAB — SCRIPTS
   ============================================= */

(function () {
  'use strict';

  // --- Sticky nav shadow on scroll ---
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // --- Mobile nav toggle ---
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.querySelector('.nav__links');

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    // Animate burger to X
    const spans = navToggle.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  // Close mobile nav when any link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  // Close mobile nav on outside click
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      navLinks.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // --- Scroll-reveal animation ---
  const revealEls = document.querySelectorAll(
    '.problem-card, .service-card, .step, .pricing-card, .why-list li'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el, i) => {
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(20px)';
      el.style.transition = `opacity 0.5s ease ${(i % 4) * 60}ms, transform 0.5s ease ${(i % 4) * 60}ms`;
      observer.observe(el);
    });
  }

  document.head.insertAdjacentHTML('beforeend', `
    <style>
      .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    </style>
  `);

  // --- Background code symbols ---
  (function () {
    const container = document.getElementById('codeBg');
    if (!container) return;

    const SYMBOLS = [
      '{ }', '=>', 'if()', 'while', '&&', '||', 'fn()', '//',
      '[]', 'API', '</>', '!==', 'async', 'return',
      'for()', 'true', 'null', 'GET', 'POST', '{}', '::',
      'n8n', 'map()', '.then', 'await', '0x', 'log()', '01010',
      'zap()', 'run()', 'true', '>>', 'null', 'fetch()'
    ];

    const COUNT = 55;

    for (let i = 0; i < COUNT; i++) {
      const span        = document.createElement('span');
      span.textContent  = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      const left        = Math.random() * 100;
      const duration    = 18 + Math.random() * 22;
      const delay       = -(Math.random() * duration);
      const opacity     = 0.08 + Math.random() * 0.14;
      const fontSize    = 11 + Math.random() * 5;

      span.style.cssText = `
        left: ${left}%;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        opacity: ${opacity};
        font-size: ${fontSize}px;
      `;
      container.appendChild(span);
    }
  })();

  // --- Smooth anchor offset (account for fixed nav height) ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = nav.offsetHeight + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
