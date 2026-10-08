const scrollLink = document.querySelector(".siege-scroll");
const siegeDetail = document.getElementById("siege-detail");

if (scrollLink && siegeDetail) {
  scrollLink.addEventListener("click", (event) => {
    if (
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    siegeDetail.scrollIntoView({
      behavior: reduceMotion ? "instant" : "smooth",
      block: "start",
    });

    if (window.location.hash !== "#siege-detail") {
      window.history.pushState(null, "", "#siege-detail");
    }
  });
}
