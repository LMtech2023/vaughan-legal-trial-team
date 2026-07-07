(function () {
  'use strict';

  var NAV_BREAKPOINT = 1200;
  var menuToggle = document.getElementById('menu-toggle');
  var navPanel = document.getElementById('nav-panel');
  var navOverlay = document.getElementById('nav-overlay');
  var chromeElements = document.querySelectorAll('[data-site-chrome]');

  function isDesktopNav() {
    return window.innerWidth > NAV_BREAKPOINT;
  }

  function setMenuOpen(open) {
    if (!menuToggle || !navPanel || !navOverlay) return;

    menuToggle.classList.toggle('header__menu-toggle--active', open);
    navPanel.classList.toggle('header__nav--open', open);
    navOverlay.classList.toggle('header__overlay--visible', open);
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navPanel.setAttribute('aria-hidden', open ? 'false' : 'true');
    navOverlay.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.classList.toggle('menu-open', open);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function openMenu() {
    if (!isDesktopNav()) {
      setMenuOpen(true);
    }
  }

  function toggleMenu() {
    if (isDesktopNav()) return;
    setMenuOpen(!menuToggle.classList.contains('header__menu-toggle--active'));
  }

  function updateSiteChromeHeight() {
    var total = 0;
    chromeElements.forEach(function (el) {
      total += el.getBoundingClientRect().height;
    });
    document.documentElement.style.setProperty('--site-chrome-height', total + 'px');
  }

  function initChromeObserver() {
    if (!chromeElements.length) return;

    updateSiteChromeHeight();

    if (typeof ResizeObserver !== 'undefined') {
      var observer = new ResizeObserver(updateSiteChromeHeight);
      chromeElements.forEach(function (el) {
        observer.observe(el);
      });
    }

    window.addEventListener('resize', updateSiteChromeHeight);
    window.addEventListener('load', updateSiteChromeHeight);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateSiteChromeHeight);
    }
  }

  function initMobileMenu() {
    if (!menuToggle || !navPanel || !navOverlay) return;

    menuToggle.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', closeMenu);

    navPanel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });

    window.addEventListener('resize', function () {
      if (isDesktopNav()) {
        closeMenu();
      }
    });
  }

  initChromeObserver();
  initMobileMenu();
})();
