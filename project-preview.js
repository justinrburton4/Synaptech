function wireTabs({ tabSelector, panelSelector, tabData, panelData, hashPrefix }) {
  const tabs = [...document.querySelectorAll(tabSelector)];
  const panels = [...document.querySelectorAll(panelSelector)];

  if (!tabs.length || !panels.length) return;

  function activate(value, { focus = false, updateHash = false } = {}) {
    for (const tab of tabs) {
      const active = tab.dataset[tabData] === value;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    }

    for (const panel of panels) {
      panel.hidden = panel.dataset[panelData] !== value;
    }

    if (updateHash) history.replaceState(null, "", `#${hashPrefix}-${value}`);
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activate(tab.dataset[tabData], { updateHash: true }));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      activate(tabs[nextIndex].dataset[tabData], { focus: true, updateHash: true });
    });
  });

  const requested = location.hash.replace(`#${hashPrefix}-`, "");
  const initial = tabs.some((tab) => tab.dataset[tabData] === requested)
    ? requested
    : tabs.find((tab) => tab.getAttribute("aria-selected") === "true")?.dataset[tabData];
  if (initial) activate(initial);

  window.addEventListener("hashchange", () => {
    const next = location.hash.replace(`#${hashPrefix}-`, "");
    if (tabs.some((tab) => tab.dataset[tabData] === next)) activate(next);
  });
}

wireTabs({
  tabSelector: "[data-move-view]",
  panelSelector: "[data-move-panel]",
  tabData: "moveView",
  panelData: "movePanel",
  hashPrefix: "view",
});

wireTabs({
  tabSelector: "[data-admin-view]",
  panelSelector: "[data-admin-panel]",
  tabData: "adminView",
  panelData: "adminPanel",
  hashPrefix: "admin",
});
