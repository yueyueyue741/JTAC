export function renderMainSpace(root, options = {}) {
  const { appName = "JTAC快穿养成" } = options;

  root.innerHTML = "";

  const view = document.createElement("div");
  view.className = "view view-main-space scroll-container";

  const header = document.createElement("header");
  header.className = "main-space-header";
  const title = document.createElement("div");
  title.className = "main-space-title";
  title.textContent = `${appName} · 主神空间`;
  header.appendChild(title);

  const entriesSection = document.createElement("section");
  entriesSection.className = "floating-entry-grid";

  const entries = [
    { key: "world-transition", label: "世界跃迁" },
    { key: "world-archive", label: "世界档案" },
    { key: "lebotalk", label: "乐博通" },
    { key: "mishu", label: "密书" },
  ];

  entries.forEach((entry) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "floating-entry-card";
    card.dataset.entryKey = entry.key;

    const label = document.createElement("span");
    label.className = "floating-entry-label";
    label.textContent = entry.label;

    card.appendChild(label);
    entriesSection.appendChild(card);
  });

  const centerSection = document.createElement("section");
  centerSection.className = "main-space-center";
  const orbButton = document.createElement("button");
  orbButton.type = "button";
  orbButton.className = "main-orb-button";

  const orbLabel = document.createElement("span");
  orbLabel.className = "main-orb-label";
  orbLabel.textContent = "进入当前世界";

  orbButton.appendChild(orbLabel);
  centerSection.appendChild(orbButton);

  const bottomNav = document.createElement("nav");
  bottomNav.className = "bottom-nav bottom-nav-main";

  const tabs = [
    { key: "api", label: "API设置", active: true },
    { key: "system", label: "系统设置", active: false },
    { key: "theme", label: "美化设置", active: false },
  ];

  tabs.forEach((tab) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "bottom-nav-button bottom-nav-item";
    if (tab.active) {
      btn.classList.add("is-active");
    }
    btn.dataset.tabKey = tab.key;

    const label = document.createElement("span");
    label.className = "bottom-nav-button-label";
    label.textContent = tab.label;

    btn.appendChild(label);
    bottomNav.appendChild(btn);
  });

  view.appendChild(header);
  view.appendChild(entriesSection);
  view.appendChild(centerSection);
  view.appendChild(bottomNav);

  root.appendChild(view);
}

