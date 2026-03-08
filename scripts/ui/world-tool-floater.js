/**
 * 世界内可拖动工具悬浮窗（API/系统/美化+世界书/协议/面具/提示词库）
 * 支持拖动、点击展开、位置保存
 */

import { iconLoader } from './icon.js';
import { sheet } from './sheet.js';
import { storage } from '../core/storage.js';
import { worldContext } from '../core/world-context.js';

export class WorldToolFloater {
  constructor(options = {}) {
    this.options = {
      onItemClick: options.onItemClick || null,
    };
    this.element = null;
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.init();
  }

  /**
   * 初始化
   */
  async init() {
    // 创建悬浮球
    this.element = document.createElement('div');
    this.element.className = 'world-tool-floater';
    
    // 加载保存的位置
    const savedPosition = storage.getLocal('world_tool_floater_position', null);
    if (savedPosition) {
      this.setPosition(savedPosition);
    } else {
      // 默认位置：右下角
      this.element.style.bottom = 'calc(56px + var(--space-4) + env(safe-area-inset-bottom))';
      this.element.style.right = 'var(--space-4)';
    }

    // 图标
    const iconContainer = document.createElement('div');
    iconContainer.className = 'world-tool-floater__icon';
    const icon = await iconLoader.loadIcon('feather:settings', { size: 24 });
    iconContainer.appendChild(icon);
    this.element.appendChild(iconContainer);

    // 绑定事件
    this.bindEvents();

    // 添加到页面
    document.body.appendChild(this.element);
  }

  /**
   * 设置位置
   * @param {Object} position - 位置对象 { x, y } 或 { bottom, right }
   */
  setPosition(position) {
    if (position.bottom !== undefined) {
      this.element.style.bottom = position.bottom;
    }
    if (position.right !== undefined) {
      this.element.style.right = position.right;
    }
    if (position.left !== undefined) {
      this.element.style.left = position.left;
      this.element.style.right = 'auto';
    }
    if (position.top !== undefined) {
      this.element.style.top = position.top;
      this.element.style.bottom = 'auto';
    }
  }

  /**
   * 获取位置
   * @returns {Object} 位置对象
   */
  getPosition() {
    const rect = this.element.getBoundingClientRect();
    return {
      bottom: this.element.style.bottom || null,
      right: this.element.style.right || null,
      left: this.element.style.left || null,
      top: this.element.style.top || null,
    };
  }

  /**
   * 绑定事件
   */
  bindEvents() {
    let longPressTimer = null;

    // 鼠标按下 / 触摸开始
    const startHandler = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      longPressTimer = setTimeout(() => {
        this.startDrag(clientX, clientY);
      }, 500);
    };

    // 鼠标释放 / 触摸结束
    const endHandler = () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }

      if (!this.isDragging) {
        // 短按：展开菜单
        this.showMenu();
      } else {
        // 拖动结束
        this.endDrag();
      }
    };

    this.element.addEventListener('mousedown', startHandler);
    this.element.addEventListener('touchstart', startHandler);
    document.addEventListener('mouseup', endHandler);
    document.addEventListener('touchend', endHandler);

    // 拖动
    document.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        this.onDrag(e.clientX, e.clientY);
      }
    });

    document.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches[0]) {
        e.preventDefault();
        this.onDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    });
  }

  /**
   * 开始拖动
   * @param {number} clientX - 鼠标X坐标
   * @param {number} clientY - 鼠标Y坐标
   */
  startDrag(clientX, clientY) {
    this.isDragging = true;
    this.element.style.cursor = 'grabbing';
    this.element.style.opacity = '0.8';

    const rect = this.element.getBoundingClientRect();
    this.dragOffset = {
      x: clientX - rect.left - rect.width / 2,
      y: clientY - rect.top - rect.height / 2,
    };
  }

  /**
   * 拖动中
   * @param {number} clientX - 鼠标X坐标
   * @param {number} clientY - 鼠标Y坐标
   */
  onDrag(clientX, clientY) {
    const x = clientX - this.dragOffset.x;
    const y = clientY - this.dragOffset.y;

    // 限制在屏幕内
    const rect = this.element.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;

    const clampedX = Math.max(0, Math.min(x, maxX));
    const clampedY = Math.max(0, Math.min(y, maxY));

    this.element.style.left = `${clampedX}px`;
    this.element.style.top = `${clampedY}px`;
    this.element.style.right = 'auto';
    this.element.style.bottom = 'auto';
  }

  /**
   * 结束拖动
   */
  endDrag() {
    this.isDragging = false;
    this.element.style.cursor = '';
    this.element.style.opacity = '';

    // 保存位置
    const position = this.getPosition();
    storage.setLocal('world_tool_floater_position', position);
  }

  /**
   * 显示菜单
   */
  showMenu() {
    const menuItems = [
      { id: 'api', label: 'API 设置', icon: 'feather:sliders' },
      { id: 'system', label: '系统设置', icon: 'feather:settings' },
      { id: 'theme', label: '美化设置', icon: 'material-symbols:palette' },
      { id: 'worldbook', label: '世界书', icon: 'feather:book' },
      { id: 'protocol', label: '全局协议', icon: 'feather:file-text' },
      { id: 'mask', label: '面具库', icon: 'feather:user' },
      { id: 'prompt', label: '提示词库', icon: 'feather:code' },
    ];

    const menuContent = document.createElement('div');
    menuContent.style.cssText = `
      padding: var(--space-4);
    `;

    const list = document.createElement('div');
    list.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    `;

    menuItems.forEach(item => {
      const listItem = document.createElement('button');
      listItem.className = 'btn btn--ghost';
      listItem.style.cssText = `
        justify-content: flex-start;
        text-align: left;
        padding: var(--space-3) var(--space-4);
      `;
      
      listItem.innerHTML = `
        <span style="margin-right: var(--space-3);">${item.label}</span>
      `;

      listItem.addEventListener('click', async () => {
        if (this.options.onItemClick) {
          this.options.onItemClick(item.id);
        }
        sheet.close();
      });

      list.appendChild(listItem);
    });

    menuContent.appendChild(list);

    sheet.show({
      title: '工具菜单',
      content: menuContent,
      closable: true,
    });
  }

  /**
   * 重置位置
   */
  resetPosition() {
    storage.removeLocal('world_tool_floater_position');
    this.element.style.bottom = 'calc(56px + var(--space-4) + env(safe-area-inset-bottom))';
    this.element.style.right = 'var(--space-4)';
    this.element.style.left = 'auto';
    this.element.style.top = 'auto';
  }

  /**
   * 销毁
   */
  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

// 导出单例（世界内使用）
let worldToolFloaterInstance = null;

export function getWorldToolFloater(options) {
  if (!worldToolFloaterInstance) {
    worldToolFloaterInstance = new WorldToolFloater(options);
  }
  return worldToolFloaterInstance;
}

export function destroyWorldToolFloater() {
  if (worldToolFloaterInstance) {
    worldToolFloaterInstance.destroy();
    worldToolFloaterInstance = null;
  }
}
