/**
 * 手风琴组件
 * 支持展开/折叠，动画过渡
 */

export class Accordion {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      multiple: options.multiple || false, // 是否允许多项同时展开
      defaultOpen: options.defaultOpen || [], // 默认展开的项索引
      onToggle: options.onToggle || null, // 切换回调
    };
    this.items = [];
    this.init();
  }

  /**
   * 初始化
   */
  init() {
    this.container.classList.add('accordion');
    const items = this.container.querySelectorAll('.accordion__item');
    
    items.forEach((item, index) => {
      const header = item.querySelector('.accordion__header');
      const content = item.querySelector('.accordion__content');
      
      if (!header || !content) {
        return;
      }

      // 设置初始状态
      if (this.options.defaultOpen.includes(index)) {
        item.classList.add('accordion__item--active');
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = '0';
      }

      // 绑定点击事件
      header.addEventListener('click', () => {
        this.toggle(index);
      });

      this.items.push({
        element: item,
        header,
        content,
        isOpen: this.options.defaultOpen.includes(index),
      });
    });
  }

  /**
   * 切换项
   * @param {number} index - 项索引
   */
  toggle(index) {
    const item = this.items[index];
    if (!item) {
      return;
    }

    const wasOpen = item.isOpen;

    // 如果不允许多项同时展开，先关闭其他项
    if (!this.options.multiple && wasOpen === false) {
      this.items.forEach((otherItem, otherIndex) => {
        if (otherIndex !== index && otherItem.isOpen) {
          this.close(otherIndex);
        }
      });
    }

    // 切换当前项
    if (wasOpen) {
      this.close(index);
    } else {
      this.open(index);
    }

    // 触发回调
    if (this.options.onToggle) {
      this.options.onToggle(index, !wasOpen);
    }
  }

  /**
   * 打开项
   * @param {number} index - 项索引
   */
  open(index) {
    const item = this.items[index];
    if (!item || item.isOpen) {
      return;
    }

    item.element.classList.add('accordion__item--active');
    item.content.style.maxHeight = item.content.scrollHeight + 'px';
    item.isOpen = true;
  }

  /**
   * 关闭项
   * @param {number} index - 项索引
   */
  close(index) {
    const item = this.items[index];
    if (!item || !item.isOpen) {
      return;
    }

    item.element.classList.remove('accordion__item--active');
    item.content.style.maxHeight = '0';
    item.isOpen = false;
  }

  /**
   * 打开所有项
   */
  openAll() {
    this.items.forEach((_, index) => {
      this.open(index);
    });
  }

  /**
   * 关闭所有项
   */
  closeAll() {
    this.items.forEach((_, index) => {
      this.close(index);
    });
  }
}

/**
 * 便捷函数：创建手风琴
 * @param {HTMLElement} container - 容器元素
 * @param {Object} options - 选项
 * @returns {Accordion}
 */
export function createAccordion(container, options) {
  return new Accordion(container, options);
}
