/* ================================================================
   Express Demo Site — script.js
   - Video fallback (graceful placeholder when .mp4 missing)
   - Lightbox (click to zoom any .lightbox-trigger image)
   - Mobile nav toggle
   - Active nav link highlighting via IntersectionObserver
   ================================================================ */

'use strict';

/* ──────────────────────────────────────────
   Video: try to load; show fallback if missing
────────────────────────────────────────── */
function initVideos() {
  document.querySelectorAll('.video-container').forEach(container => {
    const src   = container.dataset.video  || '';
    const label = container.dataset.label  || 'Demo video';

    /* Build the actual <video> element */
    const video = document.createElement('video');
    video.controls = true;
    video.preload  = 'metadata';
    video.muted    = container.dataset.muted === 'true';
    video.setAttribute('aria-label', label);
    video.style.width  = '100%';
    video.style.height = '100%';
    video.style.display = 'none';           /* hidden until we know it loads */

    const source = document.createElement('source');
    source.src  = src;
    source.type = 'video/mp4';
    video.appendChild(source);

    /* Show placeholder immediately; swap to video on success */
    container.appendChild(video);
    showFallback(container, src);

    video.addEventListener('loadedmetadata', () => {
      const fb = container.querySelector('.video-fallback');
      if (fb) fb.remove();
      video.style.display = '';
    });

    /* Treat any load error as "file not present" */
    video.addEventListener('error', () => {
      video.style.display = 'none';
      if (!container.querySelector('.video-fallback')) {
        showFallback(container, src);
      }
    });
    source.addEventListener('error', () => {
      video.style.display = 'none';
      if (!container.querySelector('.video-fallback')) {
        showFallback(container, src);
      }
    });

    /* Kick off the load attempt */
    video.load();
  });
}

function showFallback(container, src) {
  /* Remove existing fallback if present */
  const existing = container.querySelector('.video-fallback');
  if (existing) return;

  const fb = document.createElement('div');
  fb.className = 'video-fallback';
  fb.setAttribute('aria-label', 'Video placeholder — file not yet available');
  fb.innerHTML = `
    <div class="video-play-icon" aria-hidden="true">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5,3 19,12 5,21"/>
      </svg>
    </div>
    <p class="video-fallback-title">Video coming soon</p>
    <p class="video-fallback-hint">
      Place <code>${escHtml(src)}</code><br>in the repository to enable playback.
    </p>
  `;
  container.appendChild(fb);
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ──────────────────────────────────────────
   Lightbox
────────────────────────────────────────── */
function initLightbox() {
  const overlay  = document.getElementById('lightbox');
  const img      = overlay.querySelector('.lightbox-img');
  const caption  = overlay.querySelector('.lightbox-caption');
  const closeBtn = overlay.querySelector('.lightbox-close');

  let previouslyFocused = null;

  function open(trigger) {
    previouslyFocused = document.activeElement;

    const src = trigger.src || trigger.getAttribute('src') || '';
    const alt = trigger.alt || '';

    img.src         = src;
    img.alt         = alt;
    caption.textContent = trigger.closest('figure')?.querySelector('figcaption')?.textContent ?? alt;

    overlay.hidden = false;
    /* Trigger CSS transition */
    requestAnimationFrame(() => overlay.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    overlay.focus();
  }

  function close() {
    overlay.classList.remove('is-open');
    overlay.addEventListener('transitionend', () => {
      overlay.hidden = true;
      img.src = '';
      document.body.style.overflow = '';
      if (previouslyFocused) previouslyFocused.focus();
    }, { once: true });
  }

  /* Triggers */
  document.querySelectorAll('.lightbox-trigger').forEach(trigger => {
    trigger.style.cursor = 'zoom-in';
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('tabindex', '0');
    trigger.setAttribute('aria-haspopup', 'dialog');

    trigger.addEventListener('click', () => open(trigger));
    trigger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(trigger); }
    });
  });

  closeBtn.addEventListener('click', close);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !overlay.hidden) close();
  });
}

/* ──────────────────────────────────────────
   Mobile nav toggle
────────────────────────────────────────── */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.querySelector('.nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* Close when a link is tapped */
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ──────────────────────────────────────────
   Active nav link via IntersectionObserver
────────────────────────────────────────── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  if (!sections.length || !links.length) return;

  const map = {};
  links.forEach(l => {
    const href = l.getAttribute('href');
    if (href && href.startsWith('#')) map[href.slice(1)] = l;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = map[entry.target.id];
        if (active) active.classList.add('active');
      }
    });
  }, {
    rootMargin: `-${60 + 20}px 0px -55% 0px`,
    threshold: 0,
  });

  sections.forEach(s => observer.observe(s));
}

/* ──────────────────────────────────────────
   Install tab switcher
────────────────────────────────────────── */
function initTabs() {
  document.querySelectorAll('[role="tablist"]').forEach(tablist => {
    const tabs   = tablist.querySelectorAll('[role="tab"]');
    const panels = document.querySelectorAll('[role="tabpanel"]');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('tab-btn--active');
          t.setAttribute('aria-selected', 'false');
        });
        panels.forEach(p => p.classList.add('tab-panel--hidden'));

        tab.classList.add('tab-btn--active');
        tab.setAttribute('aria-selected', 'true');
        const panel = document.getElementById(tab.getAttribute('aria-controls'));
        if (panel) panel.classList.remove('tab-panel--hidden');
      });
    });
  });
}

/* ──────────────────────────────────────────
   Copy-to-clipboard buttons
────────────────────────────────────────── */
function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy || '';
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        /* Fallback for non-HTTPS / old browsers */
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      const label = btn.querySelector('.copy-label');
      btn.classList.add('copied');
      if (label) label.textContent = 'Copied!';
      setTimeout(() => {
        btn.classList.remove('copied');
        if (label) label.textContent = 'Copy';
      }, 2000);
    });
  });
}

/* ──────────────────────────────────────────
   Boot
────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initVideos();
  initLightbox();
  initMobileNav();
  initActiveNav();
  initCopyButtons();
  initTabs();
});
