/**
 * 轻提示组件（L3层）
 */

class Toast {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    // 创建 Toast 容器
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    this.container.style.cssText = `
      position: fixed;
      bottom: calc(56px + var(--space-4) + env(safe-area-inset-bottom));
      left: 50%;
      transform: translateX(-50%);
      z-index: var(--z-l3);
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      pointer-events: none;
    `;
    document.body.appendChild(this.container);
  }

  /**
   * 显示 Toast
   * @param {string} message - 消息内容
   * @param {Object} options - 选项
   * @param {string} options.type - 类型：'success' | 'error' | 'info' | 'warning'
   * @param {number} options.duration - 显示时长（ms），默认 3000
   */
  show(message, options = {}) {
    const { type = 'info', duration = 3000 } = options;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      background: var(--color-bg-l3);
      color: var(--color-text-inverse);
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      box-shadow: var(--shadow-l3);
      opacity: 0;
      transform: translateY(20px);
      transition: all var(--duration-normal) var(--ease-smooth);
      pointer-events: auto;
    `;

    this.container.appendChild(toast);

    // 触发动画
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    // 自动移除
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  success(message, duration) {
    this.show(message, { type: 'success', duration });
  }

  error(message, duration) {
    this.show(message, { type: 'error', duration });
  }

  info(message, duration) {
    this.show(message, { type: 'info', duration });
  }

  warning(message, duration) {
    this.show(message, { type: 'warning', duration });
  }
}

// 导出单例
export const toast = new Toast();
