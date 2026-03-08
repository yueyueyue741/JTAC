import { renderMainBottomNav } from '../ui/bottom-nav.js';
import { renderFloatingEntryCards } from '../ui/floating-entry-cards.js';

export function renderMainSpace(root) {
  const page = document.createElement('div');
  page.className = 'jtac-main-space';

  const topRow = document.createElement('div');
  topRow.className = 'jtac-main-space__top-row';

  const left = document.createElement('div');
  left.textContent = '当前世界：暂无 · 先从世界跃迁开始';

  const right = document.createElement('div');
  right.textContent = '管理';

  topRow.appendChild(left);
  topRow.appendChild(right);

  const floatingArea = document.createElement('div');
  floatingArea.className = 'jtac-main-space__floating-area';

  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'jtac-main-space__cards';
  renderFloatingEntryCards(cardsContainer);

  const center = document.createElement('div');
  center.className = 'jtac-main-space__center';

  const cta = document.createElement('button');
  cta.type = 'button';
  cta.className = 'jtac-main-cta';
  cta.textContent = '主神';

  const centerLabel = document.createElement('div');
  centerLabel.className = 'jtac-main-space__center-label';
  centerLabel.textContent = '点击主神按钮，进入当前世界';

  center.appendChild(cta);
  center.appendChild(centerLabel);

  floatingArea.appendChild(cardsContainer);
  floatingArea.appendChild(center);

  page.appendChild(topRow);
  page.appendChild(floatingArea);

  root.appendChild(page);

  renderMainBottomNav(document.body);
}

