/* ==========================================================================
   PORTFOLIO SITE SCRIPT
   Vanilla JS only. Handles: mobile nav, smooth scroll, active nav
   highlighting, project category tabs, and subtle scroll-reveal.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------
     Mobile navigation toggle
     ------------------------------------------------------------------ */
  const hamburger = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close mobile menu after a link is chosen
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  /* ------------------------------------------------------------------
     Smooth scroll for in-page links
     (CSS `scroll-behavior: smooth` already handles most of this;
     this loop keeps behavior consistent across older browsers.)
     ------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

  /* ------------------------------------------------------------------
     Active navigation highlighting on scroll
     ------------------------------------------------------------------ */
  const sections = document.querySelectorAll('main section[id], footer[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    let currentId = sections[0]?.id;
    const scrollPos = window.scrollY + 120; // offset for sticky header

    sections.forEach(section => {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });

    navItems.forEach(item => {
      const isActive = item.getAttribute('href') === `#${currentId}`;
      item.classList.toggle('is-active', isActive);
      if (isActive) {
        item.setAttribute('aria-current', 'page');
      } else {
        item.removeAttribute('aria-current');
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  /* ------------------------------------------------------------------
     Project category tabs
     ------------------------------------------------------------------ */
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');

      tabs.forEach(t => {
        const isActive = t === tab;
        t.classList.toggle('is-active', isActive);
        t.setAttribute('aria-selected', String(isActive));
      });

      panels.forEach(panel => {
        const isMatch = panel.getAttribute('data-panel') === target;
        panel.classList.toggle('is-active', isMatch);
        if (isMatch) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', '');
        }
      });
    });

    // Basic keyboard support: left/right arrow moves between tabs
    tab.addEventListener('keydown', (e) => {
      const tabArray = Array.from(tabs);
      const index = tabArray.indexOf(tab);
      let newIndex = null;

      if (e.key === 'ArrowRight') newIndex = (index + 1) % tabArray.length;
      if (e.key === 'ArrowLeft') newIndex = (index - 1 + tabArray.length) % tabArray.length;

      if (newIndex !== null) {
        e.preventDefault();
        tabArray[newIndex].focus();
        tabArray[newIndex].click();
      }
    });
  });

  /* ------------------------------------------------------------------
     Subtle scroll-reveal using IntersectionObserver
     ------------------------------------------------------------------ */
  const revealTargets = document.querySelectorAll('.card, .about__grid, .hero__inner');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(el => observer.observe(el));
  } else {
    // No IntersectionObserver support, or user prefers reduced motion:
    // show everything immediately.
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

});
