import { renderLoadingScreen } from "../modules/loading-screen.js";
import { renderMainSpace } from "../modules/main-space.js";

const APP_NAME = "JTAC快穿养成";

function bootstrap() {
  const root = document.getElementById("app-root");
  if (!root) return;

  renderLoadingScreen(root, { appName: APP_NAME });

  const minDuration = 1500;
  const start = performance.now();

  // 预留初始化流程（IndexedDB / WorldContext 等）
  Promise.resolve().then(() => {
    const elapsed = performance.now() - start;
    const delay = Math.max(0, minDuration - elapsed);
    window.setTimeout(() => {
      renderMainSpace(root, { appName: APP_NAME });
    }, delay);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}

