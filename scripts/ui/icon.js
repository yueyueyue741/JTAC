// Iconify SVG 图标的简单封装

export function createIcon(name, className = '') {
  const span = document.createElement('span');
  span.className = `iconify ${className}`.trim();
  span.setAttribute('data-icon', name);
  span.setAttribute('aria-hidden', 'true');
  return span;
}

