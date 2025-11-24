// public/scripts/app.js (GLOBAL LAYOUT & SCROLL LOGIC - REVISI FINAL)

document.addEventListener("DOMContentLoaded", () => {
  // Hanya ambil elemen yang dikendalikan oleh app.js
  const parallaxImage = document.getElementById("parallax-image");

  // -----------------------------------
  // --- 1. PARALLAX EFFECT ---
  // Hapus semua logika Header Scroll yang berkonflik.
  // -----------------------------------
  function handleParallaxScroll() {
    const scrollPos = window.scrollY;

    // A. Logika Parallax (DIJAGA)
    if (parallaxImage) {
      parallaxImage.style.transform = `translateY(${scrollPos * 0.4}px)`;
    }

    // B. Logika Header Scroll di sini SUDAH DIHAPUS.
    // Kontrol Header diserahkan sepenuhnya ke header-logic.js
  }

  // --- 2. CAROUSEL AUTO-SLIDE & INFINITE LOOP LOGIC ---
  function setupCarousel() {
    const carousel = document.getElementById("gallery-carousel");
    const carouselItems = document.querySelectorAll(
      "#gallery-carousel .carousel-item"
    );
    const scrollDuration = 5000; // 5 detik per slide
    const numRealSlides = 3;

    if (!carousel || carouselItems.length <= 1) return;

    let currentIndex = 0;

    // Dapatkan lebar satu slide (PENTING untuk perhitungan posisi)
    const slideWidth = carouselItems[0]?.clientWidth || window.innerWidth;
    const resetPoint = numRealSlides * slideWidth; // Posisi slide duplikat ke-1

    function autoScrollCarousel() {
      currentIndex++;
      let targetScrollPos = currentIndex * slideWidth;

      // Logika Auto-Slide & Infinite Loop
      if (targetScrollPos >= resetPoint) {
        // Scroll ke slide duplikat ke-1 (yang sama dengan slide 1)
        carousel.scrollTo({
          left: targetScrollPos,
          behavior: "smooth",
        });

        // Reset posisi scroll secara instan setelah transisi selesai
        setTimeout(() => {
          carousel.style.scrollBehavior = "auto";
          carousel.scrollLeft = 0; // Lompat ke slide 1 asli
          carousel.style.scrollBehavior = "smooth";
        }, 500); // Tunggu sebentar (500ms) setelah scroll selesai

        currentIndex = 0; // Reset index untuk auto-scroll berikutnya
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
      if (scrollPos >= resetPoint) {
        // Manual scroll reset: Langsung ke set asli
        carousel.style.scrollBehavior = "auto";
        carousel.scrollLeft = scrollPos - resetPoint;
        requestAnimationFrame(() => {
          carousel.style.scrollBehavior = "smooth";
        });
      }
    });

    // Jalankan auto-scroll
    setInterval(autoScrollCarousel, scrollDuration);
  }

  // --- INITIALIZATION ---
  window.addEventListener("scroll", handleParallaxScroll); // Menggunakan fungsi Parallax saja
  handleParallaxScroll(); // Initial check for Parallax
  setupCarousel(); // Call Carousel Logic
});
