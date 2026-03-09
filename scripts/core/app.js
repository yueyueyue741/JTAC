/**
 * 应用初始化、生命周期管理
 * 读取 localStorage 配置，启动世界膜，挂载 loading → main-space
 */

import { openDB } from './storage.js';
import { activate, getActiveWorldId } from './world-context.js';
import { navigate, setRouteHandler } from './router.js';

const ROOT_ID = 'app-root';

/**
 * 初始化并挂载首屏
 */
export async function init() {
  await openDB();
  const savedWorldId = getActiveWorldId();
  if (savedWorldId) activate(savedWorldId);

  setRouteHandler((route, payload) => {
    const root = document.getElementById(ROOT_ID);
    if (!root) return;
    if (route === 'loading') {
      root.innerHTML = '<div class="loading-placeholder">正在构建你的平行宇宙...</div>';
      return;
    }
    if (route === 'main-space') {
      root.innerHTML = '<div class="main-space-placeholder">主空间（待 main-space.js 挂载）</div>';
      return;
    }
    root.innerHTML = `<div class="view-placeholder">${route}</div>`;
  });

  navigate('loading');
  await minDisplayTime(1500);
  navigate('main-space');
}

function minDisplayTime(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

init().catch(console.error);

export default { init };
