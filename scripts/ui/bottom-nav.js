import { createIcon } from './icon.js';

export function renderMainBottomNav(container, active = 'api') {
  const nav = document.createElement('nav');
  nav.className = 'jtac-bottom-nav';

  const items = [
    { key: 'api', label: 'API设置', icon: 'feather:sliders' },
    { key: 'system', label: '系统设置', icon: 'feather:settings' },
    { key: 'theme', label: '美化设置', icon: 'material-symbols:palette' }
  ];

  items.forEach((item) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `jtac-bottom-nav__item${item.key === active ? ' jtac-bottom-nav__item--active' : ''}`;

    const icon = createIcon(item.icon, 'jtac-bottom-nav__icon');
    const label = document.createElement('span');
    label.textContent = item.label;

    btn.appendChild(icon);
    btn.appendChild(label);

    btn.addEventListener('click', () => {
      const event = new CustomEvent('jtac:main-bottom-nav', { detail: { key: item.key } });
      window.dispatchEvent(event);
    });

    nav.appendChild(btn);
  });

  container.appendChild(nav);
}

