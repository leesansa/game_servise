(() => {
  const featured = document.querySelector(".featured");
  if (!featured) return;

  const track = featured.querySelector(".featured-track");
  const slides = [...track.querySelectorAll(".featured-slide:not([data-clone])")];
  const buttons = [...featured.querySelectorAll(".slide-button")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let currentSlide = 0;
  let trackPosition = 0;
  let autoplayTimer;

  function stopAutoplay() {
    window.clearTimeout(autoplayTimer);
  }

  function scheduleAutoplay() {
    stopAutoplay();
    // 마우스 또는 키보드로 조작하는 동안에는 현재 이미지를 유지합니다.
    if (
      slides.length < 2 ||
      document.hidden ||
      reducedMotion.matches ||
      featured.matches(":hover, :focus-within")
    ) {
      return;
    }

    autoplayTimer = window.setTimeout(() => {
      goToSlide((currentSlide + 1) % slides.length, true);
    }, 4000);
  }

  function resetLoopPosition() {
    // 마지막 복제 이미지에서 원본으로 이동할 때는 애니메이션을 끕니다.
    track.classList.add("is-resetting");
    track.style.transform = "translateX(0)";
    void track.offsetWidth;
    track.classList.remove("is-resetting");
    trackPosition = 0;
  }

  function goToSlide(index, automatic = false) {
    if (index !== currentSlide) {
      const wrapping = automatic && currentSlide === slides.length - 1 && index === 0;
      trackPosition = wrapping ? slides.length : index;
      currentSlide = index;
      track.style.transform = `translateX(-${trackPosition * 100}%)`;
    }

    buttons.forEach((button, buttonIndex) => {
      button.setAttribute("aria-current", String(buttonIndex === currentSlide));
    });
    slides.forEach((slide, slideIndex) => {
      slide.setAttribute("aria-hidden", String(slideIndex !== currentSlide));
    });
    scheduleAutoplay();
  }

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => goToSlide(index));
  });

  track.addEventListener("transitionend", (event) => {
    if (
      event.target === track &&
      event.propertyName === "transform" &&
      trackPosition === slides.length
    ) {
      resetLoopPosition();
    }
  });

  featured.addEventListener("mouseenter", stopAutoplay);
  featured.addEventListener("mouseleave", scheduleAutoplay);
  featured.addEventListener("focusin", stopAutoplay);
  featured.addEventListener("focusout", () => {
    window.requestAnimationFrame(scheduleAutoplay);
  });
  document.addEventListener("visibilitychange", scheduleAutoplay);
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches && trackPosition === slides.length) {
      resetLoopPosition();
    }
    scheduleAutoplay();
  });

  goToSlide(0);
})();
