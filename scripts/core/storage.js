// IndexedDB + localStorage 统一封装（最小骨架版）
// 后续可按 DESIGN.md 逐步扩展为完整 world-aware 存储。

const APP_VERSION = '0.1.0';
const DB_NAME = 'jtac_fast_travel';
const DB_VERSION = 1;

let dbPromise = null;

function openDb() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('worlds')) {
          db.createObjectStore('worlds', { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  return dbPromise;
}

export async function getWorld(id) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('worlds', 'readonly');
    const store = tx.objectStore('worlds');
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function saveWorld(world) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('worlds', 'readwrite');
    const store = tx.objectStore('worlds');
    const req = store.put(world);
    req.onsuccess = () => resolve(world);
    req.onerror = () => reject(req.error);
  });
}

export function getAppConfig() {
  try {
    const raw = localStorage.getItem('jtac_app_config');
    if (!raw) {
      return {
        app_version: APP_VERSION,
        active_world_id: null,
        activeThemeId: 'default-snow-linen',
        customThemes: [],
        language: 'zh-CN',
        api_config: {},
        global_prompt_templates: []
      };
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('[storage] failed to parse app config', err);
    return {
      app_version: APP_VERSION,
      active_world_id: null,
      activeThemeId: 'default-snow-linen',
      customThemes: [],
      language: 'zh-CN',
      api_config: {},
      global_prompt_templates: []
    };
  }
}

export function saveAppConfig(config) {
  const next = { ...getAppConfig(), ...config };
  localStorage.setItem('jtac_app_config', JSON.stringify(next));
  return next;
}

