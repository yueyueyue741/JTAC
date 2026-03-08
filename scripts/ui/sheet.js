/**
 * 底部抽屉组件（移动端友好）
 */

class Sheet {
  constructor() {
    this.currentSheet = null;
  }

  /**
   * 显示底部抽屉
   * @param {Object} options - 选项
   * @param {string|HTMLElement} options.content - 内容
   * @param {string} options.title - 标题
   * @param {boolean} options.closable - 是否可关闭
   * @param {Function} options.onClose - 关闭回调
   * @returns {HTMLElement} Sheet 元素
   */
  show(options = {}) {
    const { content, title, closable = true, onClose } = options;

    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'sheet-overlay';
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

    // 创建 Sheet
    const sheet = document.createElement('div');
    sheet.className = 'sheet';
    sheet.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--color-bg-l2);
      border-radius: var(--radius-xl) var(--radius-xl) 0 0;
      box-shadow: var(--shadow-l2);
      max-height: 80vh;
      z-index: calc(var(--z-l2) + 1);
      transform: translateY(100%);
      transition: transform var(--duration-normal) var(--ease-spring);
      display: flex;
      flex-direction: column;
    `;

    // 标题栏
    if (title) {
      const header = document.createElement('div');
      header.className = 'sheet__header';
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

      sheet.appendChild(header);
    }

    // 内容区
    const body = document.createElement('div');
    body.className = 'sheet__body scroll-container';
    body.style.cssText = `
      flex: 1;
      padding: var(--space-4);
      overflow-y: auto;
    `;

    if (typeof content === 'string') {
      body.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      body.appendChild(content);
    }

    sheet.appendChild(body);

    // 关闭函数
    const close = () => {
      overlay.style.opacity = '0';
      sheet.style.transform = 'translateY(100%)';
      
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        if (sheet.parentNode) {
          sheet.parentNode.removeChild(sheet);
        }
        this.currentSheet = null;
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

    overlay.appendChild(sheet);
    document.body.appendChild(overlay);

    // 触发动画
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      sheet.style.transform = 'translateY(0)';
    });

    this.currentSheet = { overlay, sheet, close };

    return sheet;
  }

  /**
   * 关闭当前 Sheet
   */
  close() {
    if (this.currentSheet) {
      this.currentSheet.close();
    }
  }
}

// 导出单例
export const sheet = new Sheet();
