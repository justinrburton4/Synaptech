const setPreview = ({ trigger, root, imageSelector, titleSelector, copySelector, linkSelector, frameSelector }) => {
  const image = root.querySelector(imageSelector);
  const title = root.querySelector(titleSelector);
  const copy = root.querySelector(copySelector);
  const link = linkSelector ? root.querySelector(linkSelector) : null;
  const frame = root.querySelector(frameSelector);

  image.src = trigger.dataset.image;
  image.alt = trigger.dataset.alt;
  title.textContent = trigger.dataset.title;
  copy.textContent = trigger.dataset.copy;
  if (link) link.href = trigger.dataset.link;
  frame.classList.toggle("is-contain", trigger.dataset.fit === "contain");
};

const orbit = document.querySelector("[data-orbit]");
if (orbit) {
  const nodes = [...orbit.querySelectorAll("[data-orbit-node]")];
  nodes.forEach((node) => node.addEventListener("click", () => {
    nodes.forEach((item) => item.setAttribute("aria-pressed", String(item === node)));
    setPreview({ trigger: node, root: orbit, imageSelector: "[data-orbit-image]", titleSelector: "[data-orbit-title]", copySelector: "[data-orbit-copy]", linkSelector: "[data-orbit-link]", frameSelector: "[data-orbit-frame]" });
  }));
}

const registry = document.querySelector("[data-registry]");
if (registry) {
  const rows = [...registry.querySelectorAll("[data-registry-row]")];
  const select = (row) => {
    rows.forEach((item) => item.setAttribute("aria-current", String(item === row)));
    setPreview({ trigger: row, root: registry, imageSelector: "[data-registry-image]", titleSelector: "[data-registry-title]", copySelector: "[data-registry-copy]", frameSelector: "[data-registry-frame]" });
  };
  rows.forEach((row) => {
    row.addEventListener("mouseenter", () => select(row));
    row.addEventListener("focus", () => select(row));
  });
}
