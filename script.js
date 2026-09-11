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

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  /* ------------------------------------------------------------------
     Mobile navigation toggle
     ------------------------------------------------------------------ */
  const hamburger = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {

    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');

      hamburger.setAttribute('aria-expanded', String(isOpen));
      hamburger.setAttribute(
        'aria-label',
        isOpen ? 'Close menu' : 'Open menu'
      );
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

     CSS `scroll-behavior: smooth` already handles most of this;
     this loop keeps behavior consistent across older browsers.
     ------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener('click', (e) => {

      const targetId = link.getAttribute('href');

      // Ignore empty "#" links
      if (!targetId || targetId === '#') {
        return;
      }

      const target = document.querySelector(targetId);

      if (target) {

        e.preventDefault();

        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Allow keyboard users to focus the destination
        target.setAttribute('tabindex', '-1');

        target.focus({
          preventScroll: true
        });

      }

    });

  });


  /* ------------------------------------------------------------------
     Active navigation highlighting on scroll
     ------------------------------------------------------------------ */
  const sections = document.querySelectorAll(
    'main section[id], footer[id]'
  );

  const navItems = document.querySelectorAll('.nav-link');


  const highlightNav = () => {

    if (!sections.length) {
      return;
    }

    let currentId = sections[0]?.id;

    // Offset accounts for the sticky header
    const scrollPos = window.scrollY + 120;


    sections.forEach(section => {

      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }

    });


    navItems.forEach(item => {

      const isActive =
        item.getAttribute('href') === `#${currentId}`;

      item.classList.toggle('is-active', isActive);


      if (isActive) {
        item.setAttribute('aria-current', 'page');
      } else {
        item.removeAttribute('aria-current');
      }

    });

  };


  window.addEventListener(
    'scroll',
    highlightNav,
    { passive: true }
  );

  highlightNav();


  /* ------------------------------------------------------------------
     Project category tabs

     Categories:
     1. Data Science
     2. SOC Analysis
     3. Software Development
     4. Dashboards

     Each tab should have a matching `data-tab` value, while each
     project panel should have the matching `data-panel` value.

     Example:

     <button class="tab"
             data-tab="data-science"
             aria-selected="true">
       Data Science
     </button>

     <div class="tab-panel"
          data-panel="data-science">
       ...
     </div>
     ------------------------------------------------------------------ */

  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');


  if (tabs.length && panels.length) {

    /* --------------------------------------------------------------
       Switch between project categories
       -------------------------------------------------------------- */
    const activateTab = (selectedTab, moveFocus = false) => {

      const target = selectedTab.getAttribute('data-tab');

      if (!target) {
        return;
      }


      // Update tab states
      tabs.forEach(tab => {

        const isActive = tab === selectedTab;

        tab.classList.toggle('is-active', isActive);

        tab.setAttribute(
          'aria-selected',
          String(isActive)
        );

      });


      // Update project panels
      panels.forEach(panel => {

        const isMatch =
          panel.getAttribute('data-panel') === target;

        panel.classList.toggle('is-active', isMatch);


        if (isMatch) {

          panel.removeAttribute('hidden');

          // Restart the soft transition
          panel.classList.remove('tab-panel-enter');

          // Force browser reflow so animation can restart
          void panel.offsetWidth;

          panel.classList.add('tab-panel-enter');

        } else {

          panel.setAttribute('hidden', '');

          panel.classList.remove('tab-panel-enter');

        }

      });


      // Optional focus movement for keyboard navigation
      if (moveFocus) {
        selectedTab.focus();
      }

    };


    /* --------------------------------------------------------------
       Tab click
       -------------------------------------------------------------- */
    tabs.forEach(tab => {

      tab.addEventListener('click', () => {
        activateTab(tab);
      });


      /* ------------------------------------------------------------
         Keyboard support

         ArrowRight → next tab
         ArrowLeft  → previous tab
         Home       → first tab
         End        → last tab
         ------------------------------------------------------------ */
      tab.addEventListener('keydown', (e) => {

        const tabArray = Array.from(tabs);
        const index = tabArray.indexOf(tab);

        let newIndex = null;


        if (e.key === 'ArrowRight') {

          newIndex =
            (index + 1) % tabArray.length;

        }


        if (e.key === 'ArrowLeft') {

          newIndex =
            (index - 1 + tabArray.length) %
            tabArray.length;

        }


        if (e.key === 'Home') {
          newIndex = 0;
        }


        if (e.key === 'End') {
          newIndex = tabArray.length - 1;
        }


        if (newIndex !== null) {

          e.preventDefault();

          activateTab(
            tabArray[newIndex],
            true
          );

        }

      });

    });


    /* --------------------------------------------------------------
       Make sure the initially active tab displays the correct panel
       -------------------------------------------------------------- */
    const initiallyActiveTab =
      document.querySelector('.tab.is-active') ||
      document.querySelector('.tab[aria-selected="true"]') ||
      tabs[0];


    if (initiallyActiveTab) {
      activateTab(initiallyActiveTab);
    }

  }


  /* ------------------------------------------------------------------
     Subtle scroll-reveal using IntersectionObserver
     ------------------------------------------------------------------ */
  const revealTargets = document.querySelectorAll(
    '.card, .about__grid, .hero__inner'
  );

  const prefersReducedMotion =
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;


  if (
    'IntersectionObserver' in window &&
    !prefersReducedMotion
  ) {

    const observer = new IntersectionObserver(
      (entries) => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add('is-visible');

            observer.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.15
      }
    );


    revealTargets.forEach(el => {
      observer.observe(el);
    });


  } else {

    // No IntersectionObserver support, or user prefers
    // reduced motion: show everything immediately.

    revealTargets.forEach(el => {
      el.classList.add('is-visible');
    });

  }

});
