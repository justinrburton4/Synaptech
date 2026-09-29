const moveTabs = document.querySelectorAll("[data-move-view]");
const movePanels = document.querySelectorAll("[data-move-panel]");

for (const tab of moveTabs) {
  tab.addEventListener("click", () => {
    const activeView = tab.dataset.moveView;

    for (const candidate of moveTabs) {
      candidate.setAttribute("aria-selected", String(candidate === tab));
    }

    for (const panel of movePanels) {
      panel.hidden = panel.dataset.movePanel !== activeView;
    }
  });
}

const adminTabs = document.querySelectorAll("[data-admin-view]");
const adminPanels = document.querySelectorAll("[data-admin-panel]");

for (const tab of adminTabs) {
  tab.addEventListener("click", () => {
    const activeView = tab.dataset.adminView;

    for (const candidate of adminTabs) {
      candidate.setAttribute("aria-selected", String(candidate === tab));
    }

    for (const panel of adminPanels) {
      panel.hidden = panel.dataset.adminPanel !== activeView;
    }
  });
}
