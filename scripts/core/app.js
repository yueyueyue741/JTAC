/**
 * 快穿养成游戏 · 应用初始化
 * 生命周期管理、挂载根节点
 */

const root = document.getElementById('root');
if (!root) {
  throw new Error('Missing #root element');
}

// 占位：等待 loading-screen、main-space 等模块接入
root.innerHTML = `
  <div class="app-main scroll-container" style="padding: var(--space-6); text-align: center;">
    <p style="color: var(--color-text-secondary); font-size: var(--font-size-md);">
      正在构建你的平行宇宙...
    </p>
  </div>
`;
