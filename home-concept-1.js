const projects = {
  tonaliq: {
    title: "TonaliQ",
    category: "Product & AI",
    description: "Audio-grounded feedback for independent producers working on their own mixes.",
    image: "assets/project-logos/tonaliq-app-icon.png",
    href: "project-tonaliq.html",
  },
  "design-byu": {
    title: "design.byu.edu",
    category: "Web & Interactive",
    description: "A web home for BYU’s Design Exploration research group and its research, tools, and learning resources.",
    image: "assets/project-logos/desx.png",
    href: "project-design-byu.html",
  },
  "byu-move": {
    title: "BYU Move Team Management System",
    category: "Custom Software",
    description: "A web application for registration, participant self-service, mentor workflows, and administrative operations.",
    image: "assets/project-cards/byu-move.jpg",
    href: "project-move-team.html",
  },
  "red-rising": {
    title: "redrising.games",
    category: "Web & Interactive",
    description: "An unofficial fan project with browser-based quizzes, simulations, and community tools.",
    image: "assets/project-logos/red-rising-games.png",
    href: "project-red-rising.html",
  },
  "spicy-pineapple": {
    title: "SpicyPineappleGroup",
    category: "Storefront",
    description: "An Etsy storefront for fandom-inspired apparel, accessories, and gifts.",
    image: "assets/project-logos/spdg.png",
    href: "project-spicy-pineapple.html",
  },
  "decal-company": {
    title: "The Decal Company",
    category: "Graphic Design",
    description: "Graphic design and identity work developed for The Decal Company.",
    image: "assets/project-cards/decal-company.png",
    href: "project-decal-company.html",
  },
};

const graph = document.querySelector("[data-project-graph]");
const dialog = document.querySelector("[data-project-dialog]");

