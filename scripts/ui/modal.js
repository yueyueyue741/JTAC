/**
 * 通用模态框组件（L2层）
 */

class Modal {
  constructor() {
    this.currentModal = null;
  }

  /**
   * 显示模态框
   * @param {Object} options - 选项
   * @param {string|HTMLElement} options.content - 内容
   * @param {string} options.title - 标题
   * @param {boolean} options.closable - 是否可关闭
   * @param {Function} options.onClose - 关闭回调
   * @returns {HTMLElement} 模态框元素
   */
  show(options = {}) {
    const { content, title, closable = true, onClose } = options;

    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--color-bg-overlay);
      z-index: var(--z-l2);
      opacity: 0;
      transition: opacity var(--duration-normal) var(--ease-smooth);
    `;

    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.9);
      background: var(--color-bg-l2);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-l2);
      max-width: 90%;
      max-height: 90vh;
      overflow: hidden;
      z-index: calc(var(--z-l2) + 1);
      opacity: 0;
      transition: all var(--duration-normal) var(--ease-spring);
    `;

    // 标题栏
    if (title) {
      const header = document.createElement('div');
      header.className = 'modal__header';
      header.style.cssText = `
        padding: var(--space-4);
        border-bottom: 1px solid var(--color-border-default);
        display: flex;
        align-items: center;
        justify-content: space-between;
      `;

      const titleEl = document.createElement('h2');
      titleEl.textContent = title;
      titleEl.style.cssText = `
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-semibold);
        color: var(--color-text-primary);
      `;

      header.appendChild(titleEl);

      if (closable) {
        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn btn--ghost';
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
          font-size: var(--font-size-2xl);
          line-height: 1;
          padding: 0;
          width: 32px;
          height: 32px;
        `;
        closeBtn.addEventListener('click', () => this.close());
        header.appendChild(closeBtn);
      }

      modal.appendChild(header);
    }

    // 内容区
    const body = document.createElement('div');
    body.className = 'modal__body';
    body.style.cssText = `
      padding: var(--space-4);
      overflow-y: auto;
      max-height: calc(90vh - 100px);
    `;

    if (typeof content === 'string') {
      body.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      body.appendChild(content);
    }

    modal.appendChild(body);

    // 关闭函数
    const close = () => {
      overlay.style.opacity = '0';
      modal.style.opacity = '0';
      modal.style.transform = 'translate(-50%, -50%) scale(0.9)';
      
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        if (modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }
        this.currentModal = null;
        if (onClose) {
          onClose();
        }
      }, 300);
    };

    // 点击遮罩关闭
    if (closable) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          close();
        }
      });
    }

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // 触发动画
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      modal.style.opacity = '1';
      modal.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    this.currentModal = { overlay, modal, close };

    return modal;
  }

  /**
   * 关闭当前模态框
   */
  close() {
    if (this.currentModal) {
      this.currentModal.close();
    }
  }
}

// 导出单例
export const modal = new Modal();
