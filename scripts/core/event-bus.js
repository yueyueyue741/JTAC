// 简单双向事件总线，供各模块解耦通信

const listeners = new Map();

export function on(eventName, handler) {
  if (!listeners.has(eventName)) {
    listeners.set(eventName, new Set());
  }
  listeners.get(eventName).add(handler);
  return () => off(eventName, handler);
}

export function off(eventName, handler) {
  const set = listeners.get(eventName);
  if (!set) return;
  set.delete(handler);
  if (set.size === 0) {
    listeners.delete(eventName);
  }
}

export function emit(eventName, payload) {
  const set = listeners.get(eventName);
  if (!set) return;
  for (const handler of Array.from(set)) {
    try {
      handler(payload);
    } catch (err) {
      console.error('[EventBus] handler error for', eventName, err);
    }
  }
}

