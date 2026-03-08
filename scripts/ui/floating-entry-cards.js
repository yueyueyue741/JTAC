import { createIcon } from './icon.js';

const STORAGE_KEY = 'jtac_floating_cards_layout';

const DEFAULT_CARDS = [
  { key: 'world-transition', title: '世界跃迁', subtitle: '开启新世界/世界选择器', icon: 'feather:compass' },
  { key: 'world-archive', title: '世界档案', subtitle: '管理所有世界存档', icon: 'feather:archive' },
  { key: 'lebotalk', title: '乐博通', subtitle: '世界舆论场', icon: 'tabler:message-circle' },
  { key: 'mishu', title: '密书', subtitle: '兴趣圈与图集', icon: 'tabler:notebook' }
];

function loadLayout() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveLayout(order) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
}

export function renderFloatingEntryCards(container) {
  const wrapper = document.createElement('div');
  wrapper.className = 'jtac-floating-card-grid';

  const layout = loadLayout();
  const cards = layout
    ? layout.map((key) => DEFAULT_CARDS.find((c) => c.key === key)).filter(Boolean)
    : DEFAULT_CARDS.slice();

  cards.forEach((card) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'jtac-floating-card';
    el.dataset.key = card.key;

    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '8px';

    const icon = createIcon(card.icon);
    row.appendChild(icon);

    const textCol = document.createElement('div');
    const title = document.createElement('div');
    title.className = 'jtac-floating-card__title';
    title.textContent = card.title;
    const subtitle = document.createElement('div');
    subtitle.className = 'jtac-floating-card__subtitle';
    subtitle.textContent = card.subtitle;
    textCol.appendChild(title);
    textCol.appendChild(subtitle);

    row.appendChild(textCol);
    el.appendChild(row);

    el.addEventListener('click', () => {
      const event = new CustomEvent('jtac:floating-card-click', { detail: { key: card.key } });
      window.dispatchEvent(event);
    });

    wrapper.appendChild(el);
  });

  container.appendChild(wrapper);

  // 布局记录预留（后续可接入拖拽）
  const order = cards.map((c) => c.key);
  saveLayout(order);
}

