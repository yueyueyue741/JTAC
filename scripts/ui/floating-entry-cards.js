/**
 * 主空间悬浮入口卡片（世界跃迁/世界档案/乐博通/密书/购购购）
 * 支持自由拖动、位置保存、一键归位
 */

import { iconLoader } from './icon.js';
import { storage } from '../core/storage.js';
import { eventBus } from '../core/event-bus.js';

export class FloatingEntryCards {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      onCardClick: options.onCardClick || null,
    };
    this.cards = [];
    this.isDragging = false;
    this.dragCard = null;
    this.dragOffset = { x: 0, y: 0 };
    this.init();
  }

  /**
   * 初始化
   */
  async init() {
    this.container.className = 'floating-cards-container';
    this.container.style.position = 'relative';
    this.container.style.width = '100%';
    this.container.style.minHeight = '100vh';
    this.container.style.padding = 'var(--space-6) var(--space-4)';

    // 定义卡片配置
    this.cardConfigs = [
      { id: 'world-transition', icon: 'feather:compass', label: '世界跃迁' },
      { id: 'world-archive', icon: 'feather:archive', label: '世界档案' },
      { id: 'lebotalk', icon: 'tabler:message-circle', label: '乐博通' },
      { id: 'mishu', icon: 'tabler:notebook', label: '密书' },
      // { id: 'shopping', icon: 'feather:shopping-bag', label: '购购购' }, // 可选
    ];

    // 加载保存的位置
    const savedPositions = storage.getLocal('floating_cards_positions', null);

    // 创建卡片
    for (let i = 0; i < this.cardConfigs.length; i++) {
      const config = this.cardConfigs[i];
      const card = await this.createCard(config, i, savedPositions);
      this.cards.push(card);
      this.container.appendChild(card.element);
    }

    // 创建一键归位按钮
    this.createResetButton();

    // 绑定全局事件
    this.bindEvents();
  }

  /**
   * 创建卡片
   * @param {Object} config - 卡片配置
   * @param {number} index - 索引
   * @param {Object} savedPositions - 保存的位置
   * @returns {Object} 卡片对象
   */
  async createCard(config, index, savedPositions) {
    const card = document.createElement('div');
    card.className = 'floating-entry-card';
    card.dataset.cardId = config.id;

    // 设置默认位置或恢复保存的位置
    let position = { x: 0, y: 0 };
    if (savedPositions && savedPositions[config.id]) {
      position = savedPositions[config.id];
    } else {
      // 默认网格布局（2列）
      const col = index % 2;
      const row = Math.floor(index / 2);
      position = {
        x: col === 0 ? '20%' : '60%',
        y: `${20 + row * 25}%`,
      };
    }

    this.setCardPosition(card, position);

    // 图标
    const iconContainer = document.createElement('div');
    iconContainer.className = 'floating-entry-card__icon';
    const icon = await iconLoader.loadIcon(config.icon, { size: 32 });
    iconContainer.appendChild(icon);
    card.appendChild(iconContainer);

    // 标签
    const label = document.createElement('div');
    label.className = 'floating-entry-card__label';
    label.textContent = config.label;
    card.appendChild(label);

    // 点击事件
    card.addEventListener('click', (e) => {
      if (!this.isDragging) {
        if (this.options.onCardClick) {
          this.options.onCardClick(config.id);
        }
      }
    });

    return {
      element: card,
      config,
      position,
    };
  }

  /**
   * 设置卡片位置
   * @param {HTMLElement} card - 卡片元素
   * @param {Object} position - 位置对象 { x, y }
   */
  setCardPosition(card, position) {
    if (typeof position.x === 'string' && position.x.includes('%')) {
      card.style.left = position.x;
    } else {
      card.style.left = `${position.x}px`;
    }

    if (typeof position.y === 'string' && position.y.includes('%')) {
      card.style.top = position.y;
    } else {
      card.style.top = `${position.y}px`;
    }
  }

  /**
   * 获取卡片位置（相对坐标）
   * @param {HTMLElement} card - 卡片元素
   * @returns {Object} 位置对象
   */
  getCardPosition(card) {
    const rect = card.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();
    
    return {
      x: `${((rect.left - containerRect.left) / containerRect.width) * 100}%`,
      y: `${((rect.top - containerRect.top) / containerRect.height) * 100}%`,
    };
  }

  /**
   * 绑定事件
   */
  bindEvents() {
    // 鼠标按下
    this.container.addEventListener('mousedown', (e) => {
      const card = e.target.closest('.floating-entry-card');
      if (card) {
        this.startDrag(card, e);
      }
    });

    // 触摸开始
    this.container.addEventListener('touchstart', (e) => {
      const card = e.target.closest('.floating-entry-card');
      if (card) {
        this.startDrag(card, e.touches[0]);
      }
    });

    // 鼠标移动
    document.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        this.onDrag(e);
      }
    });

    // 触摸移动
    document.addEventListener('touchmove', (e) => {
      if (this.isDragging) {
        e.preventDefault();
        this.onDrag(e.touches[0]);
      }
    });

    // 鼠标释放
    document.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.endDrag();
      }
    });

    // 触摸结束
    document.addEventListener('touchend', () => {
      if (this.isDragging) {
        this.endDrag();
      }
    });
  }

  /**
   * 开始拖动
   * @param {HTMLElement} card - 卡片元素
   * @param {MouseEvent|Touch} event - 事件对象
   */
  startDrag(card, event) {
    // 长按检测（500ms）
    this.longPressTimer = setTimeout(() => {
      this.isDragging = true;
      this.dragCard = card;
      card.style.zIndex = '1000';
      card.style.cursor = 'grabbing';
      card.style.opacity = '0.8';

      const rect = card.getBoundingClientRect();
      const containerRect = this.container.getBoundingClientRect();
      
      this.dragOffset = {
        x: (event.clientX || event.pageX) - rect.left,
        y: (event.clientY || event.pageY) - rect.top,
      };
    }, 500);
  }

  /**
   * 拖动中
   * @param {MouseEvent|Touch} event - 事件对象
   */
  onDrag(event) {
    if (!this.dragCard) return;

    const containerRect = this.container.getBoundingClientRect();
    const cardRect = this.dragCard.getBoundingClientRect();
    
    // 计算相对于容器的位置（像素）
    const x = (event.clientX || event.pageX) - containerRect.left - this.dragOffset.x;
    const y = (event.clientY || event.pageY) - containerRect.top - this.dragOffset.y;

    // 限制在容器内
    const maxX = containerRect.width - cardRect.width;
    const maxY = containerRect.height - cardRect.height;

    const clampedX = Math.max(0, Math.min(x, maxX));
    const clampedY = Math.max(0, Math.min(y, maxY));

    // 拖动时使用像素定位（实时响应）
    this.dragCard.style.left = `${clampedX}px`;
    this.dragCard.style.top = `${clampedY}px`;
  }

  /**
   * 结束拖动
   */
  endDrag() {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
    }

    if (this.dragCard) {
      // 保存位置（转换为百分比坐标）
      const cardData = this.cards.find(c => c.element === this.dragCard);
      if (cardData) {
        // 获取当前像素位置并转换为百分比
        const position = this.getCardPosition(this.dragCard);
        cardData.position = position;
        this.savePositions();
      }

      this.dragCard.style.zIndex = '';
      this.dragCard.style.cursor = '';
      this.dragCard.style.opacity = '';
      this.dragCard = null;
    }

    this.isDragging = false;
  }

  /**
   * 保存所有卡片位置
   */
  savePositions() {
    const positions = {};
    this.cards.forEach(card => {
      positions[card.config.id] = this.getCardPosition(card.element);
    });
    storage.setLocal('floating_cards_positions', positions);
  }

  /**
   * 创建一键归位按钮
   * 根据文档要求，按钮应放在"主空间的设置区或卡片菜单中"
   * 这里提供一个方法供外部调用，由主空间模块决定放置位置
   * @returns {HTMLElement} 一键归位按钮元素
   */
  createResetButton() {
    const resetBtn = document.createElement('button');
    resetBtn.className = 'btn btn--ghost btn--small';
    resetBtn.textContent = '一键归位';
    resetBtn.style.cssText = `
      font-size: var(--font-size-xs);
      padding: var(--space-2) var(--space-3);
    `;

    resetBtn.addEventListener('click', () => {
      this.resetPositions();
    });

    // 不直接添加到 body，返回按钮供外部使用
    return resetBtn;
  }

  /**
   * 获取一键归位按钮（供外部调用）
   * @returns {HTMLElement}
   */
  getResetButton() {
    if (!this.resetButton) {
      this.resetButton = this.createResetButton();
    }
    return this.resetButton;
  }

  /**
   * 重置所有卡片位置为默认布局
   */
  resetPositions() {
    // 清除保存的位置
    storage.removeLocal('floating_cards_positions');

    // 重新设置默认位置
    this.cards.forEach((card, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const defaultPosition = {
        x: col === 0 ? '20%' : '60%',
        y: `${20 + row * 25}%`,
      };
      card.position = defaultPosition;
      this.setCardPosition(card.element, defaultPosition);
    });
  }
}

/**
 * 便捷函数：创建悬浮入口卡片
 * @param {HTMLElement} container - 容器元素
 * @param {Object} options - 选项
 * @returns {FloatingEntryCards}
 */
export function createFloatingEntryCards(container, options) {
  return new FloatingEntryCards(container, options);
}
