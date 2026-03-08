/**
 * 应用初始化、生命周期管理
 */

import { storage } from './storage.js';
import { worldContext } from './world-context.js';
import { aiDispatcher } from './ai-dispatcher.js';
import { router } from './router.js';
import { eventBus, Events } from './event-bus.js';

class App {
  constructor() {
    this.isReady = false;
    this.rootElement = null;
  }

  /**
   * 初始化应用
   * @returns {Promise<void>}
   */
  async init() {
    try {
      // 1. 初始化 IndexedDB
      console.log('Initializing storage...');
      await storage.init();
      eventBus.emit(Events.STORAGE_READY);

      // 2. 初始化 AI 调度器
      console.log('Initializing AI dispatcher...');
      aiDispatcher.init();

      // 3. 加载全局配置
      const globalConfig = storage.getLocal('app_config', {
        active_world_id: null,
        activeThemeId: 'default-snow-linen',
        language: 'zh-CN',
      });

      // 4. 激活世界（如果有）
      if (globalConfig.active_world_id) {
        await worldContext.activate(globalConfig.active_world_id);
      }

      // 5. 初始化路由
      this.rootElement = document.getElementById('app-root');
      if (this.rootElement) {
        router.init(this.rootElement);
      }

      // 6. 注册默认路由
      this.registerRoutes();

      // 7. 标记应用就绪
      this.isReady = true;
      eventBus.emit(Events.APP_READY);

      console.log('App initialized successfully');
    } catch (error) {
      console.error('Failed to initialize app:', error);
      throw error;
    }
  }

  /**
   * 注册默认路由
   */
  registerRoutes() {
    // 主空间路由
    router.route('/', async () => {
      // 动态导入主空间模块
      const { MainSpace } = await import('../modules/main-space.js');
      const mainSpace = new MainSpace();
      return mainSpace.render();
    });

    // 加载界面路由
    router.route('/loading', async () => {
      const { LoadingScreen } = await import('../modules/loading-screen.js');
      const loadingScreen = new LoadingScreen();
      return loadingScreen.render();
    });
  }

  /**
   * 启动应用
   */
  async start() {
    // 显示加载界面
    router.navigate('/loading', true);

    // 等待最短展示时间（1500ms）
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 初始化应用
    await this.init();

    // 导航到主空间
    router.navigate('/', true);
  }
}

// 创建应用实例并启动
const app = new App();

// DOM 加载完成后启动
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    app.start();
  });
} else {
  app.start();
}

export default app;
