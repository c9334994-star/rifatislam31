/* ===========================================================
   RIFAT ISLAM — PERSONAL PROFILE
   Vanilla JS: loader, particle field, scroll reveals, rail nav,
   scroll-to-top, gallery modal. No frameworks, no dependencies.
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

  /* ---------- Gallery data: Photos & Videos ---------- */
  const PROFILE_PHOTO_URL = "https://scontent.fdac33-1.fna.fbcdn.net/v/t39.30808-6/719610080_4430132050608768_7617113884795366927_n.jpg?stp=dst-jpg_tt6&cstp=mx1023x1023&ctp=s1023x1023&_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGj5j_3shj0hfVQEo6OT90-s3UoBIOxKmSzdSgEg7EqZBFiGDUvpbrqm9eVgJ_35scvgsRrae8eh2IVjxLXcdUr&_nc_ohc=iCi59bd6ldMQ7kNvwEs32VN&_nc_oc=AdoWde0QQc-TGo87_YhJAkiGEPBKBuUSWV50woNGllR3kb--ydeBq6gU0AUnE5uFI3Y&_nc_zt=23&_nc_ht=scontent.fdac33-1.fna&_nc_gid=DEYr6TYPk5ztY-bnoAX_XA&_nc_ss=7b2a8&oh=00_AQAPZqkX0JIb9tUzn7lRwa0dtvk6Yb8IuZsc11HJKkftDg&oe=6A60F8D8";

  const PHOTOS = [
    { title: "Profile Photo", url: PROFILE_PHOTO_URL, cover: PROFILE_PHOTO_URL },
    { title: "Photo Post 1", url: "https://www.facebook.com/share/p/17ws8UNSaw/" },
    { title: "Photo Post 2", url: "https://www.facebook.com/share/p/1EZEcL8JwK/" },
    { title: "Photo Post 3", url: "https://www.facebook.com/share/p/14g1tUCZkFC/" },
    { title: "Photo Post 4", url: "https://www.facebook.com/share/p/1DKShUP3r5/" }
  ];

  const VIDEOS = [
    { title: "Video 1", url: "https://www.facebook.com/share/r/1BdsKGta9J/" },
    { title: "Video 2", url: "https://www.facebook.com/share/r/18rUK5k2UC/" },
    { title: "Video 3", url: "https://www.facebook.com/share/r/1dRxiphXuV/" },
    { title: "Video 4", url: "https://www.facebook.com/share/r/1BWk3tBUUL/" },
    { title: "Video 5", url: "https://www.facebook.com/share/r/1B1XY7xzrs/" },
    { title: "Video 6", url: "https://www.facebook.com/share/r/18uE3x8A8H/" },
    { title: "Video 7", url: "https://www.facebook.com/share/r/1GmMxdmtLz/" }
  ];

  const photoIconSVG = '<svg viewBox="0 0 24 24" fill="none"><path d="M4 8a2 2 0 012-2h1.2l.8-1.4A2 2 0 019.7 3.6h4.6a2 2 0 011.7 1L17 6h1a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.6" stroke="currentColor" stroke-width="1.7"/></svg>';
  const playIconSVG = '<svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M8 5.5v13l11-6.5-11-6.5z" fill="currentColor"/></svg>';

  const photoCountEl = document.getElementById('photoCount');
  const videoCountEl = document.getElementById('videoCount');
  if (photoCountEl) photoCountEl.textContent = PHOTOS.length;
  if (videoCountEl) videoCountEl.textContent = VIDEOS.length;

  /* ---------- Modal logic ---------- */
  const overlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalSub = document.getElementById('modalSub');
  const modalGrid = document.getElementById('modalGrid');
  const modalClose = document.getElementById('modalClose');
  let lastFocused = null;

  function buildCard(item, type) {
    const card = document.createElement('a');
    card.className = 'modal-card';
    card.href = item.url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';

    const cover = document.createElement('div');
    cover.className = 'modal-cover' + (item.cover ? '' : ' cover-gradient');
    if (item.cover) {
      cover.style.backgroundImage = `url("${item.cover}")`;
    } else {
      cover.innerHTML = type === 'video' ? '' : photoIconSVG;
    }
    if (type === 'video') {
      const play = document.createElement('div');
      play.className = 'modal-play';
      play.innerHTML = `<span>${playIconSVG}</span>`;
      cover.appendChild(play);
    }

    const label = document.createElement('div');
    label.className = 'modal-card-label';
    label.innerHTML = `<span>${item.title}</span><span>↗</span>`;

    card.appendChild(cover);
    card.appendChild(label);
    return card;
  }

  function openModal(type) {
    const isPhoto = type === 'photo';
    const items = isPhoto ? PHOTOS : VIDEOS;
    modalTitle.textContent = isPhoto ? 'Photos' : 'Videos';
    modalSub.textContent = isPhoto
      ? 'সব ছবির লিংক — কার্ডে ক্লিক করলে নতুন ট্যাবে খুলবে।'
      : 'সব ভিডিওর লিংক — কার্ডে ক্লিক করলে নতুন ট্যাবে খুলবে।';
    modalGrid.innerHTML = '';
    items.forEach(item => modalGrid.appendChild(buildCard(item, isPhoto ? 'photo' : 'video')));

    lastFocused = document.activeElement;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  const openPhotosBtn = document.getElementById('openPhotos');
  const openVideosBtn = document.getElementById('openVideos');
  if (openPhotosBtn) openPhotosBtn.addEventListener('click', () => openModal('photo'));
  if (openVideosBtn) openVideosBtn.addEventListener('click', () => openModal('video'));
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });

  /* ---------- Particle / constellation background ---------- */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width, height, particles;
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
      r: Math.random() * 1.4 + 0.4,
      hue: Math.random() < 0.5 ? '120,170,255' : '160,140,255'
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
      ctx.fillStyle = `rgba(${p.hue},0.55)`;
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
