// 极轻量视图路由：目前仅支持 loading → main-space

const routes = new Map();

export function registerRoute(name, renderFn) {
  routes.set(name, renderFn);
}

export function navigate(name, params = {}) {
  const appRoot = document.getElementById('app-root');
  if (!appRoot) return;
  const render = routes.get(name);
  if (!render) {
    console.warn('[router] route not found:', name);
    return;
  }
  appRoot.innerHTML = '';
  render(appRoot, params);
}

