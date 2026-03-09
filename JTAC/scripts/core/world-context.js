/**
 * 世界膜：ActiveWorldContext 单例
 * 当前激活世界 ID；切换时发布 world:changed，各模块清空缓存并重载
 */

import { publish, subscribe } from './event-bus.js';
import { getLocal, setLocal } from './storage.js';

const STORAGE_KEY = 'active_world_id';

/** @type {string | null} */
let activeWorldId = getLocal(STORAGE_KEY) ?? null;

/**
 * @returns {string | null}
 */
export function getActiveWorldId() {
  return activeWorldId;
}

/**
 * @param {string | null} worldId
 */
export function activate(worldId) {
  if (activeWorldId === worldId) return;
  activeWorldId = worldId;
  setLocal(STORAGE_KEY, worldId);
  publish('world:changed', { worldId });
}

/**
 * @param {(payload: { worldId: string | null }) => void} handler
 * @returns {() => void}
 */
export function onWorldChanged(handler) {
  return subscribe('world:changed', handler);
}

export default { getActiveWorldId, activate, onWorldChanged };
