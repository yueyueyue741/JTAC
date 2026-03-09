/**
 * IndexedDB + localStorage 统一封装
 * 含世界ID拦截器：读写自动追加 worldId 前缀，实现世界膜隔离
 */

const DB_NAME = 'jtac-worlds';
const DB_VERSION = 1;
const WORLD_STORE = 'worlds';

/** @type {IDBDatabase | null} */
let db = null;

/**
 * @returns {Promise<IDBDatabase>}
 */
export function openDB() {
  if (db) return Promise.resolve(db);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => {
      db = req.result;
      resolve(db);
    };
    req.onupgradeneeded = (e) => {
      const database = e.target.result;
      if (!database.objectStoreNames.contains(WORLD_STORE)) {
        database.createObjectStore(WORLD_STORE, { keyPath: 'id' });
      }
    };
  });
}

/**
 * 世界数据读写（经世界膜过滤后调用）
 * @param {string} worldId
 * @param {object} data
 */
export async function saveWorld(worldId, data) {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(WORLD_STORE, 'readwrite');
    const store = tx.objectStore(WORLD_STORE);
    store.put({ ...data, id: worldId });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * @param {string} worldId
 * @returns {Promise<object | null>}
 */
export async function getWorld(worldId) {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(WORLD_STORE, 'readonly');
    const req = tx.objectStore(WORLD_STORE).get(worldId);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

/**
 * @returns {Promise<string[]>}
 */
export async function getAllWorldIds() {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(WORLD_STORE, 'readonly');
    const req = tx.objectStore(WORLD_STORE).getAllKeys();
    req.onsuccess = () => resolve(/** @type {string[]} */ (req.result));
    req.onerror = () => reject(req.error);
  });
}

const LOCAL_KEYS = ['app_version', 'active_world_id', 'activeThemeId', 'customThemes', 'language', 'api_config', 'global_prompt_templates'];

/**
 * @param {string} key
 * @param {unknown} value
 */
export function setLocal(key, value) {
  if (!LOCAL_KEYS.includes(key)) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {}
}

/**
 * @param {string} key
 * @param {unknown} [defaultValue]
 * @returns {unknown}
 */
export function getLocal(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    return raw != null ? JSON.parse(raw) : defaultValue;
  } catch (_) {
    return defaultValue;
  }
}

export default { openDB, saveWorld, getWorld, getAllWorldIds, setLocal, getLocal };
