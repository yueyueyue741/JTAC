/**
 * 加载界面：动画、进度、品牌展示
 */

export class LoadingScreen {
  constructor() {
    this.progress = 0;
  }

  /**
   * 渲染加载界面
   * @returns {HTMLElement}
   */
  render() {
    const container = document.createElement('div');
    container.className = 'loading-screen';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--color-bg-l0);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: var(--z-l3);
    `;

    // 应用图标
    const icon = document.createElement('div');
    icon.className = 'loading-screen__icon';
    icon.style.cssText = `
      width: 64px;
      height: 64px;
      margin-bottom: var(--space-6);
      opacity: 0;
      transform: scale(0.8);
      animation: scaleIn var(--duration-enter) var(--ease-spring) forwards;
    `;
    icon.innerHTML = `
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
      </svg>
    `;

    // 应用名称
    const title = document.createElement('h1');
    title.className = 'loading-screen__title';
    title.textContent = 'JTAC快穿游戏';
    title.style.cssText = `
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin-bottom: var(--space-8);
    `;

    // 进度条
    const progressContainer = document.createElement('div');
    progressContainer.className = 'loading-screen__progress';
    progressContainer.style.cssText = `
      width: 240px;
      height: 2px;
      background: var(--color-bg-neutral-200);
      border-radius: var(--radius-full);
      overflow: hidden;
      margin-bottom: var(--space-4);
    `;

    const progressBar = document.createElement('div');
    progressBar.className = 'loading-screen__progress-bar';
    progressBar.style.cssText = `
      width: 0%;
      height: 100%;
      background: var(--color-accent-primary);
      border-radius: var(--radius-full);
      transition: width var(--duration-normal) var(--ease-out);
    `;
    progressContainer.appendChild(progressBar);

    // 副标题
    const subtitle = document.createElement('p');
    subtitle.className = 'loading-screen__subtitle';
    subtitle.textContent = '正在构建你的平行宇宙...';
    subtitle.style.cssText = `
      font-size: var(--font-size-sm);
      color: var(--color-text-tertiary);
    `;

    container.appendChild(icon);
    container.appendChild(title);
    container.appendChild(progressContainer);
    container.appendChild(subtitle);

    // 模拟进度更新
    this.updateProgress(progressBar);

    return container;
  }

  /**
   * 更新进度
   * @param {HTMLElement} progressBar - 进度条元素
   */
  updateProgress(progressBar) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 90) {
        progress = 90; // 等待实际加载完成
      }
      progressBar.style.width = `${progress}%`;
      this.progress = progress;
    }, 200);

    // 存储 interval ID，以便后续清除
    this.progressInterval = interval;
  }

  /**
   * 完成加载
   */
  complete() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }
}
