/**
 * 主空间：悬浮入口卡片、中央主神按钮、3项底部栏
 */

import { iconLoader } from '../ui/icon.js';
import { createFloatingEntryCards } from '../ui/floating-entry-cards.js';
import { createBottomNav } from '../ui/bottom-nav.js';
import { router } from '../core/router.js';

export class MainSpace {
  constructor() {
    this.container = null;
    this.floatingCards = null;
    this.bottomNav = null;
  }

  /**
   * 渲染主空间
   * @returns {HTMLElement}
   */
  async render() {
    const container = document.createElement('div');
    container.className = 'main-container';
    this.container = container;

    // 背景层（L0）
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

    // 内容区域（L1）
    const contentArea = document.createElement('div');
    contentArea.className = 'content-area';
    contentArea.style.cssText = `
      position: relative;
      z-index: var(--z-l1);
      min-height: 100vh;
      padding-bottom: calc(56px + env(safe-area-inset-bottom));
    `;

    // 顶部区域
    const topBar = this.createTopBar();
    contentArea.appendChild(topBar);

    // 将一键归位按钮添加到顶部栏的管理菜单中
    this.setupResetButton();

    // 悬浮入口卡片容器（必须为正方形卡片，浮在主背景上）
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'floating-cards-container';
    cardsContainer.style.cssText = `
      position: relative;
      width: 100%;
      min-height: calc(100vh - 44px - 56px);
    `;
    contentArea.appendChild(cardsContainer);

    // 初始化悬浮入口卡片
    this.floatingCards = createFloatingEntryCards(cardsContainer, {
      onCardClick: (cardId) => {
        this.handleCardClick(cardId);
      },
    });

    // 中央主神按钮（圆形，直径96px，居中）
    const centralButton = await this.createCentralButton();
    cardsContainer.appendChild(centralButton);

    container.appendChild(contentArea);

    // 底部导航栏（L1层，3项：API设置/系统设置/美化设置）
    const bottomNavContainer = document.createElement('div');
    bottomNavContainer.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: var(--z-l1);
    `;
    this.bottomNav = createBottomNav(bottomNavContainer, {
      mode: 'main',
      onTabChange: (tabId) => {
        this.handleTabChange(tabId);
      },
    });
    container.appendChild(bottomNavContainer);

    return container;
  }

  /**
   * 处理卡片点击
   * @param {string} cardId - 卡片ID
   */
  handleCardClick(cardId) {
    switch (cardId) {
      case 'world-transition':
        router.navigate('/world-transition');
        break;
      case 'world-archive':
        router.navigate('/world-archive');
        break;
      case 'lebotalk':
        router.navigate('/lebotalk');
        break;
      case 'mishu':
        router.navigate('/mishu');
        break;
      default:
        console.log('Card clicked:', cardId);
    }
  }

  /**
   * 处理底部Tab切换
   * @param {string} tabId - Tab ID
   */
  handleTabChange(tabId) {
    // TODO: 实现Tab切换逻辑
    console.log('Tab changed:', tabId);
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
    manageBtn.addEventListener('click', () => {
      this.showManageMenu();
    });

    topBar.appendChild(worldName);
    topBar.appendChild(manageBtn);

    return topBar;
  }

  /**
   * 设置一键归位按钮
   * 根据文档要求，按钮放在"主空间的设置区或卡片菜单中"
   * 这里先添加到顶部栏，后续可以在管理菜单中显示
   */
  setupResetButton() {
    // 等待悬浮卡片初始化完成后获取一键归位按钮
    setTimeout(() => {
      if (this.floatingCards && typeof this.floatingCards.getResetButton === 'function') {
        const resetButton = this.floatingCards.getResetButton();
        // 将按钮添加到顶部栏右侧
        const topBar = this.container.querySelector('.top-status-bar');
        if (topBar && resetButton) {
          resetButton.style.marginLeft = 'var(--space-2)';
          topBar.appendChild(resetButton);
        }
      }
    }, 200);
  }

  /**
   * 显示管理菜单
   */
  showManageMenu() {
    // TODO: 实现管理菜单（批量导出、批量删除等）
    // 一键归位按钮也可以放在这个菜单中
    console.log('Show manage menu');
  }

  /**
   * 创建中央主神按钮
   * 圆形，直径96px，背景为 --color-accent-primary 渐变
   * @returns {HTMLElement}
   */
  async createCentralButton() {
    const button = document.createElement('button');
    button.className = 'central-god-button';
    button.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 96px;
      height: 96px;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary));
      box-shadow: var(--shadow-accent);
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      transition: var(--transition-default);
      z-index: var(--z-p1);
    `;
    
    const icon = await iconLoader.loadIcon('feather:compass', { size: 48 });
    icon.style.color = 'var(--color-text-inverse)';
    button.appendChild(icon);

    // 悬停/点击效果
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translate(-50%, -50%) scale(1.05)';
      button.style.boxShadow = 'var(--shadow-p1)';
    });
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translate(-50%, -50%) scale(1)';
      button.style.boxShadow = 'var(--shadow-accent)';
    });

    button.addEventListener('click', async () => {
      // 进入当前世界的主对话/游戏界面
      const { worldContext } = await import('../core/world-context.js');
      const activeWorldId = worldContext.getActiveWorldId();
      if (activeWorldId) {
        router.navigate('/world');
      } else {
        // 如果没有激活世界，跳转到世界选择
        router.navigate('/world-archive');
      }
    });

    return button;
  }
}
