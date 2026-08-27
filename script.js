'use strict';

/* ==========================================================================
   VANGUARD WEB WORKS — MOTION ENGINE v3 (HOLY / ELEGANT EDITION)
   Animasi murni Web Animations API + rAF.
   Fokus: setiap sentuhan terasa mahal, lembut, dan sakral.
   ========================================================================== */

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Bahasa gerak premium ---- */
  const EASE_OUT_EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';
  const EASE_OUT_BACK = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
  const EASE_SMOOTH   = 'cubic-bezier(0.65, 0, 0.35, 1)';
  const EASE_SILK     = 'cubic-bezier(0.19, 1, 0.22, 1)';
  const EASE_HOLY     = 'cubic-bezier(0.22, 1, 0.36, 1)';   // sangat lembut
  const EASE_PRESS    = 'cubic-bezier(0.4, 0, 0.2, 1)';

  const DUR = {
    instant: 160,
    fast:    320,
    base:    720,
    slow:    1100,
    silk:    1450,
    holy:    1800
  };

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const lerp  = (a, b, t) => a + (b - a) * t;

  /* ---- Helper animasi aman ---- */
  function safeAnimate(el, keyframes, options = {}) {
    if (!el) return null;
    if (reduceMotion) {
      const last = keyframes[keyframes.length - 1];
      Object.keys(last).forEach((k) => { el.style[k] = last[k]; });
      return null;
    }
    const opts = Object.assign({
      duration: DUR.base,
      easing: EASE_OUT_EXPO,
      fill: 'forwards'
    }, options);
    const anim = el.animate(keyframes, opts);
    anim.finished
      .then(() => {
        try { anim.commitStyles(); } catch (e) {}
        anim.cancel();
      })
      .catch(() => {});
    return anim;
  }

  /* ---- Pecah teks jadi baris (tirai) ---- */
  function wrapLines(el) {
    const parts = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = '';
    const inners = [];
    parts.forEach((part) => {
      const mask = document.createElement('span');
      mask.style.display = 'block';
      mask.style.overflow = 'hidden';
      const inner = document.createElement('span');
      inner.style.display = 'inline-block';
      inner.style.willChange = 'transform, opacity, filter';
      inner.style.transform = 'translateY(120%)';
      inner.style.opacity = '0';
      inner.style.filter = 'blur(10px)';
      inner.innerHTML = part.trim();
      mask.appendChild(inner);
      el.appendChild(mask);
      inners.push(inner);
    });
    return inners;
  }

  function revealLines(inners, { baseDelay = 0, stagger = 130 } = {}) {
    inners.forEach((inner, i) => {
      safeAnimate(inner, [
        { transform: 'translateY(120%)', opacity: 0, filter: 'blur(10px)' },
        { transform: 'translateY(0%)',   opacity: 1, filter: 'blur(0px)' }
      ], {
        duration: DUR.holy,
        delay: baseDelay + i * stagger,
        easing: EASE_HOLY
      });
    });
  }

  /* ---- Pecah jadi huruf (footer title) ---- */
  function wrapChars(el) {
    const text = el.textContent;
    el.textContent = '';
    const spans = [];
    Array.from(text).forEach((ch) => {
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.willChange = 'transform, opacity';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      el.appendChild(span);
      spans.push(span);
    });
    return spans;
  }

  /* ---- Animated underline elegan ---- */
  function attachAnimatedUnderline(el, color) {
    if (reduceMotion) return;
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    const line = document.createElement('span');
    line.style.cssText = `
      position:absolute; left:0; bottom:-3px; height:1.5px; width:100%;
      background:${color || 'currentColor'};
      transform:scaleX(0); transform-origin:left;
      pointer-events:none; transition:none;
    `;
    el.appendChild(line);

    el.addEventListener('mouseenter', () => {
      line.style.transformOrigin = 'left';
      safeAnimate(line, [
        { transform: 'scaleX(0)' },
        { transform: 'scaleX(1)' }
      ], { duration: DUR.fast, easing: EASE_OUT_EXPO });
    });

    el.addEventListener('mouseleave', () => {
      line.style.transformOrigin = 'right';
      safeAnimate(line, [
        { transform: 'scaleX(1)' },
        { transform: 'scaleX(0)' }
      ], { duration: DUR.fast, easing: EASE_SMOOTH });
    });
  }

  /* ========================================================================
     RUNTIME STYLES (cursor, menu, ripple, dll)
     ======================================================================== */
  function injectRuntimeStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .vw-page-veil{
        position:fixed; inset:0;
        background:#080808;
        z-index:300; pointer-events:none;
      }
      .vw-menu-overlay{
        position:fixed; inset:0;
        display:none; flex-direction:column;
        align-items:center; justify-content:center; gap:26px;
        background:rgba(8,8,8,0.94);
        backdrop-filter:blur(22px);
        -webkit-backdrop-filter:blur(22px);
        z-index:200;
      }
      .vw-menu-links{display:flex;flex-direction:column;align-items:center;gap:20px;}
      .vw-menu-link{
        position:relative;
        font-family:'Anton',impact,sans-serif;
        font-size:clamp(1.9rem,6.5vw,3.4rem);
        letter-spacing:1.5px;
        color:#fff; text-transform:uppercase;
        transition:color .35s ease, transform .4s cubic-bezier(0.19,1,0.22,1);
        cursor:pointer;
      }
      .vw-menu-link:hover{
        color:#E4F059;
        transform:translateX(12px);
      }
      .vw-menu-close{
        position:absolute; top:28px; right:36px;
        background:transparent; border:1px solid rgba(255,255,255,0.6);
        color:#fff; width:48px; height:48px; border-radius:50%;
        font-size:1.5rem; cursor:pointer; line-height:1;
        transition:all .35s cubic-bezier(0.19,1,0.22,1);
      }
      .vw-menu-close:hover{
        background:#E4F059; border-color:#E4F059; color:#080808;
        transform:rotate(90deg) scale(1.08);
      }
      .vw-cursor-glow{
        position:fixed; top:0; left:0;
        width:420px; height:420px; border-radius:50%;
        background:radial-gradient(circle, rgba(228,240,89,0.38), transparent 68%);
        filter:blur(28px); mix-blend-mode:screen;
        pointer-events:none; opacity:0;
        transition:opacity .6s ease; z-index:5;
      }
      .vw-cursor-dot{
        position:fixed; top:0; left:0;
        width:7px; height:7px; border-radius:50%;
        background:#E4F059;
        pointer-events:none; opacity:0;
        transition:opacity .3s ease, transform .2s ease;
        z-index:6; mix-blend-mode:difference;
      }
      .vw-ripple{
        position:absolute; border-radius:50%;
        background:currentColor; pointer-events:none;
        opacity:0.45;
      }
      .vw-tooltip{
        position:absolute; bottom:100%; left:50%;
        transform:translate(-50%,4px);
        margin-bottom:12px;
        background:#080808; color:#fff;
        padding:8px 16px; border-radius:10px;
        font-size:.8rem; font-weight:600;
        white-space:nowrap; opacity:0;
        pointer-events:none;
        transition:opacity .35s ease, transform .4s cubic-bezier(0.19,1,0.22,1);
        box-shadow:0 8px 24px rgba(0,0,0,0.25);
      }
      .vw-chat-ring{
        position:absolute; inset:0; border-radius:16px;
        border:2px solid #E4F059; pointer-events:none;
      }
      .vw-nav-glass{
        transition: background-color .5s ease, backdrop-filter .5s ease,
                    box-shadow .5s ease, padding .4s ease;
      }
      .vw-gallery-glow{
        position:absolute; inset:0; border-radius:inherit;
        box-shadow: inset 0 0 0 1px rgba(255,90,0,0);
        transition: box-shadow .4s ease;
        pointer-events:none; z-index:3;
      }
      @media (prefers-reduced-motion: reduce){
        *{animation-duration:.01ms !important; animation-iteration-count:1 !important; transition-duration:.01ms !important;}
      }
    `;
    document.head.appendChild(style);
  }

  /* ========================================================================
     0) PAGE VEIL — tirai pembuka yang sangat lembut
     ======================================================================== */
  function initPageVeil(onDone) {
    if (reduceMotion) { onDone(); return; }
    const veil = document.createElement('div');
    veil.className = 'vw-page-veil';
    document.body.appendChild(veil);

    requestAnimationFrame(() => {
      const anim = safeAnimate(veil, [
        { transform: 'translateY(0%)', opacity: 1 },
        { transform: 'translateY(-105%)', opacity: 1 }
      ], {
        duration: DUR.holy,
        delay: 80,
        easing: EASE_HOLY
      });
      const cleanup = () => { veil.remove(); onDone(); };
      if (anim) anim.finished.then(cleanup).catch(cleanup);
      else cleanup();
    });
  }

  /* ========================================================================
     1) INTRO HERO — urutan yang terasa sakral
     ======================================================================== */
  function initPreloaderIntro() {
    const nav      = document.querySelector('.nav');
    const badge    = document.querySelector('.hero .badge-spin');
    const title    = document.querySelector('.hero-title');
    const subtitle = document.querySelector('.hero-subtitle');
    const cta      = document.querySelector('.hero .btn-pill');

    if (nav) {
      nav.style.opacity = '0';
      nav.style.transform = 'translateY(-20px)';
    }
    if (badge) {
      badge.style.opacity = '0';
      badge.style.scale = '0.35';
    }
    if (subtitle) {
      subtitle.style.opacity = '0';
      subtitle.style.transform = 'translateY(22px)';
    }
    if (cta) {
      cta.style.opacity = '0';
      cta.style.transform = 'translateY(28px)';
    }

    const inners = title ? wrapLines(title) : [];
    const introDelay = reduceMotion ? 0 : 220;

    requestAnimationFrame(() => {
      if (nav) {
        safeAnimate(nav, [
          { opacity: 0, transform: 'translateY(-20px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: DUR.base, easing: EASE_OUT_EXPO, delay: Math.max(0, introDelay - 160) });
      }

      if (badge) {
        safeAnimate(badge, [
          { opacity: 0, scale: 0.35 },
          { opacity: 1, scale: 1 }
        ], { duration: DUR.slow, easing: EASE_OUT_BACK, delay: introDelay });
      }

      revealLines(inners, { baseDelay: introDelay + 160, stagger: 150 });

      const afterTitle = introDelay + 160 + inners.length * 150 + 180;

      if (subtitle) {
        safeAnimate(subtitle, [
          { opacity: 0, transform: 'translateY(22px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: DUR.base, easing: EASE_OUT_EXPO, delay: afterTitle });
      }

      if (cta) {
        safeAnimate(cta, [
          { opacity: 0, transform: 'translateY(28px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], {
          duration: DUR.base,
          easing: EASE_OUT_EXPO,
          delay: afterTitle + (subtitle ? 110 : 0)
        });
      }
    });
  }

  /* ========================================================================
     2) STICKY NAV — kaca buram premium
     ======================================================================== */
  function initStickyNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    nav.classList.add('vw-nav-glass');

    let ticking = false;
    let scrolled = false;

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const isScrolled = window.scrollY > 36;
        if (isScrolled !== scrolled) {
          scrolled = isScrolled;
          nav.style.padding = isScrolled ? '12px 40px' : '20px 40px';
          nav.style.backgroundColor = isScrolled ? 'rgba(8,8,8,0.42)' : 'transparent';
          nav.style.backdropFilter = isScrolled ? 'blur(16px)' : 'none';
          nav.style.webkitBackdropFilter = isScrolled ? 'blur(16px)' : 'none';
          nav.style.boxShadow = isScrolled ? '0 8px 32px rgba(0,0,0,0.18)' : 'none';

          const rMark = nav.querySelector('.r-mark');
          if (rMark) {
            rMark.style.transition = `transform ${DUR.fast}ms ${EASE_SMOOTH}`;
            rMark.style.transform = isScrolled ? 'scale(0.88)' : 'scale(1)';
          }
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ========================================================================
     3) MOBILE MENU — full screen elegan
     ======================================================================== */
  function initMobileMenu() {
    const btn = document.querySelector('.menu-btn');
    if (!btn) return;

    const overlay = document.createElement('div');
    overlay.className = 'vw-menu-overlay';
    overlay.innerHTML = `
      <button class="vw-menu-close" aria-label="Tutup menu">&times;</button>
      <nav class="vw-menu-links">
        <a href="faq.html" class="vw-menu-link">FAQ</a>
        <a href="tentang_kami.html" class="vw-menu-link">TENTANG KAMI</a>
        <a href="galeri.html" class="vw-menu-link">GALERI</a>
        <a href="tim.html" class="vw-menu-link">DOSEN</a>
        <a href="kontak.html" class="vw-menu-link">KONTAK</a>
      </nav>
    `;
    document.body.appendChild(overlay);

    const closeBtn = overlay.querySelector('.vw-menu-close');
    const links = overlay.querySelectorAll('.vw-menu-link');
    links.forEach((link) => attachAnimatedUnderline(link, '#E4F059'));

    let isOpen = false;

    function openMenu() {
      isOpen = true;
      overlay.style.display = 'flex';
      overlay.style.pointerEvents = 'auto';
      document.body.style.overflow = 'hidden';
      btn.textContent = 'TUTUP ×';

      safeAnimate(overlay, [
        { opacity: 0 },
        { opacity: 1 }
      ], { duration: DUR.fast, easing: EASE_SMOOTH });

      links.forEach((link, i) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(36px)';
        safeAnimate(link, [
          { opacity: 0, transform: 'translateY(36px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], {
          duration: DUR.base,
          delay: 100 + i * 90,
          easing: EASE_OUT_EXPO
        });
      });
    }

    function closeMenu() {
      isOpen = false;
      btn.textContent = 'MENU +';
      document.body.style.overflow = '';
      overlay.style.pointerEvents = 'none';

      const anim = safeAnimate(overlay, [
        { opacity: 1 },
        { opacity: 0 }
      ], { duration: DUR.fast, easing: EASE_SMOOTH });

      const done = () => { overlay.style.display = 'none'; };
      if (anim) anim.finished.then(done).catch(done);
      else done();
    }

    btn.addEventListener('click', () => (isOpen ? closeMenu() : openMenu()));
    closeBtn.addEventListener('click', closeMenu);
    links.forEach((link) => link.addEventListener('click', closeMenu));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeMenu(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) closeMenu();
    });
  }

  /* ========================================================================
     4) RIPPLE + PRESS FEEDBACK di setiap tombol
     ======================================================================== */
  function initClickRipple() {
    if (reduceMotion) return;

    const selector = '.btn-pill, .menu-btn, .chat-btn, .vw-menu-close, .filter-btn';

    document.addEventListener('click', (e) => {
      const target = e.target.closest(selector);
      if (!target) return;

      const rect = target.getBoundingClientRect();
      if (getComputedStyle(target).position === 'static') {
        target.style.position = 'relative';
      }
      target.style.overflow = target.style.overflow || 'hidden';

      // Ripple
      const ripple = document.createElement('span');
      ripple.className = 'vw-ripple';
      const size = Math.max(rect.width, rect.height) * 1.6;
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top  = `${e.clientY - rect.top  - size / 2}px`;
      target.appendChild(ripple);

      const anim = safeAnimate(ripple, [
        { transform: 'scale(0)', opacity: 0.5 },
        { transform: 'scale(1)', opacity: 0 }
      ], { duration: 680, easing: EASE_SMOOTH });

      const cleanup = () => ripple.remove();
      if (anim) anim.finished.then(cleanup).catch(cleanup);
      else cleanup();
    });

    // Subtle press scale
    document.addEventListener('pointerdown', (e) => {
      const target = e.target.closest(selector);
      if (!target) return;
      target.style.transition = `transform ${DUR.instant}ms ${EASE_PRESS}`;
      target.style.transform = 'scale(0.96)';
    });

    document.addEventListener('pointerup', (e) => {
      const target = e.target.closest(selector);
      if (!target) return;
      target.style.transition = `transform ${DUR.fast}ms ${EASE_OUT_BACK}`;
      target.style.transform = '';
    });

    document.addEventListener('pointerleave', (e) => {
      const target = e.target.closest(selector);
      if (!target) return;
      target.style.transform = '';
    });
  }

  /* ========================================================================
     5) BADGE SPIN — pause + glow saat disentuh
     ======================================================================== */
  function initBadgeHover() {
    document.querySelectorAll('.badge-spin').forEach((badge) => {
      badge.style.transition = `filter ${DUR.fast}ms ease, transform ${DUR.fast}ms ease`;

      badge.addEventListener('mouseenter', () => {
        badge.style.animationPlayState = 'paused';
        badge.style.filter = 'drop-shadow(0 0 20px rgba(228,240,89,0.95))';
        badge.style.transform = 'scale(1.06)';
      });

      badge.addEventListener('mouseleave', () => {
        badge.style.animationPlayState = 'running';
        badge.style.filter = 'none';
        badge.style.transform = 'scale(1)';
      });
    });
  }

  /* ========================================================================
     6) SCROLL REVEAL — lebih dalam & elegan
     ======================================================================== */
  function prepareUp(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(48px)';
    el.style.filter = 'blur(6px)';
    el.style.willChange = 'transform, opacity, filter';
  }

  function prepareTilt(el) {
    el.style.opacity = '0';
    el.style.transform = 'perspective(1000px) rotateX(12deg) translateY(32px) scale(0.94)';
    el.style.willChange = 'transform, opacity';
  }

  function prepareWipe(el) {
    el.style.opacity = '1';
    el.style.clipPath = 'inset(0 0 100% 0)';
    el.style.willChange = 'clip-path';
  }

  function revealElement(el) {
    const delay = (el._vwIndex || 0) * 90;

    if (el.dataset.vwLines) {
      revealLines(el._vwInners, { baseDelay: 0, stagger: 120 });
      return;
    }

    if (el._vwChars) {
      el._vwChars.forEach((ch, i) => {
        safeAnimate(ch, [
          { opacity: 0, transform: 'translateY(70%) rotate(10deg)' },
          { opacity: 1, transform: 'translateY(0) rotate(0deg)' }
        ], {
          duration: DUR.base,
          delay: i * 42,
          easing: EASE_OUT_BACK
        });
      });
      return;
    }

    if (el.dataset.vwWipe) {
      safeAnimate(el, [
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)' }
      ], { duration: DUR.silk, delay, easing: EASE_SILK });
      return;
    }

    if (el.dataset.vwTilt) {
      safeAnimate(el, [
        { opacity: 0, transform: 'perspective(1000px) rotateX(12deg) translateY(32px) scale(0.94)' },
        { opacity: 1, transform: 'perspective(1000px) rotateX(0deg) translateY(0) scale(1)' }
      ], { duration: DUR.slow, delay, easing: EASE_OUT_EXPO });
      return;
    }

    safeAnimate(el, [
      { opacity: 0, transform: 'translateY(48px)', filter: 'blur(6px)' },
      { opacity: 1, transform: 'translateY(0)', filter: 'blur(0px)' }
    ], { duration: DUR.silk, delay, easing: EASE_HOLY });
  }

  function initScrollReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealElement(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

    // Text & simple elements
    const upGroups = [
      '.about .body-text', '.about .btn-pill',
      '.trainings .eyebrow-center',
      '.team-text .body-text', '.team-text .btn-pill',
      '.footer-grid > div',
      '.hero-subtitle',
      '.page-wrapper .body-text',
      '.faq-item', '.contact-form', '.contact-info-list li'
    ];

    upGroups.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el._vwIndex = i;
        prepareUp(el);
        io.observe(el);
      });
    });

    // Typographic cluster
    document.querySelectorAll('.typographic-cluster .word').forEach((el, i) => {
      el._vwIndex = i;
      prepareUp(el);
      io.observe(el);
    });

    // 3D tilt cards
    const tiltGroups = ['.team-grid .team-member', '.team-card', '.gallery-card'];
    tiltGroups.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el._vwIndex = i;
        el.dataset.vwTilt = '1';
        prepareTilt(el);
        io.observe(el);
      });
    });

    // Wipe images
    const wipeGroups = ['.image-grid .img-card', '.about-image .octagon-mask'];
    wipeGroups.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el._vwIndex = i;
        el.dataset.vwWipe = '1';
        prepareWipe(el);
        io.observe(el);
      });
    });

    // Section titles as lines
    document.querySelectorAll(
      '.about .section-title, .team .section-title, .page-wrapper .section-title'
    ).forEach((el) => {
      el._vwInners = wrapLines(el);
      el.dataset.vwLines = '1';
      io.observe(el);
    });

    // Footer title per character
    document.querySelectorAll('.footer-title').forEach((el) => {
      el._vwChars = wrapChars(el);
      io.observe(el);
    });
  }

  /* ========================================================================
     7) COUNTER
     ======================================================================== */
  function initCounters() {
    const span = document.querySelector('.date-badge span');
    if (!span) return;
    const target = parseInt(span.textContent, 10) || 0;
    if (reduceMotion) {
      span.textContent = String(target);
      return;
    }

    let started = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        const start = performance.now();
        const duration = 1400;

        requestAnimationFrame(function frame(now) {
          const t = clamp((now - start) / duration, 0, 1);
          const eased = 1 - Math.pow(1 - t, 4);
          span.textContent = String(Math.round(target * eased));
          if (t < 1) requestAnimationFrame(frame);
          else span.textContent = String(target);
        });
        io.unobserve(span);
      });
    }, { threshold: 0.55 });
    io.observe(span);
  }

  /* ========================================================================
     8) MAGNETIC BUTTONS — lebih lembut & responsif
     ======================================================================== */
  function initMagneticButtons() {
    document.querySelectorAll('.btn-pill, .chat-btn').forEach((el) => {
      let raf = null;

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top  - rect.height / 2;

        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transition = 'transform 0.16s ease-out';
          el.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;

          const icon = el.querySelector('.btn-icon');
          if (icon) {
            icon.style.transform = `translate(${x * 0.14}px, ${y * 0.14}px) rotate(${clamp(x * 0.55, -22, 22)}deg)`;
          }
        });
      });

      el.addEventListener('mouseleave', () => {
        el.style.transition = `transform ${DUR.slow}ms ${EASE_OUT_BACK}`;
        el.style.transform = 'translate(0,0)';
        const icon = el.querySelector('.btn-icon');
        if (icon) {
          icon.style.transition = `transform ${DUR.slow}ms ${EASE_OUT_BACK}`;
          icon.style.transform = 'translate(0,0) rotate(0deg)';
        }
      });
    });
  }

  /* ========================================================================
     9) 3D TILT + IMAGE PARALLAX — sangat elegan
     ======================================================================== */
  function initTiltCards() {
    const targets = document.querySelectorAll(
      '.img-card, .team-member, .octagon-mask, .gallery-card, .team-card, .editorial-img'
    );

    targets.forEach((el) => {
      let raf = null;

      // Add subtle inner glow layer for gallery
      if (el.classList.contains('gallery-card')) {
        const glow = document.createElement('div');
        glow.className = 'vw-gallery-glow';
        el.appendChild(glow);
      }

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width  - 0.5;
        const py = (e.clientY - rect.top)  / rect.height - 0.5;

        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transition = 'transform 0.14s ease-out';
          el.style.transform = `
            perspective(1100px)
            rotateX(${(-py * 8).toFixed(2)}deg)
            rotateY(${(px * 10).toFixed(2)}deg)
            scale(1.03)
          `;

          const img = el.querySelector('img');
          if (img) {
            img.style.transition = 'transform 0.14s ease-out';
            img.style.transform = `scale(1.09) translate(${px * -10}px, ${py * -10}px)`;
          }

          const glow = el.querySelector('.vw-gallery-glow');
          if (glow) {
            glow.style.boxShadow = `inset 0 0 0 1.5px rgba(255,90,0,${0.35 + Math.abs(px) * 0.4})`;
          }
        });
      });

      el.addEventListener('mouseleave', () => {
        el.style.transition = `transform ${DUR.silk}ms ${EASE_SILK}`;
        el.style.transform = 'perspective(1100px) rotateX(0) rotateY(0) scale(1)';

        const img = el.querySelector('img');
        if (img) {
          img.style.transition = `transform ${DUR.silk}ms ${EASE_SILK}`;
          img.style.transform = 'scale(1) translate(0,0)';
        }

        const glow = el.querySelector('.vw-gallery-glow');
        if (glow) {
          glow.style.boxShadow = 'inset 0 0 0 1px rgba(255,90,0,0)';
        }
      });
    });

    // Team photos: grayscale → color
    document.querySelectorAll('.team-member img, .team-img').forEach((img) => {
      img.style.transition = `filter ${DUR.base}ms ${EASE_SMOOTH}`;
      const parent = img.closest('.team-member, .team-card');
      if (!parent) return;

      parent.addEventListener('mouseenter', () => {
        img.style.filter = 'grayscale(0%)';
      });
      parent.addEventListener('mouseleave', () => {
        img.style.filter = 'grayscale(100%)';
      });
    });
  }

  /* ========================================================================
     10) CUSTOM CURSOR — glow + lag yang sangat lembut
     ======================================================================== */
  function initCursorGlow() {
    if (window.matchMedia('(pointer: coarse)').matches) return; // skip di touch

    const hero = document.querySelector('.hero');
    const glow = document.createElement('div');
    glow.className = 'vw-cursor-glow';
    document.body.appendChild(glow);

    const dot = document.createElement('div');
    dot.className = 'vw-cursor-dot';
    document.body.appendChild(dot);

    let tx = 0, ty = 0, cx = 0, cy = 0;
    let dx = 0, dy = 0;
    let dotX = 0, dotY = 0;

    document.addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY;
      dx = e.clientX; dy = e.clientY;
      dot.style.opacity = '0.9';
    });

    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      glow.style.opacity = '0';
    });

    if (hero) {
      hero.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
      hero.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
    }

    // Scale dot on interactive elements
    document.querySelectorAll('a, button, .btn-pill, .chat-btn, .gallery-card, .img-card').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        dot.style.transform = 'translate(-50%, -50%) scale(2.6)';
      });
      el.addEventListener('mouseleave', () => {
        dot.style.transform = 'translate(-50%, -50%) scale(1)';
      });
    });

    (function loop() {
      cx = lerp(cx, tx, 0.11);
      cy = lerp(cy, ty, 0.11);
      glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;

      dotX = lerp(dotX, dx, 0.32);
      dotY = lerp(dotY, dy, 0.32);
      dot.style.left = `${dotX}px`;
      dot.style.top  = `${dotY}px`;
      requestAnimationFrame(loop);
    })();
  }

  /* ========================================================================
     11) HERO PARALLAX lembut
     ======================================================================== */
  function initHeroParallax() {
    const hero  = document.querySelector('.hero');
    const title = document.querySelector('.hero-title');
    if (!hero || !title) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const total = rect.height + window.innerHeight;
        const progress = clamp(1 - rect.bottom / total, 0, 1);

        title.style.transform = `translateY(${progress * 90}px)`;
        title.style.opacity = String(clamp(1 - progress * 1.45, 0, 1));
        ticking = false;
      });
    }, { passive: true });
  }

  /* ========================================================================
     12) CLUSTER HOVER — depth of field
     ======================================================================== */
  function initClusterHover() {
    const cluster = document.querySelector('.typographic-cluster');
    if (!cluster) return;
    const words = cluster.querySelectorAll('.word');

    words.forEach((word) => {
      word.style.transition = `
        transform ${DUR.fast}ms ${EASE_OUT_BACK},
        color ${DUR.fast}ms ease,
        opacity ${DUR.fast}ms ease,
        filter ${DUR.fast}ms ease
      `;

      word.addEventListener('mouseenter', () => {
        words.forEach((w) => {
          if (w !== word) {
            w.style.opacity = '0.28';
            w.style.filter = 'blur(2.5px)';
          }
        });
        word.style.transform = 'scale(1.09) translateY(-5px)';
        word.style.color = '#080808';
        word.style.filter = 'blur(0px)';
      });

      word.addEventListener('mouseleave', () => {
        words.forEach((w) => {
          w.style.opacity = '1';
          w.style.filter = 'blur(0px)';
        });
        word.style.transform = 'scale(1) translateY(0)';
        word.style.color = '';
      });
    });
  }

  /* ========================================================================
     13) CHAT BUTTON — tooltip + pulse + bounce
     ======================================================================== */
  function initChatButtonIdle() {
    const chat = document.querySelector('.chat-btn');
    if (!chat) return;

    const tip = document.createElement('div');
    tip.className = 'vw-tooltip';
    tip.textContent = 'Chat dengan Admisi';
    chat.appendChild(tip);

    chat.addEventListener('mouseenter', () => {
      tip.style.opacity = '1';
      tip.style.transform = 'translate(-50%, -16px)';
    });
    chat.addEventListener('mouseleave', () => {
      tip.style.opacity = '0';
      tip.style.transform = 'translate(-50%, 4px)';
    });

    chat.addEventListener('click', () => {
      safeAnimate(chat, [
        { transform: 'scale(1) rotate(0deg)' },
        { transform: 'scale(0.82) rotate(-10deg)' },
        { transform: 'scale(1.1) rotate(7deg)' },
        { transform: 'scale(1) rotate(0deg)' }
      ], { duration: 560, easing: EASE_OUT_BACK });
    });

    function pulse() {
      const ring = document.createElement('span');
      ring.className = 'vw-chat-ring';
      chat.appendChild(ring);
      const anim = safeAnimate(ring, [
        { transform: 'scale(1)', opacity: 0.65 },
        { transform: 'scale(1.85)', opacity: 0 }
      ], { duration: 1800, easing: 'ease-out' });
      const cleanup = () => ring.remove();
      if (anim) anim.finished.then(cleanup).catch(cleanup);
      else cleanup();
    }

    pulse();
    setInterval(pulse, 6800);
  }

  /* ========================================================================
     14) FOOTER & NAV LINKS underline
     ======================================================================== */
  function initAnimatedLinks() {
    document.querySelectorAll('.footer-links a').forEach((a) => {
      attachAnimatedUnderline(a, '#FF5A00');
    });
  }

  /* ========================================================================
     15) SMOOTH SCROLL untuk anchor internal
     ======================================================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      });
    });
  }

  /* ========================================================================
     16) LOGO hover kecil
     ======================================================================== */
  function initLogoHover() {
    const logo = document.querySelector('.r-mark');
    if (!logo) return;
    logo.style.transition = `transform ${DUR.fast}ms ${EASE_OUT_BACK}`;
    logo.addEventListener('mouseenter', () => {
      logo.style.transform = 'scale(1.12) rotate(-3deg)';
    });
    logo.addEventListener('mouseleave', () => {
      logo.style.transform = 'scale(1) rotate(0deg)';
    });
  }

  /* ========================================================================
     INIT SEMUA
     ======================================================================== */
  function init() {
    injectRuntimeStyles();

    initPageVeil(() => {
      initPreloaderIntro();
    });

    initStickyNav();
    initMobileMenu();
    initClickRipple();
    initBadgeHover();
    initScrollReveal();
    initCounters();
    initAnimatedLinks();
    initSmoothScroll();
    initLogoHover();

    if (!reduceMotion) {
      initMagneticButtons();
      initTiltCards();
      initCursorGlow();
      initHeroParallax();
      initClusterHover();
      initChatButtonIdle();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

