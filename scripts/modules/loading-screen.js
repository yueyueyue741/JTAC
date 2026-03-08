export function renderLoadingScreen(root, options = {}) {
  const { appName = "JTAC快穿养成" } = options;

  root.innerHTML = "";

  const view = document.createElement("div");
  view.className = "view view-loading";

  const panel = document.createElement("div");
  panel.className = "loading-panel";

  const title = document.createElement("div");
  title.className = "loading-app-name";
  title.textContent = appName;

  const subtitle = document.createElement("div");
  subtitle.className = "loading-subtitle";
  subtitle.textContent = "正在构建你的平行宇宙…";

  const progressTrack = document.createElement("div");
  progressTrack.className = "loading-progress-track";

  const progressBar = document.createElement("div");
  progressBar.className = "loading-progress-bar";
  progressTrack.appendChild(progressBar);

  panel.appendChild(title);
  panel.appendChild(subtitle);
  panel.appendChild(progressTrack);

  view.appendChild(panel);
  root.appendChild(view);
}

