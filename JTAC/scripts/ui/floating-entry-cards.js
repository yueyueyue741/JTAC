/** 主空间悬浮入口卡片（世界跃迁/世界档案/世界文件/乐博通/密书/购购购）。见 Section 7.2.3 */
/**
 * 组件接口与协作原则（文档约定，当前导出 render，后续可增加工厂函数）：
 *
 * createFloatingEntryLayer(root, options)
 * - root: HTMLElement
 *   悬浮入口挂载容器，一般为 main-space.js 内部的 .main-space-entries 节点。
 * - options: {
 *     entries?: FloatingEntryConfig[],        // 入口配置数组，若缺省则从 DEFAULT_FLOATING_ENTRIES 派生
 *     onEntryClick?: (id: string) => void,    // 点击单个入口时回调，由上层决定打开哪个模块
 *     onLayoutChange?: (entries: FloatingEntryConfig[]) => void
 *                                            // 拖动完成后触发，将最新布局（含相对坐标）回传给上层
 *   }
 *
 * FloatingEntryConfig（与 DESIGN 文档中的 FloatingEntryConfig 一致）：
 * {
 *   id: 'world-transition' | 'world-archive' | 'world-files' | 'lebotalk' | 'mishu' | 'market',
 *   label: string,
 *   iconSlot: string,     // 如 'mainSpace.entry.worldTransition'，交由 icon.js 解析
 *   x: number,            // 可选，0–1，表示相对画布宽度的水平位置
 *   y: number             // 可选，0–1，表示相对画布高度的垂直位置
 * }
 *
 * 协作与约束：
 * - 本组件只负责 DOM 结构与交互回调，不直接读写 localStorage 或 IndexedDB；
 * - 布局的持久化由上层（main-space.js / storage.js）完成，通过 onLayoutChange 回调传递数据；
 * - 不订阅全局事件总线，仅在需要时由上层注入事件处理；
 * - 视觉样式完全通过 components.css 中的 .main-space-orb* / 玻璃圆形图标规范实现，禁止在此处硬编码样式。
 */

const ENTRY_IDS = {
  WORLD_TRANSITION: 'world-transition',
  WORLD_ARCHIVE: 'world-archive',
  WORLD_FILES: 'world-files',
  LEBOTALK: 'lebotalk',
  MISHU: 'mishu',
  MARKET: 'market'
};

/**
 * 默认入口配置，仅用于主空间初始布局
 */
export const DEFAULT_FLOATING_ENTRIES = [
  {
    id: ENTRY_IDS.WORLD_TRANSITION,
    label: '世界跃迁',
    iconSlot: 'mainSpace.entry.worldTransition'
  },
  {
    id: ENTRY_IDS.WORLD_ARCHIVE,
    label: '世界档案',
    iconSlot: 'mainSpace.entry.worldArchive'
  },
  {
    id: ENTRY_IDS.WORLD_FILES,
    label: '世界文件',
    iconSlot: 'mainSpace.entry.worldFiles'
  },
  {
    id: ENTRY_IDS.LEBOTALK,
    label: '乐博通',
    iconSlot: 'mainSpace.entry.lebotalk'
  },
  {
    id: ENTRY_IDS.MISHU,
    label: '密书',
    iconSlot: 'mainSpace.entry.mishu'
  },
  {
    id: ENTRY_IDS.MARKET,
    label: '购购购',
    iconSlot: 'mainSpace.entry.market'
  }
];

/**
 * 渲染主空间悬浮入口层
 * 当前仅负责创建静态玻璃圆形图标与点击事件，拖拽与位置存储留待后续实现
 *
 * @param {HTMLElement} root - 悬浮入口挂载容器
 * @param {{ entries?: Array<{id: string, label: string, iconSlot: string}>, onEntryClick?: (id: string) => void }} [options]
 */
export function render(root, options = {}) {
  if (!root) return;
  const { entries = DEFAULT_FLOATING_ENTRIES, onEntryClick } = options;

  root.innerHTML = '';

  entries.forEach((entry) => {
    const wrapper = document.createElement('button');
    wrapper.type = 'button';
    wrapper.className = 'main-space-orb';
    wrapper.dataset.entryId = entry.id;

    const iconContainer = document.createElement('span');
    iconContainer.className = 'main-space-orb__icon';
    iconContainer.dataset.iconSlot = entry.iconSlot;

    const label = document.createElement('span');
    label.className = 'main-space-orb__label';
    label.textContent = entry.label;

    wrapper.appendChild(iconContainer);
    wrapper.appendChild(label);

    wrapper.addEventListener('click', () => {
      if (typeof onEntryClick === 'function') {
        onEntryClick(entry.id);
      }
    });

    root.appendChild(wrapper);
  });
}

export default { render, ENTRY_IDS, DEFAULT_FLOATING_ENTRIES };
