/**
 * 底部导航栏组件（主空间3 Tab / 世界内6 Tab）
 */

import { iconLoader } from './icon.js';
import { eventBus, Events } from '../core/event-bus.js';

export class BottomNav {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      mode: options.mode || 'main', // 'main' | 'world'
      onTabChange: options.onTabChange || null,
    };
    this.currentTab = null;
    this.init();
  }

  /**
   * 初始化
   */
  async init() {
    this.container.className = 'bottom-nav';
    
    if (this.options.mode === 'main') {
      await this.renderMainTabs();
    } else {
      await this.renderWorldTabs();
    }

    // 监听世界切换事件
    eventBus.on(Events.WORLD_CHANGED, () => {
      if (this.options.mode === 'world') {
        this.updateWorldTabs();
      }
    });
  }

  /**
   * 渲染主空间底部栏（3 Tab）
   */
  async renderMainTabs() {
    this.container.innerHTML = '';
    
    const tabs = [
      { id: 'api', icon: 'feather:sliders', label: 'API设置' },
      { id: 'system', icon: 'feather:settings', label: '系统设置' },
      { id: 'theme', icon: 'material-symbols:palette', label: '美化设置' },
    ];

    for (const tab of tabs) {
      const item = await this.createTabItem(tab);
      this.container.appendChild(item);
    }

    // 默认激活第一个
    this.switchTab(tabs[0].id);
  }

  /**
   * 渲染世界内底部栏（6 Tab）
   */
  async renderWorldTabs() {
    this.container.innerHTML = '';
    
    // 世界内底部栏背景色使用当前世界的 accent-primary 染色
    const worldAccent = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-accent-primary') || '#D9C7A3';
    this.container.style.background = `rgba(${this.hexToRgb(worldAccent)}, 0.15)`;
    
    const tabs = [
      { id: 'map', icon: 'feather:map', label: '地图' },
      { id: 'plot', icon: 'tabler:timeline', label: '剧情' },
      { id: 'chat', icon: 'feather:message-circle', label: '聊天' },
      { id: 'lebotalk', icon: 'tabler:message-circle', label: '乐博通' },
      { id: 'mishu', icon: 'tabler:notebook', label: '密书' },
      { id: 'more', icon: 'feather:grid', label: '更多' },
    ];

    for (const tab of tabs) {
      const item = await this.createTabItem(tab);
      this.container.appendChild(item);
    }

    // 默认激活第一个
    this.switchTab(tabs[0].id);
  }

  /**
   * 创建 Tab 项
   * @param {Object} tab - Tab 配置
   * @returns {HTMLElement}
   */
  async createTabItem(tab) {
    const item = document.createElement('button');
    item.className = 'bottom-nav__item';
    item.dataset.tabId = tab.id;
    
    const iconContainer = document.createElement('div');
    iconContainer.className = 'bottom-nav__icon';
    const icon = await iconLoader.loadIcon(tab.icon, { size: 24 });
    iconContainer.appendChild(icon);

    const label = document.createElement('span');
    label.className = 'bottom-nav__label';
    label.textContent = tab.label;

    item.appendChild(iconContainer);
    item.appendChild(label);

    item.addEventListener('click', () => {
      this.switchTab(tab.id);
    });

    return item;
  }

  /**
   * 切换 Tab
   * @param {string} tabId - Tab ID
   */
  switchTab(tabId) {
    // 移除所有激活状态
    this.container.querySelectorAll('.bottom-nav__item').forEach(item => {
      item.classList.remove('bottom-nav__item--active');
    });

    // 激活当前 Tab
    const activeItem = this.container.querySelector(`[data-tab-id="${tabId}"]`);
    if (activeItem) {
      activeItem.classList.add('bottom-nav__item--active');
      this.currentTab = tabId;

      // 触发回调
      if (this.options.onTabChange) {
        this.options.onTabChange(tabId);
      }

      // 发布事件
      eventBus.emit('bottom-nav:tab-changed', {
        tabId,
        mode: this.options.mode,
      });
    }
  }

  /**
   * 更新世界内 Tab（当世界切换时）
   */
  updateWorldTabs() {
    // 重新渲染以应用新的世界主题色
    this.renderWorldTabs();
  }

  /**
   * 获取当前激活的 Tab
   * @returns {string}
   */
  getCurrentTab() {
    return this.currentTab;
  }

  /**
   * 工具函数：十六进制转 RGB
   * @param {string} hex - 十六进制颜色
   * @returns {string} RGB 字符串
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '217, 199, 163'; // 默认浅金色
  }
}

/**
 * 便捷函数：创建底部导航栏
 * @param {HTMLElement} container - 容器元素
 * @param {Object} options - 选项
 * @returns {BottomNav}
 */
export function createBottomNav(container, options) {
  return new BottomNav(container, options);
}
