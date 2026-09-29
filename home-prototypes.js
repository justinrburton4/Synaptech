const stage = document.querySelector("[data-project-stage]");

if (stage) {
  const image = stage.querySelector("[data-stage-image]");
  const title = stage.querySelector("[data-stage-title]");
  const copy = stage.querySelector("[data-stage-copy]");
  const link = stage.querySelector("[data-stage-link]");
  const frame = stage.querySelector("[data-stage-frame]");
  const tabs = [...stage.querySelectorAll("[data-stage-tab]")];

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.setAttribute("aria-pressed", String(item === tab)));
      image.src = tab.dataset.image;
      image.alt = tab.dataset.alt;
      title.textContent = tab.dataset.title;
      copy.textContent = tab.dataset.copy;
      link.href = tab.dataset.link;
      frame.classList.toggle("is-logo", tab.dataset.fit === "contain");
    });
  });
}

const rail = document.querySelector("[data-project-rail]");

if (rail) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelector("[data-rail-prev]")?.addEventListener("click", () => {
    rail.scrollBy({ left: -rail.clientWidth * 0.72, behavior: reducedMotion ? "auto" : "smooth" });
  });
  document.querySelector("[data-rail-next]")?.addEventListener("click", () => {
    rail.scrollBy({ left: rail.clientWidth * 0.72, behavior: reducedMotion ? "auto" : "smooth" });
  });
}
