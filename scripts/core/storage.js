/**
 * IndexedDB + localStorage 统一封装
 * 含世界ID拦截器，确保数据隔离
 */

import { eventBus, Events } from './event-bus.js';

class StorageService {
  constructor() {
    this.db = null;
    this.dbName = 'JTACWorldDB';
    this.dbVersion = 1;
    this.currentWorldId = null;
  }

  /**
   * 初始化 IndexedDB
   * @returns {Promise<void>}
   */
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // 创建对象存储
        if (!db.objectStoreNames.contains('worlds')) {
          const worldStore = db.createObjectStore('worlds', { keyPath: 'id' });
          worldStore.createIndex('name', 'name', { unique: false });
          worldStore.createIndex('createdAt', 'meta.createdAt', { unique: false });
        }

        if (!db.objectStoreNames.contains('npcs')) {
          const npcStore = db.createObjectStore('npcs', { keyPath: 'id' });
          npcStore.createIndex('worldId', 'worldId', { unique: false });
        }

        if (!db.objectStoreNames.contains('masks')) {
          const maskStore = db.createObjectStore('masks', { keyPath: 'id' });
          maskStore.createIndex('worldId', 'worldId', { unique: false });
        }

        if (!db.objectStoreNames.contains('worldBooks')) {
          const worldBookStore = db.createObjectStore('worldBooks', { keyPath: 'id' });
          worldBookStore.createIndex('worldId', 'worldId', { unique: false });
        }

        if (!db.objectStoreNames.contains('protocols')) {
          const protocolStore = db.createObjectStore('protocols', { keyPath: 'id' });
          protocolStore.createIndex('worldId', 'worldId', { unique: false });
        }
      };
    });
  }

  /**
   * 设置当前世界ID（世界膜拦截器）
   * @param {string} worldId - 世界ID
   */
  setCurrentWorldId(worldId) {
    this.currentWorldId = worldId;
  }

  /**
   * 获取当前世界ID
   * @returns {string|null}
   */
  getCurrentWorldId() {
    return this.currentWorldId;
  }

  /**
   * 构建带世界ID前缀的键
   * @param {string} key - 原始键
   * @param {string} worldId - 世界ID（可选，默认使用当前世界ID）
   * @returns {string}
   */
  buildWorldKey(key, worldId = null) {
    const targetWorldId = worldId || this.currentWorldId;
    if (!targetWorldId) {
      throw new Error('World ID is required for world-scoped data');
    }
    return `world:${targetWorldId}:${key}`;
  }

  // ========== IndexedDB 操作 ==========

  /**
   * 保存数据到 IndexedDB
   * @param {string} storeName - 存储名称
   * @param {*} data - 数据对象
   * @returns {Promise<void>}
   */
  async save(storeName, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 从 IndexedDB 读取数据
   * @param {string} storeName - 存储名称
   * @param {string} id - 数据ID
   * @returns {Promise<*>}
   */
  async get(storeName, id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 从 IndexedDB 删除数据
   * @param {string} storeName - 存储名称
   * @param {string} id - 数据ID
   * @returns {Promise<void>}
   */
  async delete(storeName, id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 查询数据（按索引）
   * @param {string} storeName - 存储名称
   * @param {string} indexName - 索引名称
   * @param {*} value - 查询值
   * @returns {Promise<Array>}
   */
  async query(storeName, indexName, value) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 获取所有数据
   * @param {string} storeName - 存储名称
   * @returns {Promise<Array>}
   */
  async getAll(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // ========== localStorage 操作 ==========

  /**
   * 保存到 localStorage
   * @param {string} key - 键
   * @param {*} value - 值
   */
  setLocal(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  /**
   * 从 localStorage 读取
   * @param {string} key - 键
   * @param {*} defaultValue - 默认值
   * @returns {*}
   */
  getLocal(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return defaultValue;
    }
  }

  /**
   * 从 localStorage 删除
   * @param {string} key - 键
   */
  removeLocal(key) {
    localStorage.removeItem(key);
  }

  /**
   * 清空 localStorage
   */
  clearLocal() {
    localStorage.clear();
  }
}

// 导出单例
export const storage = new StorageService();
