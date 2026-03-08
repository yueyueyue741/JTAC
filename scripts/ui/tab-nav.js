/**
 * 世界内底部Tab导航组件（地图/剧情/聊天/乐博通/密书/更多）
 * 含"更多"展开Sheet
 */

import { iconLoader } from './icon.js';
import { sheet } from './sheet.js';
import { eventBus, Events } from '../core/event-bus.js';

export class TabNav {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
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
    
    // 世界内底部栏背景色使用当前世界的 accent-primary 染色
    const worldAccent = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-accent-primary') || '#D9C7A3';
    this.container.style.background = `rgba(${this.hexToRgb(worldAccent)}, 0.15)`;

    await this.renderTabs();

    // 监听世界切换事件
    eventBus.on(Events.WORLD_CHANGED, () => {
      this.updateTheme();
    });
  }

  /**
   * 渲染 Tab
   */
  async renderTabs() {
    this.container.innerHTML = '';
    
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
      if (tab.id === 'more') {
        this.showMoreMenu();
      } else {
        this.switchTab(tab.id);
      }
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
      eventBus.emit('tab-nav:tab-changed', {
        tabId,
      });
    }
  }

  /**
   * 显示"更多"菜单
   */
  showMoreMenu() {
    const moreItems = [
      { id: 'forum', label: '论坛', icon: 'feather:message-square' },
      { id: 'hot-search', label: '热搜', icon: 'feather:trending-up' },
      { id: 'tasks', label: '任务', icon: 'feather:check-square' },
      { id: 'marketplace', label: '商场', icon: 'feather:shopping-bag' },
      { id: 'app-store', label: '应用商店', icon: 'feather:grid' },
      { id: 'memory', label: '记忆管理', icon: 'feather:brain' },
    ];

    const menuContent = document.createElement('div');
    menuContent.style.cssText = `
      padding: var(--space-4);
    `;

    const list = document.createElement('div');
    list.style.cssText = `
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-3);
    `;

    moreItems.forEach(item => {
      const menuItem = document.createElement('button');
      menuItem.className = 'btn btn--secondary';
      menuItem.style.cssText = `
        flex-direction: column;
        padding: var(--space-4);
        height: auto;
      `;

      const iconContainer = document.createElement('div');
      iconContainer.style.cssText = `
        margin-bottom: var(--space-2);
      `;
      
      iconLoader.loadIcon(item.icon, { size: 24 }).then(icon => {
        iconContainer.appendChild(icon);
      });

      const label = document.createElement('span');
      label.textContent = item.label;
      label.style.cssText = `
        font-size: var(--font-size-sm);
      `;

      menuItem.appendChild(iconContainer);
      menuItem.appendChild(label);

      menuItem.addEventListener('click', () => {
        if (this.options.onTabChange) {
          this.options.onTabChange(item.id);
        }
        sheet.close();
      });

      list.appendChild(menuItem);
    });

    menuContent.appendChild(list);

    sheet.show({
      title: '更多',
      content: menuContent,
      closable: true,
    });
  }

  /**
   * 更新主题（世界切换时）
   */
  updateTheme() {
    const worldAccent = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-accent-primary') || '#D9C7A3';
    this.container.style.background = `rgba(${this.hexToRgb(worldAccent)}, 0.15)`;
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
 * 便捷函数：创建世界内 Tab 导航
 * @param {HTMLElement} container - 容器元素
 * @param {Object} options - 选项
 * @returns {TabNav}
 */
export function createTabNav(container, options) {
  return new TabNav(container, options);
}
