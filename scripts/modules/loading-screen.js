import { createIcon } from '../ui/icon.js';

export function renderLoadingScreen(root) {
  const wrap = document.createElement('div');
  wrap.className = 'jtac-loading-screen';

  const iconWrap = document.createElement('div');
  iconWrap.className = 'jtac-loading-screen__icon';
  const icon = createIcon('tabler:sparkles');
  iconWrap.appendChild(icon);

  const title = document.createElement('div');
  title.className = 'jtac-loading-screen__title';
  title.textContent = 'JTAC快穿养成';

  const subtitle = document.createElement('div');
  subtitle.className = 'jtac-loading-screen__subtitle';
  subtitle.textContent = '正在构建你的平行宇宙...';

  const bar = document.createElement('div');
  bar.className = 'jtac-loading-screen__progress';
  const inner = document.createElement('div');
  inner.className = 'jtac-loading-screen__progress-bar';
  bar.appendChild(inner);

  wrap.appendChild(iconWrap);
  wrap.appendChild(title);
  wrap.appendChild(subtitle);
  wrap.appendChild(bar);

  root.appendChild(wrap);
}

