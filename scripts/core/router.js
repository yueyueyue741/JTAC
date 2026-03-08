/**
 * 轻量客户端路由（视图切换管理）
 */

import { eventBus } from './event-bus.js';

class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.rootElement = null;
  }

  /**
   * 初始化路由
   * @param {HTMLElement} rootElement - 根元素
   */
  init(rootElement) {
    this.rootElement = rootElement;
    
    // 监听浏览器前进/后退
    window.addEventListener('popstate', (e) => {
      this.handleRouteChange(window.location.pathname);
    });

    // 初始路由
    this.handleRouteChange(window.location.pathname || '/');
  }

  /**
   * 注册路由
   * @param {string} path - 路径
   * @param {Function} handler - 路由处理器（返回 DOM 元素或 HTML 字符串）
   */
  route(path, handler) {
    this.routes.set(path, handler);
  }

  /**
   * 导航到指定路径
   * @param {string} path - 路径
   * @param {boolean} replace - 是否替换历史记录
   */
  navigate(path, replace = false) {
    if (replace) {
      window.history.replaceState({}, '', path);
    } else {
      window.history.pushState({}, '', path);
    }
    this.handleRouteChange(path);
  }

  /**
   * 处理路由变化
   * @param {string} path - 路径
   */
  async handleRouteChange(path) {
    const handler = this.routes.get(path);
    
    if (!handler) {
      // 尝试匹配动态路由
      const matchedRoute = this.matchDynamicRoute(path);
      if (matchedRoute) {
        this.currentRoute = matchedRoute.path;
        const content = await matchedRoute.handler(matchedRoute.params);
        this.render(content);
        return;
      }

      // 404 处理
      this.render('<div>页面未找到</div>');
      return;
    }

    this.currentRoute = path;
    const content = await handler();
    this.render(content);
  }

  /**
   * 匹配动态路由
   * @param {string} path - 路径
   * @returns {Object|null}
   */
  matchDynamicRoute(path) {
    for (const [routePath, handler] of this.routes.entries()) {
      const regex = new RegExp('^' + routePath.replace(/:\w+/g, '([^/]+)') + '$');
      const match = path.match(regex);
      
      if (match) {
        const params = {};
        const paramNames = routePath.match(/:\w+/g) || [];
        paramNames.forEach((name, index) => {
          params[name.slice(1)] = match[index + 1];
        });
        
        return { path: routePath, handler, params };
      }
    }
    return null;
  }

  /**
   * 渲染内容
   * @param {HTMLElement|string} content - 内容
   */
  render(content) {
    if (!this.rootElement) {
      return;
    }

    // 清空当前内容
    this.rootElement.innerHTML = '';

    // 添加新内容
    if (typeof content === 'string') {
      this.rootElement.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      this.rootElement.appendChild(content);
    }

    // 触发路由变化事件
    eventBus.emit('route:changed', {
      route: this.currentRoute,
    });
  }

  /**
   * 获取当前路由
   * @returns {string}
   */
  getCurrentRoute() {
    return this.currentRoute;
  }
}

// 导出单例
export const router = new Router();
