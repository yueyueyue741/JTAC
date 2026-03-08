/**
 * SVG 图标加载器（Iconify 封装）
 * 规范：feather / material-symbols / tabler，fill 或 stroke 为 currentColor
 * 见 DESIGN.md Section 14
 */

const ICONIFY_BASE = 'https://api.iconify.design';

/**
 * @param {string} iconId - 如 "feather:compass"
 * @param {object} [opts] - { width, height, color }
 * @returns {Promise<string>} SVG 字符串
 */
export async function loadIcon(iconId, opts = {}) {
  const { width = 24, height = 24 } = opts;
  const url = `${ICONIFY_BASE}/${iconId.replace(':', '/')}.svg?width=${width}&height=${height}`;
  const res = await fetch(url);
  if (!res.ok) return '';
  let svg = await res.text();
  svg = svg.replace(/<svg/, '<svg fill="currentColor" stroke="currentColor"');
  return svg;
}

/**
 * @param {HTMLElement} el
 * @param {string} iconId
 * @param {object} [opts]
 */
export async function injectIcon(el, iconId, opts) {
  const svg = await loadIcon(iconId, opts);
  if (svg) el.innerHTML = svg;
}

export default { loadIcon, injectIcon };
