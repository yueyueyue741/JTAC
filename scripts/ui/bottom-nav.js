/** 底部导航栏（主空间4 Tab / 世界内6 Tab）。见 Section 7.2.5、16.2 */
/**
 * 模块 API 与事件约定（当前文件实现主空间 4 Tab，世界内 6 Tab 由 tab-nav.js 负责）：
 *
 * 主空间态：
 * - 渲染函数：render(root, { activeTab?, onTabChange? })
 *   - activeTab: "player" | "api" | "system" | "theme"
 *     - 与 AppState.mainSpace.activeTab 对齐；
 *     - 默认值为 "player"，并与 localStorage.main_space_active_tab 同步（由上层负责）。
 *   - onTabChange: (id: string) => void
 *     - 仅在点击与当前 activeTab 不同的 Tab 时触发；
 *     - 典型实现：通过 eventBus 发布 'ui:mainSpaceTabChanged' 事件。
 *
 * 事件总线约定：
 * - 'ui:mainSpaceTabChanged'
 *   - 触发时机：用户在主空间底部 4 Tab 之间切换时，由上层在 onTabChange 中发布；
 *   - 事件负载：
 *     {
 *       tabId: "player" | "api" | "system" | "theme",
 *       previousTab: string | null
 *     }
 *   - 订阅方：router.js / main-space.js / 各主空间模块（玩家主页、API 设置、系统设置、美化设置）。
 *
 * 世界内态：
 * - 世界内 6 Tab（地图/剧情/聊天/乐博通/密书/更多）统一由 scripts/ui/tab-nav.js 渲染，
 *   本模块不直接负责世界内导航，只在主空间中出现，以强调“主空间 vs 世界内”的清晰分界。
 */

const MAIN_SPACE_TABS = [
  { id: 'player', label: '玩家主页', iconSlot: 'mainTab.player' },
  { id: 'api', label: 'API 设置', iconSlot: 'mainTab.api' },
  { id: 'system', label: '系统设置', iconSlot: 'mainTab.system' },
  { id: 'theme', label: '美化设置', iconSlot: 'mainTab.theme' }
];

/**
 * 渲染主空间底部导航栏
 * @param {HTMLElement} root - 承载导航的容器，一般放在 .bottom-nav-area 内部
 * @param {{ activeTab?: string, onTabChange?: (id: string) => void }} [options]
 */
export function render(root, options = {}) {
  if (!root) return;
  const { activeTab = 'player', onTabChange } = options;

  root.innerHTML = '';

  const nav = document.createElement('nav');
  nav.className = 'bottom-nav bottom-nav--main-space';

  MAIN_SPACE_TABS.forEach((tab) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'bottom-nav__item';
    button.dataset.tabId = tab.id;

    if (tab.id === activeTab) {
      button.classList.add('bottom-nav__item--active');
    }

    const iconContainer = document.createElement('span');
    iconContainer.className = 'bottom-nav__icon';
    iconContainer.dataset.iconSlot = tab.iconSlot;

    const label = document.createElement('span');
    label.className = 'bottom-nav__label';
    label.textContent = tab.label;

    button.appendChild(iconContainer);
    button.appendChild(label);

    button.addEventListener('click', () => {
      if (tab.id === activeTab) return;
      if (typeof onTabChange === 'function') {
        onTabChange(tab.id);
      }
    });

    nav.appendChild(button);
  });

  root.appendChild(nav);
}

export default { render };
