/**
 * AI 请求调度、密钥池轮询、上下文注入
 * 从 WorldContext 取世界书+协议+当前面具，组装系统提示词
 */

import { getActiveWorldId } from './world-context.js';
import { getWorld } from './storage.js';

/**
 * @param {object} opts
 * @param {string} opts.model
 * @param {Array<{role: string; content: string}>} opts.messages
 * @param {AbortSignal} [opts.signal]
 * @returns {Promise<string>}
 */
export async function dispatchChat(opts) {
  const worldId = getActiveWorldId();
  const world = worldId ? await getWorld(worldId) : null;
  const systemPrefix = world ? buildSystemPrefix(world) : '';
  const messages = systemPrefix
    ? [{ role: 'system', content: systemPrefix }, ...opts.messages]
    : opts.messages;
  // TODO: 从 api_config 取密钥与 endpoint，发起 fetch
  return Promise.resolve('[AI 调度器占位]');
}

/**
 * @param {object} world
 * @returns {string}
 */
function buildSystemPrefix(world) {
  const parts = [];
  if (world.globalProtocols?.length) {
    parts.push('## 全局协议\n' + world.globalProtocols.filter((p) => p.isEnabled).map((p) => p.content).join('\n\n'));
  }
  if (world.worldBook?.length) {
    parts.push('## 世界书\n' + world.worldBook.filter((e) => e.isEnabled).slice(0, 20).map((e) => e.content).join('\n\n'));
  }
  return parts.join('\n\n');
}

export default { dispatchChat };
