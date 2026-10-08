const searchInput = document.querySelector("#guide-search");
const filters = [...document.querySelectorAll("[data-filter]")];
const cards = [...document.querySelectorAll(".guide-card")];
const groups = [...document.querySelectorAll(".guide-group")];
const expandButtons = [...document.querySelectorAll("[data-expand]")];
let activeCategory = "all";
const normalize = (text) =>
  text.normalize("NFKC").toLocaleLowerCase("ko").replace(/\s+/g, "");
function updateGuides() {
  const query = normalize(searchInput.value);
  let count = 0;
  cards.forEach((card) => {
    const matches =
      (activeCategory === "all" || card.dataset.category === activeCategory) &&
      normalize(card.dataset.search).includes(query);
    card.hidden = !matches;
    if (matches) count += 1;
  });
  groups.forEach((group) => {
    const visibleCards = cards.filter(
      (card) => card.dataset.category === group.dataset.group && !card.hidden,
    );
    group.hidden = visibleCards.length === 0;
    group.querySelector("h3 span").textContent = String(visibleCards.length).padStart(2, "0");
  });
  document.querySelector("#result-count").textContent = `${count}개의 가이드`;
  document.querySelector("#no-results").hidden = count !== 0;
  expandButtons.forEach((button) => { button.disabled = count === 0; });
}
searchInput.addEventListener("input", updateGuides);
filters.forEach((button) =>
  button.addEventListener("click", () => {
    activeCategory = button.dataset.filter;
    filters.forEach((filter) => {
      const selected = filter === button;
      filter.classList.toggle("active", selected);
      filter.setAttribute("aria-pressed", String(selected));
    });
    updateGuides();
  }),
);
expandButtons.forEach((button) => button.addEventListener("click", () => {
  cards.filter((card) => !card.hidden).forEach((card) => {
    card.querySelector(".guide-disclosure").open = button.dataset.expand === "true";
  });
}));

function openLinkedGuide() {
  const guide = cards.find((card) => `#${card.id}` === window.location.hash);
  if (!guide) return;
  if (guide.hidden) {
    searchInput.value = "";
    document.querySelector('[data-filter="all"]').click();
  }
  guide.querySelector(".guide-disclosure").open = true;
  guide.scrollIntoView({ block: "start" });
}

updateGuides();
openLinkedGuide();
window.addEventListener("hashchange", openLinkedGuide);
