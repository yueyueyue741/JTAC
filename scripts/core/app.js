import { renderLoadingScreen } from '../modules/loading-screen.js';
import { renderMainSpace } from '../modules/main-space.js';
import { getAppConfig } from './storage.js';
import { worldContext } from './world-context.js';
import { registerRoute, navigate } from './router.js';

function registerRoutes() {
  registerRoute('loading', (root) => {
    renderLoadingScreen(root);
  });

  registerRoute('main-space', (root) => {
    renderMainSpace(root);
  });
}

async function bootstrap() {
  registerRoutes();

  const root = document.getElementById('app-root');
  if (!root) return;

  navigate('loading');

  const start = performance.now();

  const config = getAppConfig();
  if (config.active_world_id) {
    worldContext.activate(config.active_world_id);
  }

  const MIN_LOADING_MS = 1500;
  const elapsed = performance.now() - start;
  const remaining = Math.max(0, MIN_LOADING_MS - elapsed);

  setTimeout(() => {
    navigate('main-space');
  }, remaining);
}

window.addEventListener('DOMContentLoaded', () => {
  bootstrap().catch((err) => {
    console.error('[app] bootstrap error', err);
  });
});

