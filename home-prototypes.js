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

const lens = document.querySelector("[data-lens]");

if (lens) {
  const frame = lens.querySelector("[data-lens-frame]");
  const image = lens.querySelector("[data-lens-image]");
  const title = lens.querySelector("[data-lens-title]");
  const category = lens.querySelector("[data-lens-category]");
  const copy = lens.querySelector("[data-lens-copy]");
  const link = lens.querySelector("[data-lens-link]");
  const counter = lens.querySelector("[data-lens-counter]");
  const buttons = [...lens.querySelectorAll("[data-lens-button]")];

  buttons.forEach((button, index) => button.addEventListener("click", () => {
    buttons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    image.src = button.dataset.image;
    image.alt = button.dataset.alt;
    title.textContent = button.dataset.title;
    category.textContent = button.dataset.category;
    copy.textContent = button.dataset.copy;
    link.href = button.dataset.link;
    counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(buttons.length).padStart(2, "0")}`;
    frame.classList.toggle("is-contain", button.dataset.fit === "contain");
  }));
}
