/**
 * 全局事件总线（发布/订阅）
 * 世界膜切换时发布 world:changed，各模块订阅并清空缓存
 */

const topics = new Map();

/**
 * @param {string} topic
 * @param {(payload?: unknown) => void} handler
 */
export function subscribe(topic, handler) {
  if (!topics.has(topic)) topics.set(topic, []);
  topics.get(topic).push(handler);
  return () => {
    const list = topics.get(topic);
    if (list) list.splice(list.indexOf(handler), 1);
  };
}

/**
 * @param {string} topic
 * @param {unknown} [payload]
 */
export function publish(topic, payload) {
  (topics.get(topic) || []).forEach((fn) => fn(payload));
}

export default { subscribe, publish };