if (graph && dialog) {
  const nodes = [...graph.querySelectorAll("[data-node]")];
  const edges = [...graph.querySelectorAll(".graph-edge")];
  const preview = graph.querySelector("[data-project-preview]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const motion = new Map(nodes.map((node) => [node, { x: 0, y: 0, scale: 1, targetX: 0, targetY: 0, targetScale: 1 }]));
  let frame = 0;

  const updateEdges = () => {
    const graphBox = graph.getBoundingClientRect();

    edges.forEach((edge) => {
      const from = graph.querySelector(`[data-graph-point="${edge.dataset.from}"]`);
      const to = graph.querySelector(`[data-graph-point="${edge.dataset.to}"]`);
      if (!from || !to) return;

      const fromBox = from.getBoundingClientRect();
      const toBox = to.getBoundingClientRect();
      edge.setAttribute("x1", fromBox.left - graphBox.left + fromBox.width / 2);
      edge.setAttribute("y1", fromBox.top - graphBox.top + fromBox.height / 2);
      edge.setAttribute("x2", toBox.left - graphBox.left + toBox.width / 2);
      edge.setAttribute("y2", toBox.top - graphBox.top + toBox.height / 2);
    });
  };

  const animateNodes = () => {
    let moving = false;

    motion.forEach((state, node) => {
      state.x += (state.targetX - state.x) * 0.13;
      state.y += (state.targetY - state.y) * 0.13;
      state.scale += (state.targetScale - state.scale) * 0.13;
      node.style.setProperty("--shift-x", `${state.x.toFixed(2)}px`);
      node.style.setProperty("--shift-y", `${state.y.toFixed(2)}px`);
      node.style.setProperty("--node-scale", state.scale.toFixed(3));

      if (Math.abs(state.targetX - state.x) + Math.abs(state.targetY - state.y) + Math.abs(state.targetScale - state.scale) > 0.006) {
        moving = true;
      }
    });

    updateEdges();
    frame = moving ? requestAnimationFrame(animateNodes) : 0;
  };

  const startAnimation = () => {
    if (!frame) frame = requestAnimationFrame(animateNodes);
  };

  const aimNodes = (pointerX, pointerY) => {
    const box = graph.getBoundingClientRect();
    const normalizedX = pointerX / box.width - 0.5;
    const normalizedY = pointerY / box.height - 0.5;

    nodes.forEach((node) => {
      const state = motion.get(node);
      const depth = Number(node.dataset.depth || 1);
      const baseX = box.width * Number(node.dataset.x) / 100;
      const baseY = box.height * Number(node.dataset.y) / 100;
      const deltaX = pointerX - baseX;
      const deltaY = pointerY - baseY;
      const distance = Math.max(1, Math.hypot(deltaX, deltaY));
      const proximity = Math.max(0, 1 - distance / 210);

      state.targetX = normalizedX * depth * 8;
      state.targetY = normalizedY * depth * 8;
      state.targetScale = 1 + proximity * proximity * 0.32;
    });

    startAnimation();
  };

  const settleNodes = () => {
    motion.forEach((state) => {
      state.targetX = 0;
      state.targetY = 0;
      state.targetScale = 1;
    });
    startAnimation();
  };

  const showPreview = (node) => {
    const project = projects[node.dataset.node];
    if (!project || !preview) return;

    preview.querySelector("[data-preview-image]").src = project.image;
    preview.querySelector("[data-preview-image]").alt = "";
    preview.querySelector("[data-preview-category]").textContent = project.category;
    preview.querySelector("[data-preview-title]").textContent = project.title;
    preview.querySelector("[data-preview-description]").textContent = project.description;
    preview.dataset.category = node.dataset.category;
    preview.classList.add("is-visible");
    preview.setAttribute("aria-hidden", "false");

    requestAnimationFrame(() => {
      const graphBox = graph.getBoundingClientRect();
      const nodeBox = node.getBoundingClientRect();
      const previewWidth = preview.offsetWidth;
      const previewHeight = preview.offsetHeight;
      const nodeCenterX = nodeBox.left - graphBox.left + nodeBox.width / 2;
      const nodeCenterY = nodeBox.top - graphBox.top + nodeBox.height / 2;
      const preferredX = nodeCenterX < graphBox.width / 2
        ? nodeBox.right - graphBox.left + 16
        : nodeBox.left - graphBox.left - previewWidth - 16;
      const x = Math.min(Math.max(8, preferredX), graphBox.width - previewWidth - 8);
      const y = Math.min(Math.max(8, nodeCenterY - previewHeight / 2), graphBox.height - previewHeight - 8);

      preview.style.left = `${x}px`;
      preview.style.top = `${y}px`;
    });
  };

  const hidePreview = () => {
    if (!preview) return;
    preview.classList.remove("is-visible");
    preview.setAttribute("aria-hidden", "true");
  };

  graph.addEventListener("pointermove", (event) => {
    if (reducedMotion.matches || event.pointerType === "touch") return;
    const box = graph.getBoundingClientRect();
    aimNodes(event.clientX - box.left, event.clientY - box.top);
  });

  graph.addEventListener("pointerleave", () => {
    settleNodes();
    hidePreview();
  });
  window.addEventListener("resize", updateEdges);
  window.addEventListener("load", updateEdges, { once: true });

  nodes.forEach((node) => {
    node.style.left = `${node.dataset.x}%`;
    node.style.top = `${node.dataset.y}%`;
    node.addEventListener("pointerenter", () => showPreview(node));
    node.addEventListener("pointerleave", hidePreview);
    node.addEventListener("focus", () => showPreview(node));
    node.addEventListener("blur", hidePreview);
    node.addEventListener("click", () => {
      const project = projects[node.dataset.node];
      if (!project) return;

      hidePreview();
      dialog.querySelector("[data-dialog-image]").src = project.image;
      dialog.querySelector("[data-dialog-image]").alt = `${project.title} project image`;
      dialog.querySelector("[data-dialog-category]").textContent = project.category;
      dialog.querySelector("[data-dialog-title]").textContent = project.title;
      dialog.querySelector("[data-dialog-description]").textContent = project.description;
      dialog.querySelector("[data-dialog-link]").href = project.href;
      dialog.showModal();
    });
  });

  dialog.querySelector("[data-dialog-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  requestAnimationFrame(updateEdges);
}
