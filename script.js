/* ===========================================================
   RIFAT ISLAM — PERSONAL PROFILE
   Vanilla JS: loader, particle field, scroll reveals, rail nav,
   scroll-to-top. No frameworks, no dependencies.
=========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loading screen ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hide'), 450);
  });
  // Fallback in case 'load' fires very fast or is delayed
  setTimeout(() => loader && loader.classList.add('hide'), 2500);

  /* ---------- Fade-in on scroll ---------- */
  const revealEls = document.querySelectorAll('.fade-in');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Rail nav active state ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const railDots = document.querySelectorAll('.rail-dot');
  if (sections.length && railDots.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const dot = document.querySelector(`.rail-dot[href="#${id}"]`);
        if (!dot) return;
        if (entry.isIntersecting) {
          railDots.forEach(d => d.classList.remove('active'));
          dot.classList.add('active');
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(sec => navObserver.observe(sec));
  }

  /* ---------- Scroll to top button ---------- */
  const scrollTopBtn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) scrollTopBtn.classList.add('show');
    else scrollTopBtn.classList.remove('show');
  }, { passive: true });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Particle / constellation background ---------- */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width, height, particles;
  const PARTICLE_COUNT_BASE = 70; // scaled by area below
  const LINK_DIST = 130;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function initParticles() {
    const count = Math.min(110, Math.floor((width * height) / 16000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.4 + 0.4
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    // update + draw particles
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(120,170,255,0.55)';
      ctx.fill();
    }

    // connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(99,230,255,${0.12 * (1 - dist / LINK_DIST)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    if (!prefersReducedMotion) requestAnimationFrame(step);
  }

  resize();
  initParticles();
  if (!prefersReducedMotion) {
    requestAnimationFrame(step);
  } else {
    step(); // draw one static frame
  }

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resize();
      initParticles();
      if (prefersReducedMotion) step();
    }, 200);
  });

});
