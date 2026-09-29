const exhibition = document.querySelector("[data-exhibition]");

if (exhibition) {
  const image = exhibition.querySelector("[data-ex-image]");
  const scene = exhibition.querySelector(".ex-scene");
  const title = exhibition.querySelector("[data-ex-title]");
  const discipline = exhibition.querySelector("[data-ex-discipline]");
  const link = exhibition.querySelector("[data-ex-link]");
  const count = exhibition.querySelector(".ex-rail > p span");
  const buttons = [...exhibition.querySelectorAll("[data-ex-button]")];

  buttons.forEach((button, position) => button.addEventListener("click", () => {
    buttons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    image.src = button.dataset.image;
    image.alt = button.dataset.alt;
    title.textContent = button.dataset.title;
    discipline.textContent = button.dataset.discipline;
    link.href = button.dataset.link;
    count.textContent = `${position + 1} / ${buttons.length}`;
    scene.classList.toggle("is-contain", button.dataset.fit === "contain");
    image.style.animation = "none";
    void image.offsetWidth;
    image.style.animation = "";
  }));
}

const directory = document.querySelector("[data-directory]");

if (directory) {
  const items = [...directory.querySelectorAll("[data-di-item]")];
  const frame = directory.querySelector(".di-preview-frame");
  const image = directory.querySelector("[data-di-image]");
  const title = directory.querySelector("[data-di-title]");

  const preview = (item) => {
    if (item.classList.contains("is-active")) return;
    items.forEach((entry) => entry.classList.toggle("is-active", entry === item));
    image.src = item.dataset.image;
    image.alt = item.dataset.alt;
    title.textContent = item.dataset.title;
    frame.classList.toggle("is-contain", item.dataset.fit === "contain");
    image.style.animation = "none";
    void image.offsetWidth;
    image.style.animation = "";
  };

  items.forEach((item) => {
    item.addEventListener("pointerenter", () => preview(item));
    item.addEventListener("focus", () => preview(item));
  });
  preview(items[0]);
}

const workspace = document.querySelector("[data-workspace]");

if (workspace) {
  const dialog = document.querySelector("[data-ws-dialog]");
  const image = dialog.querySelector("[data-ws-image]");
  const imageFrame = dialog.querySelector(".ws-dialog-image");
  const title = dialog.querySelector("[data-ws-title]");
  const category = dialog.querySelector("[data-ws-category]");
  const copy = dialog.querySelector("[data-ws-copy]");
  const link = dialog.querySelector("[data-ws-link]");

  workspace.querySelectorAll("[data-ws-folder]").forEach((folder) => {
    folder.addEventListener("click", () => {
      image.src = folder.dataset.image;
      image.alt = folder.dataset.alt;
      imageFrame.classList.toggle("is-contain", folder.dataset.fit === "contain");
      title.textContent = folder.dataset.title;
      category.textContent = folder.dataset.category;
      copy.textContent = folder.dataset.copy;
      link.href = folder.dataset.link;
      dialog.showModal();
    });
  });

  dialog.querySelector("[data-ws-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}
