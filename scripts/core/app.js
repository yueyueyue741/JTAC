// JTAC快穿养成 应用入口（占位实现，后续按 DESIGN.md 细化）

function bootstrapJTACApp() {
  const root = document.querySelector(".app-shell");
  if (!root) return;

  // 预留：未来在此挂载 router、world-context、main-space 等模块
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrapJTACApp);
} else {
  bootstrapJTACApp();
}

