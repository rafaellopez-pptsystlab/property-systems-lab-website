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

  // --- Background code-symbol canvas ---
  (function () {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const SYMBOLS = [
      '{ }', '=>', 'if()', 'while', '&&', '||', 'fn()', '//', '01',
      '10', '[]', 'API', '</>', '!==', 'async', 'return', '##',
      'for()', 'true', 'null', 'GET', 'POST', '200', '{}', '::', '>>',
      'n8n', 'zap', 'map()', '.then', 'await', '?? ', '0x', 'log()'
    ];

    const ACCENT   = '147,197,253'; // light blue — visible over dark bg
    const MIN_OP   = 0.55;
    const MAX_OP   = 1.0;
    const MIN_SIZE = 12;
    const MAX_SIZE = 17;
    const COUNT    = 90;

    let W, H, particles;

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function makeParticle() {
      return {
        x:      rand(0, W),
        y:      rand(-H, H),
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        size:   rand(MIN_SIZE, MAX_SIZE),
        op:     rand(MIN_OP, MAX_OP),
        speed:  rand(0.15, 0.45),
        drift:  rand(-0.08, 0.08),
      };
    }

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      particles = Array.from({ length: COUNT }, makeParticle);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        ctx.font = `${p.size}px 'Courier New', monospace`;
        ctx.fillStyle = `rgba(${ACCENT}, ${p.op})`;
        ctx.fillText(p.symbol, p.x, p.y);

        p.y -= p.speed;
        p.x += p.drift;

        if (p.y < -30) {
          p.y = H + 20;
          p.x = rand(0, W);
          p.symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        }
        if (p.x < -60)  p.x = W + 20;
        if (p.x > W + 60) p.x = -20;
      }
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();
    draw();
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
