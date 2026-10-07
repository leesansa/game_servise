(() => {
  const strip = document.querySelector(".video-strip");
  const buttons = [...document.querySelectorAll(".video-pagination-button")];

  if (!strip || buttons.length === 0) return;

  const slides = [...strip.querySelectorAll(".video-card")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const cloneCount = 2;
  let selectedIndex = 0;
  let position = cloneCount;
  let isAnimating = false;
  let pendingIndex = null;
  let requestedPlaybackIndex = null;

  slides.forEach((slide, index) => {
    slide.dataset.videoIndex = index;
  });

  strip.prepend(...slides.slice(-cloneCount).map((slide) => slide.cloneNode(true)));
  strip.append(...slides.slice(0, cloneCount).map((slide) => slide.cloneNode(true)));
  const cards = [...strip.querySelectorAll(".video-card")];

  function render() {
    const step = cards[0].offsetWidth + parseFloat(getComputedStyle(strip).columnGap);
    strip.style.transform = `translateX(${(1 - position) * step}px)`;

    cards.forEach((card, index) => {
      card.classList.toggle("video-card-featured", index === position);
      card.classList.toggle("video-card-previous", index === position - 1);
      card.classList.toggle("video-card-next", index === position + 1);
      card.setAttribute("aria-hidden", String(index !== position));
      card.querySelector(".video-trigger").tabIndex = index === position ? 0 : -1;
    });

    buttons.forEach((button, index) => {
      const isSelected = index === selectedIndex;
      button.setAttribute("aria-pressed", String(isSelected));
      button.closest(".video-pagination-item").classList.toggle("is-selected", isSelected);
    });
  }

  function resetPosition() {
    position = selectedIndex + cloneCount;
    strip.classList.add("is-resetting");
    render();
    void strip.offsetWidth;
    strip.classList.remove("is-resetting");
  }

  function finishTransition() {
    if (!isAnimating) return;

    isAnimating = false;
    if (position !== selectedIndex + cloneCount) resetPosition();

    const nextIndex = pendingIndex;
    pendingIndex = null;
    if (nextIndex !== null) {
      selectVideo(nextIndex, requestedPlaybackIndex === nextIndex);
    } else if (requestedPlaybackIndex === selectedIndex) {
      playVideo();
    }
  }

  function stopVideos() {
    cards.forEach((card) => {
      card.querySelector(".video-player")?.remove();
      card.classList.remove("is-playing");
    });
  }

  function playVideo() {
    requestedPlaybackIndex = null;
    const card = cards[position];
    if (card.querySelector(".video-player")) return;

    stopVideos();
    const player = document.createElement("iframe");
    player.className = "video-player";
    player.title = card.querySelector(".video-trigger").getAttribute("aria-label");
    player.src = `https://www.youtube.com/embed/${card.dataset.videoId}?autoplay=1&playsinline=1&rel=0`;
    player.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    player.allowFullscreen = true;
    player.referrerPolicy = "strict-origin-when-cross-origin";
    card.append(player);
    card.classList.add("is-playing");
    player.focus();
  }

  function selectVideo(index, autoplay = false) {
    requestedPlaybackIndex = autoplay ? index : null;
    if (isAnimating) {
      pendingIndex = index;
      return;
    }
    if (index === selectedIndex) {
      if (autoplay) playVideo();
      return;
    }

    stopVideos();

    if (selectedIndex === 0 && index === slides.length - 1) {
      position = cloneCount - 1;
    } else if (selectedIndex === slides.length - 1 && index === 0) {
      position = cloneCount + slides.length;
    } else {
      position = index + cloneCount;
    }

    selectedIndex = index;
    if (reducedMotion.matches) {
      resetPosition();
      if (autoplay) playVideo();
    } else {
      isAnimating = true;
      render();
    }
  }

  strip.addEventListener("click", (event) => {
    const trigger = event.target.closest(".video-trigger");
    if (!trigger || isAnimating) return;
    selectVideo(Number(trigger.closest(".video-card").dataset.videoIndex), true);
  });

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => selectVideo(index));
    button.addEventListener("keydown", (event) => {
      let nextIndex;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + slides.length) % slides.length;
      else if (event.key === "ArrowRight") nextIndex = (index + 1) % slides.length;
      else return;

      event.preventDefault();
      buttons[nextIndex].focus();
      selectVideo(nextIndex);
    });
  });

  strip.addEventListener("transitionend", (event) => {
    if (event.target === strip && event.propertyName === "transform") finishTransition();
  });

  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) finishTransition();
  });

  resetPosition();
})();
