/**
 * Iconify SVG 图标加载封装
 * 支持从 Iconify CDN 动态加载 SVG 图标
 */

class IconLoader {
  constructor() {
    this.iconCache = new Map();
  }

  /**
   * 加载图标
   * @param {string} iconName - 图标名称，格式：'feather:home' 或 'material-symbols:settings'
   * @param {Object} options - 选项
   * @param {number} options.size - 图标尺寸（px），默认 24
   * @param {string} options.color - 图标颜色，默认 'currentColor'
   * @returns {Promise<HTMLElement>} SVG 元素
   */
  async loadIcon(iconName, options = {}) {
    const { size = 24, color = 'currentColor' } = options;
    const cacheKey = `${iconName}-${size}-${color}`;

    // 检查缓存
    if (this.iconCache.has(cacheKey)) {
      return this.iconCache.get(cacheKey).cloneNode(true);
    }

    // 检查 Iconify 是否已加载
    if (typeof window.Iconify === 'undefined') {
      console.error('Iconify is not loaded. Please include Iconify CDN script.');
      return this.createPlaceholderIcon(size);
    }

    try {
      // 使用 Iconify 加载图标
      const svg = await window.Iconify.getIcon(iconName);
      
      if (!svg) {
        console.warn(`Icon not found: ${iconName}`);
        return this.createPlaceholderIcon(size);
      }

      // 创建 SVG 元素
      const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgElement.setAttribute('width', size);
      svgElement.setAttribute('height', size);
      svgElement.setAttribute('viewBox', svg.body || '0 0 24 24');
      svgElement.innerHTML = svg.body || '';
      
      // 设置颜色
      svgElement.style.color = color;
      svgElement.style.fill = 'currentColor';
      svgElement.style.stroke = 'currentColor';

      // 缓存图标
      this.iconCache.set(cacheKey, svgElement);

      return svgElement.cloneNode(true);
    } catch (error) {
      console.error(`Failed to load icon: ${iconName}`, error);
      return this.createPlaceholderIcon(size);
    }
  }

  /**
   * 创建占位图标（当图标加载失败时使用）
   * @param {number} size - 图标尺寸
   * @returns {HTMLElement} SVG 元素
   */
  createPlaceholderIcon(size) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.innerHTML = '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>';
    svg.style.color = 'var(--color-text-tertiary)';
    return svg;
  }

  /**
   * 在指定容器中渲染图标
   * @param {HTMLElement} container - 容器元素
   * @param {string} iconName - 图标名称
   * @param {Object} options - 选项
   */
  async renderIcon(container, iconName, options = {}) {
    const iconElement = await this.loadIcon(iconName, options);
    container.innerHTML = '';
    container.appendChild(iconElement);
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this.iconCache.clear();
  }
}

// 导出单例
export const iconLoader = new IconLoader();

// 便捷函数
export async function loadIcon(iconName, options) {
  return iconLoader.loadIcon(iconName, options);
}

export async function renderIcon(container, iconName, options) {
  return iconLoader.renderIcon(container, iconName, options);
}
