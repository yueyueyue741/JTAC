/**
 * 主空间：悬浮入口卡片、中央主神按钮、3项底部栏
 */

import { iconLoader } from '../ui/icon.js';

export class MainSpace {
  constructor() {
    this.container = null;
  }

  /**
   * 渲染主空间
   * @returns {HTMLElement}
   */
  async render() {
    const container = document.createElement('div');
    container.className = 'main-container';
    this.container = container;

    // 背景层
    const background = document.createElement('div');
    background.className = 'main-space__background';
    background.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--bg-main-color);
      z-index: var(--z-l0);
    `;
    container.appendChild(background);

    // 内容区域
    const contentArea = document.createElement('div');
    contentArea.className = 'content-area';
    contentArea.style.cssText = `
      position: relative;
      z-index: var(--z-l1);
      padding: var(--space-6) var(--space-4);
    `;

    // 顶部区域
    const topBar = this.createTopBar();
    contentArea.appendChild(topBar);

    // 悬浮入口卡片容器
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'floating-cards-container';
    contentArea.appendChild(cardsContainer);

    // 中央主神按钮
    const centralButton = await this.createCentralButton();
    contentArea.appendChild(centralButton);

    container.appendChild(contentArea);

    // 底部导航栏
    const bottomNav = await this.createBottomNav();
    container.appendChild(bottomNav);

    return container;
  }

  /**
   * 创建顶部栏
   * @returns {HTMLElement}
   */
  createTopBar() {
    const topBar = document.createElement('div');
    topBar.className = 'top-status-bar';
    
    const worldName = document.createElement('span');
    worldName.textContent = '未选择世界';
    worldName.style.cssText = `
      font-size: var(--font-size-sm);
      color: var(--color-text-tertiary);
    `;

    const manageBtn = document.createElement('button');
    manageBtn.textContent = '管理';
    manageBtn.className = 'btn btn--ghost btn--small';

    topBar.appendChild(worldName);
    topBar.appendChild(manageBtn);

    return topBar;
  }

  /**
   * 创建中央主神按钮
   * @returns {HTMLElement}
   */
  async createCentralButton() {
    const button = document.createElement('button');
    button.className = 'central-god-button';
    
    const icon = await iconLoader.loadIcon('feather:compass', { size: 48 });
    button.appendChild(icon);

    button.addEventListener('click', () => {
      // TODO: 进入当前世界
      console.log('Enter current world');
    });

    return button;
  }

  /**
   * 创建底部导航栏
   * @returns {HTMLElement}
   */
  async createBottomNav() {
    const nav = document.createElement('nav');
    nav.className = 'bottom-nav';

    const tabs = [
      { icon: 'feather:sliders', label: 'API设置' },
      { icon: 'feather:settings', label: '系统设置' },
      { icon: 'material-symbols:palette', label: '美化设置' },
    ];

    for (const tab of tabs) {
      const item = document.createElement('button');
      item.className = 'bottom-nav__item';
      
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
        // TODO: 切换 Tab
        console.log(`Switch to ${tab.label}`);
      });

      nav.appendChild(item);
    }

    return nav;
  }
}
