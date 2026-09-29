const deck = document.querySelector("[data-deck]");

if (deck) {
  const cards = [...deck.querySelectorAll("[data-deck-card]")];
  const title = deck.querySelector("[data-deck-title]");
  const copy = deck.querySelector("[data-deck-copy]");
  const link = deck.querySelector("[data-deck-link]");
  const positions = ["active", "left", "bottom"];

  cards.forEach((card) => card.addEventListener("click", () => {
    const selected = cards.indexOf(card);
    cards.forEach((item, index) => {
      item.setAttribute("aria-pressed", String(item === card));
      item.dataset.position = positions[(index - selected + cards.length) % cards.length];
    });
    title.textContent = card.dataset.title;
    copy.textContent = card.dataset.copy;
    link.href = card.dataset.link;
  }));
}

const index = document.querySelector("[data-index]");

if (index) {
  const groups = [...index.querySelectorAll("[data-index-group]")];

  groups.forEach((group) => {
    group.querySelector("[data-index-trigger]").addEventListener("click", () => {
      groups.forEach((item) => {
        const isOpen = item === group;
        item.classList.toggle("is-open", isOpen);
        item.querySelector("[data-index-trigger]").setAttribute("aria-expanded", String(isOpen));
        item.querySelector("[data-index-panel]").hidden = !isOpen;
        item.querySelector(".index-toggle").textContent = isOpen ? "−" : "+";
      });
    });
  });
}
