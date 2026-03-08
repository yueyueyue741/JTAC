/**
 * 全局事件总线（发布/订阅模式）
 * 用于模块间解耦通信
 */

class EventBus {
  constructor() {
    this.events = new Map();
  }

  /**
   * 订阅事件
   * @param {string} eventName - 事件名称
   * @param {Function} callback - 回调函数
   * @returns {Function} 取消订阅函数
   */
  on(eventName, callback) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    
    const callbacks = this.events.get(eventName);
    callbacks.push(callback);

    // 返回取消订阅函数
    return () => {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  /**
   * 订阅事件（仅触发一次）
   * @param {string} eventName - 事件名称
   * @param {Function} callback - 回调函数
   */
  once(eventName, callback) {
    const wrapper = (...args) => {
      callback(...args);
      this.off(eventName, wrapper);
    };
    this.on(eventName, wrapper);
  }

  /**
   * 取消订阅
   * @param {string} eventName - 事件名称
   * @param {Function} callback - 回调函数（可选，不提供则取消该事件所有订阅）
   */
  off(eventName, callback) {
    if (!this.events.has(eventName)) {
      return;
    }

    if (callback) {
      const callbacks = this.events.get(eventName);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    } else {
      // 移除该事件的所有订阅
      this.events.delete(eventName);
    }
  }

  /**
   * 发布事件
   * @param {string} eventName - 事件名称
   * @param {*} data - 事件数据
   */
  emit(eventName, data) {
    if (!this.events.has(eventName)) {
      return;
    }

    const callbacks = this.events.get(eventName);
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event callback for ${eventName}:`, error);
      }
    });
  }

  /**
   * 清除所有事件订阅
   */
  clear() {
    this.events.clear();
  }
}

// 导出单例
export const eventBus = new EventBus();

// 常用事件名称常量
export const Events = {
  WORLD_CHANGED: 'world:changed',
  WORLD_CREATED: 'world:created',
  WORLD_DELETED: 'world:deleted',
  MASK_CHANGED: 'mask:changed',
  THEME_CHANGED: 'theme:changed',
  API_CONFIG_CHANGED: 'api:config:changed',
  STORAGE_READY: 'storage:ready',
  APP_READY: 'app:ready',
};
