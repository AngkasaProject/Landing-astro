// public/scripts/app.js — REFINED & OPTIMIZED

document.addEventListener('DOMContentLoaded', () => {
  // === SELECTORS ===
  const card = document.getElementById('floating-info-card');
  const closeButton = document.getElementById('close-floating-card');
  const parallaxImage = document.getElementById('parallax-image');
  const carousel = document.getElementById('gallery-carousel');
  const headerLogo = document.getElementById('header-logo');
  const hero = document.getElementById('hero-section');
  const waBtn = document.getElementById('wa-button');
  const preloader = document.getElementById('preloader');

  // ==========================================
  // 1. UI COMPONENT: FLOATING CARD
  // ==========================================
  if (card && closeButton) {
    closeButton.addEventListener('click', () => {
      card.removeAttribute('data-aos');
      card.classList.remove('aos-animate');
      card.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
      setTimeout(() => card.classList.add('hidden'), 300);
    });
  }

  // ==========================================
  // 2. CORE SCROLL SYSTEM (MERGED FOR PERFORMANCE)
  // ==========================================
  const handleGlobalScroll = () => {
    const scrollPos = window.scrollY;

    // A. Parallax Logic
    if (parallaxImage) {
      parallaxImage.style.transform = `translateY(${scrollPos * 0.4}px)`;
    }

    // B. Header Logo Invert Logic
    if (headerLogo) {
      if (scrollPos > 50) {
        headerLogo.classList.remove('logo-inverted');
      } else {
        headerLogo.classList.add('logo-inverted');
      }
    }

    // C. WhatsApp Button Visibility
    if (hero && waBtn) {
      const heroHeight = hero.offsetHeight;
      if (scrollPos > heroHeight - 150) {
        waBtn.classList.add('show');
      } else {
        waBtn.classList.remove('show');
      }
    }
  };

  // Run scroll handle once on load & attach to scroll event
  window.addEventListener('scroll', handleGlobalScroll, { passive: true });
  handleGlobalScroll();

  // ==========================================
  // 3. CAROUSEL AUTO-SLIDE LOGIC
  // ==========================================
  const setupCarousel = () => {
    if (!carousel) return;

    const REAL_SLIDES = 3;
    const SLIDE_TIME = 5000;
    let currentIndex = 0;

    const getSlideWidth = () => carousel.offsetWidth;

    const autoScroll = () => {
      const width = getSlideWidth();
      currentIndex++;

      if (currentIndex >= REAL_SLIDES) {
        carousel.scrollTo({ left: currentIndex * width, behavior: 'smooth' });

        // Reset to first slide without animation after smooth transition
        setTimeout(() => {
          carousel.style.scrollBehavior = 'auto';
          carousel.scrollLeft = 0;
          currentIndex = 0;
          carousel.style.scrollBehavior = 'smooth';
        }, 500);
      } else {
        carousel.scrollTo({ left: currentIndex * width, behavior: 'smooth' });
      }
    };

    // Manual scroll sync
    carousel.addEventListener(
      'scroll',
      () => {
        const width = getSlideWidth();
        if (carousel.scrollLeft >= REAL_SLIDES * width) {
          carousel.style.scrollBehavior = 'auto';
          carousel.scrollLeft = 0;
          currentIndex = 0;
          carousel.style.scrollBehavior = 'smooth';
        }
      },
      { passive: true },
    );

    // Handle Window Resize
    window.addEventListener('resize', () => {
      carousel.style.scrollBehavior = 'auto';
      carousel.scrollLeft = currentIndex * getSlideWidth();
      carousel.style.scrollBehavior = 'smooth';
    });

    setInterval(autoScroll, SLIDE_TIME);
  };

  setupCarousel();

  // ==========================================
  // 4. PRELOADER HIDER
  // ==========================================
  const hidePreloader = () => {
    if (preloader) {
      preloader.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => preloader.remove(), 1000);
    }
  };

  // Hide preloader when everything is ready
  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);
  }
});
