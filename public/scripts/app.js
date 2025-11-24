// public/scripts/app.js (FINAL & STABIL)

document.addEventListener("DOMContentLoaded", () => {
  // Hanya ambil elemen yang dikendalikan oleh app.js
  const parallaxImage = document.getElementById("parallax-image");

  // -----------------------------------
  // --- 1. PARALLAX EFFECT ---
  // -----------------------------------
  function handleParallaxScroll() {
    const scrollPos = window.scrollY;

    if (parallaxImage) {
      parallaxImage.style.transform = `translateY(${scrollPos * 0.4}px)`;
    }
  }

  // -----------------------------------
  // --- 2. CAROUSEL AUTO-SLIDE & INFINITE LOOP LOGIC (DIPERBAIKI) ---
  // -----------------------------------
  function setupCarousel() {
    const carousel = document.getElementById("gallery-carousel");
    const carouselItems = document.querySelectorAll(
      "#gallery-carousel .carousel-item"
    );
    const scrollDuration = 5000; // 5 detik per slide
    const numRealSlides = 3;

    if (!carousel || carouselItems.length <= 1) return;

    let currentIndex = 0;

    // FUNGSI KRITIS: Selalu mendapatkan lebar layar
    const getSlideWidth = () => window.innerWidth;

    function autoScrollCarousel() {
      // Ambil nilai lebar yang terbaru di setiap interval
      const slideWidth = getSlideWidth();

      currentIndex++;
      let targetScrollPos = currentIndex * slideWidth;
      const resetPoint = numRealSlides * slideWidth;

      // Logika Auto-Slide & Infinite Loop
      if (currentIndex >= numRealSlides) {
        // 1. Scroll ke slide duplikat
        carousel.scrollTo({
          left: targetScrollPos,
          behavior: "smooth",
        });

        // 2. Reset posisi scroll secara instan setelah transisi selesai
        setTimeout(() => {
          carousel.style.scrollBehavior = "auto";
          carousel.scrollLeft = 0; // Lompat ke slide 1 asli
          requestAnimationFrame(() => {
            carousel.style.scrollBehavior = "smooth";
          });
        }, 500);

        currentIndex = 0;
        return;
      }

      // Scroll ke posisi slide berikutnya
      carousel.scrollTo({
        left: targetScrollPos,
        behavior: "smooth",
      });
    }

    // Logika untuk menangani reset saat scroll manual
    carousel.addEventListener("scroll", () => {
      const scrollPos = carousel.scrollLeft;
      const dynamicResetPoint = numRealSlides * getSlideWidth();

      if (scrollPos >= dynamicResetPoint) {
        carousel.style.scrollBehavior = "auto";
        carousel.scrollLeft = scrollPos - dynamicResetPoint;
        currentIndex = 0;
        requestAnimationFrame(() => {
          carousel.style.scrollBehavior = "smooth";
        });
      }
    });

    // Jalankan auto-scroll
    setInterval(autoScrollCarousel, scrollDuration);

    // Handle resize
    window.addEventListener("resize", () => {
      carousel.style.scrollBehavior = "auto";
      carousel.scrollLeft = currentIndex * getSlideWidth();
      requestAnimationFrame(() => {
        carousel.style.scrollBehavior = "smooth";
      });
    });
  }

  // -----------------------------------
  // --- 3. UNDER CONSTRUCTION NOTIFICATION (DENGAN sessionStorage) ---
  // -----------------------------------
  const constructionModal = document.getElementById("construction-modal");
  const constructionCloseBtn = document.getElementById(
    "construction-close-btn"
  );
  const constructionCloseBtnLg = document.getElementById(
    "construction-close-btn-lg"
  );

  // KEY UNTUK SESSION STORAGE
  const SESSION_KEY = "constructionModalShown";

  const closeConstructionModal = () => {
    if (constructionModal) {
      constructionModal.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    }
  };

  if (constructionCloseBtn) {
    constructionCloseBtn.addEventListener("click", closeConstructionModal);
  }
  if (constructionCloseBtnLg) {
    constructionCloseBtnLg.addEventListener("click", closeConstructionModal);
  }

  // --- LOGIKA DELAY UTAMA & PEMBATASAN HALAMAN ---
  if (constructionModal) {
    // 1. Cek Halaman & Session Storage
    const currentPath = window.location.pathname;
    const isHomepage = currentPath === "/" || currentPath === "/index.html";

    // HENTIKAN LOGIKA MODAL jika bukan homepage ATAU sudah ditampilkan
    if (!isHomepage || sessionStorage.getItem(SESSION_KEY)) {
      // Tidak ada pernyataan 'return' di sini yang mengganggu setupCarousel()
      return;
    }

    // 2. Konfigurasi Waktu
    const openDelayInMilliseconds = 5000; // 5 detik
    const autoCloseDuration = 3000; // 3 detik (DIKOREKSI)

    // 3. Logika Buka (setelah 5 detik)
    setTimeout(() => {
      // Tandai session storage sebelum ditampilkan
      sessionStorage.setItem(SESSION_KEY, "true");

      // Tampilkan modal
      constructionModal.classList.remove("hidden");
      document.body.classList.add("overflow-hidden");

      // 4. Logika Tutup Otomatis (setelah 3 detik)
      setTimeout(() => {
        closeConstructionModal();
      }, autoCloseDuration);
    }, openDelayInMilliseconds);
  }

  // --- INITIALIZATION (Selalu dipanggil) ---
  window.addEventListener("scroll", handleParallaxScroll);
  handleParallaxScroll();
  setupCarousel(); // Pastikan ini SELALU dipanggil untuk menginisialisasi karosel
});
