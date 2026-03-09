/** 主空间：悬浮入口卡片、4项底部栏（含玩家主页）、批量管理。见 Section 7.2 */
/**
 * 模块导出接口与职责约定（当前仅文档说明，部分 API 将在后续批次实现）：
 *
 * 1. initMainSpace(root, deps)
 *    - 参数：
 *      - root: HTMLElement
 *        挂载主空间视图的根容器，一般为 .app-main-space 内部节点。
 *      - deps: {
 *          eventBus,    // scripts/core/event-bus.js 提供的发布/订阅实例
 *          storage,     // scripts/core/storage.js 封装（含 localStorage & IndexedDB）
 *          themeEngine, // scripts/modules/theme-engine.js 导出的主题应用接口
 *          appState     // 顶层 AppState 引用，至少包含 appState.mainSpace 分支
 *        }
 *    - 职责：
 *      - 从 localStorage 读取主空间相关键值：
 *        - main_space_active_tab
 *        - main_space_floating_entries
 *        - main_space_background
 *      - 将读取结果与默认配置合并后写入 appState.mainSpace；
 *      - 调用本文件内的 render(root, options) 完成一次性挂载；
 *      - 订阅 'ui:mainSpaceTabChanged' 事件，更新 appState.mainSpace.activeTab 并持久化；
 *      - 在主题切换时响应 themeEngine 事件（例如 'theme:changed'），刷新主空间背景外观。
 *
 * 2. resetFloatingEntryLayoutToDefault()
 *    - 无参数；
 *    - 职责：
 *      - 清除与主空间悬浮入口布局相关的 localStorage 键：
 *        - main_space_floating_entries
 *      - 保留入口 ID 顺序与文案等静态配置；
 *      - 通过 eventBus 发布 'ui:floatingEntryLayoutReset' 事件，
 *        由当前激活的 main-space 视图重新按默认布局渲染入口位置。
 *
 * 3. render(root, options)
 *    - 当前已实现，负责：
 *      - 在传入 root 下创建主空间 DOM 壳结构（粒子层 + 内容层 + 悬浮入口层）；
 *      - 委托 ui/floating-entry-cards.js 渲染悬浮入口；
 *      - 委托 ui/bottom-nav.js 渲染主空间底部 4 项 Tab。
 *
 * 注意：
 * - 本模块不直接发起 AI 请求，不直接操作 IndexedDB 主数据，只通过 storage 与 themeEngine 协作；
 * - 后续实现必须遵守上述事件名与 localStorage 键名，以与 AppState.mainSpace 定义对齐。
 */

import { render as renderFloatingEntries, DEFAULT_FLOATING_ENTRIES } from '../ui/floating-entry-cards.js';
import { render as renderBottomNav } from '../ui/bottom-nav.js';

/**
 * 挂载主空间视图
 * 仅负责壳结构 + 悬浮入口 + 主空间底部 4 个 Tab，
 * 具体 Tab 内容由上层根据回调决定渲染哪个模块
 *
 * @param {HTMLElement} root - 主空间根容器
 * @param {{
 *   bottomNavRoot?: HTMLElement,
 *   activeTab?: string,
 *   onTabChange?: (id: string) => void,
 *   onEntryClick?: (id: string) => void
 * }} [options]
 */
export function render(root, options = {}) {
  if (!root) return;
  const {
    bottomNavRoot,
    activeTab = 'player',
    onTabChange,
    onEntryClick
  } = options;

  root.innerHTML = '';

  const main = document.createElement('div');
  main.className = 'main-space';

  const particlesLayer = document.createElement('div');
  particlesLayer.className = 'main-space-particles';
  main.appendChild(particlesLayer);

  const contentLayer = document.createElement('div');
  contentLayer.className = 'main-space-content';

  const entriesLayer = document.createElement('div');
  entriesLayer.className = 'main-space-entries';
  contentLayer.appendChild(entriesLayer);

  main.appendChild(contentLayer);
  root.appendChild(main);

  renderFloatingEntries(entriesLayer, {
    entries: DEFAULT_FLOATING_ENTRIES,
    onEntryClick
  });

  if (bottomNavRoot) {
    renderBottomNav(bottomNavRoot, {
      activeTab,
      onTabChange
    });
  }
}

export default { render };
