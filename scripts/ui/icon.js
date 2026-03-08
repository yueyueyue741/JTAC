/**
 * 快穿养成游戏 · SVG 图标加载器
 * Iconify 封装 · Section 14 规范
 * - 来源：Iconify CDN 按需加载
 * - 首选：feather, material-symbols, tabler
 * - 格式：SVG 内联 DOM，fill/stroke 为 currentColor
 */

const ICONIFY_BASE = 'https://api.iconify.design';

/**
 * 加载 Iconify 图标为 SVG 元素
 * @param {string} iconId - 格式如 "feather:compass"、"tabler:archive"
 * @param {number} [size=24] - 尺寸 px
 * @returns {Promise<SVGSVGElement|null>}
 */
export async function loadIcon(iconId, size = 24) {
  const [prefix, name] = iconId.includes(':') ? iconId.split(':') : ['feather', iconId];
  const id = `${prefix}:${name}`;
  const url = `${ICONIFY_BASE}/${prefix}/${name}.svg?height=${size}&width=${size}`;

  try {
    const res = await fetch(url);
    const svgText = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    if (!svg) return null;

    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(size));
    svg.setAttribute('fill', 'currentColor');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('icon-svg');
    return svg;
  } catch {
    return null;
  }
}

/**
 * 将图标插入到 DOM 元素中
 * @param {HTMLElement} el - 目标容器
 * @param {string} iconId
 * @param {number} [size]
 */
export async function renderIcon(el, iconId, size) {
  const svg = await loadIcon(iconId, size);
  if (svg) {
    el.innerHTML = '';
    el.appendChild(svg);
  }
}
