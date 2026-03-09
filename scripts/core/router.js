/**
 * 轻量客户端路由（视图切换管理）
 * 主空间 / 世界内 / 各模块视图由路由名驱动
 */

/** @type {string} */
let currentRoute = 'loading';

/** @type {(route: string, payload?: unknown) => void} */
let routeHandler = () => {};

/**
 * @param {string} route
 * @param {unknown} [payload]
 */
export function navigate(route, payload) {
  if (currentRoute === route) return;
  currentRoute = route;
  routeHandler(route, payload);
}

/**
 * @returns {string}
 */
export function getCurrentRoute() {
  return currentRoute;
}

/**
 * @param {(route: string, payload?: unknown) => void} fn
 */
export function setRouteHandler(fn) {
  routeHandler = fn;
}

export default { navigate, getCurrentRoute, setRouteHandler };
