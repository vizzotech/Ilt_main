/* =========================================================
   AXIS-C — shared interactivity
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Mobile menu ---- */
  const toggle = document.querySelector('.menu-toggle');
  const links  = document.querySelector('.top-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.style.display === 'flex';
      links.style.display = open ? 'none' : 'flex';
      links.style.flexDirection = 'column';
      links.style.position = 'absolute';
      links.style.top = '64px';
      links.style.left = '0';
      links.style.right = '0';
      links.style.background = '#F7F3EA';
      links.style.padding = '18px 24px';
      links.style.borderBottom = '1px solid #DCD3C0';
      toggle.setAttribute('aria-expanded', String(!open));
    });
  }

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---- Chapter nav: active state + progress ---- */
  const chapters = document.querySelectorAll('.chapter');
  const navLinks = document.querySelectorAll('.chapter-nav a');
  const progressFill = document.querySelector('.progress-fill');

  if (chapters.length && navLinks.length) {
    const setActive = (id) => {
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    };

    const chapterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-30% 0px -55% 0px', threshold: 0 });

    chapters.forEach(ch => chapterObserver.observe(ch));

    if (progressFill) {
      window.addEventListener('scroll', () => {
        const doc = document.documentElement;
        const pct = (doc.scrollTop) / (doc.scrollHeight - doc.clientHeight) * 100;
        progressFill.style.width = Math.min(100, Math.max(4, pct)) + '%';
      }, { passive: true });
    }
  }

  /* ---- Implant correction animation ---- */
  const stage = document.querySelector('.implant-stage');
  if (stage) {
    const svg = stage.querySelector('.anim-canvas svg');
    const btnBefore = stage.querySelector('[data-state="before"]');
    const btnAfter  = stage.querySelector('[data-state="after"]');
    const btnPlay   = stage.querySelector('[data-state="play"]');
    const heightVal = stage.querySelector('[data-readout="height"]');
    const angleVal  = stage.querySelector('[data-readout="angle"]');
    const spaceVal  = stage.querySelector('[data-readout="space"]');

    const setState = (state) => {
      svg.classList.remove('state-before', 'state-after', 'state-playing');
      svg.classList.add('state-' + state);
      [btnBefore, btnAfter, btnPlay].forEach(b => b && b.classList.remove('active'));

      if (state === 'before') {
        btnBefore.classList.add('active');
        if (heightVal) heightVal.textContent = '4.1 mm';
        if (angleVal)  angleVal.textContent  = '2.8°';
        if (spaceVal)  spaceVal.textContent  = 'Narrowed';
      }
      if (state === 'after') {
        btnAfter.classList.add('active');
        if (heightVal) heightVal.textContent = '6.5 mm';
        if (angleVal)  angleVal.textContent  = '6.4°';
        if (spaceVal)  spaceVal.textContent  = 'Restored';
      }
      if (state === 'playing') {
        btnPlay.classList.add('active');
      }
    };

    btnBefore && btnBefore.addEventListener('click', () => setState('before'));
    btnAfter  && btnAfter.addEventListener('click', () => setState('after'));
    btnPlay   && btnPlay.addEventListener('click', () => {
      setState('playing');
      setState('before');
      window.setTimeout(() => setState('after'), 250);
    });

    // Auto-trigger once the stage scrolls into view
    const stageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setState('before');
          window.setTimeout(() => setState('after'), 900);
          stageObserver.disconnect();
        }
      });
    }, { threshold: 0.4 });
    stageObserver.observe(stage);
  }

  /* ---- Sizing matrix interactions ---- */
  const heightBtns = document.querySelectorAll('.height-btn');
  heightBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const container = this.closest('.height-options');
      if (container) {
        container.querySelectorAll('.height-btn').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
      }
    });
  });

  /* ---- Contact form enhancement ---- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    contactForm.addEventListener('submit', () => {
      if (submitBtn) submitBtn.disabled = true;
    });
  }

});
