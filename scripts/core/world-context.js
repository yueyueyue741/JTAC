/**
 * 世界膜（World Membrane）单例
 * ActiveWorldContext - 负责世界切换、数据隔离、上下文构建
 */

import { eventBus, Events } from './event-bus.js';
import { storage } from './storage.js';

class WorldContext {
  constructor() {
    this.activeWorldId = null;
    this.activeMaskId = null;
    this.worldCache = new Map();
    this.npcCache = new Map();
    this.maskCache = new Map();
  }

  /**
   * 激活世界（切换世界）
   * @param {string} worldId - 世界ID
   * @returns {Promise<void>}
   */
  async activate(worldId) {
    if (this.activeWorldId === worldId) {
      return; // 已经是当前世界，无需切换
    }

    // 保存当前世界快照（如果存在）
    if (this.activeWorldId) {
      await this.saveSnapshot(this.activeWorldId);
    }

    // 清空缓存（上下文锁）
    this.clearCache();

    // 设置新的活动世界
    this.activeWorldId = worldId;
    storage.setCurrentWorldId(worldId);

    // 从数据库加载世界数据
    await this.loadWorldData(worldId);

    // 发布世界切换事件
    eventBus.emit(Events.WORLD_CHANGED, {
      worldId,
      previousWorldId: this.activeWorldId,
    });
  }

  /**
   * 获取当前活动世界ID
   * @returns {string|null}
   */
  getActiveWorldId() {
    return this.activeWorldId;
  }

  /**
   * 获取当前活动世界数据
   * @returns {Promise<Object|null>}
   */
  async getActiveWorld() {
    if (!this.activeWorldId) {
      return null;
    }

    if (this.worldCache.has(this.activeWorldId)) {
      return this.worldCache.get(this.activeWorldId);
    }

    const world = await storage.get('worlds', this.activeWorldId);
    if (world) {
      this.worldCache.set(this.activeWorldId, world);
    }
    return world;
  }

  /**
   * 加载世界数据
   * @param {string} worldId - 世界ID
   * @returns {Promise<void>}
   */
  async loadWorldData(worldId) {
    // 加载世界基础信息
    const world = await storage.get('worlds', worldId);
    if (world) {
      this.worldCache.set(worldId, world);
    }

    // 加载 NPC 列表
    const npcs = await storage.query('npcs', 'worldId', worldId);
    npcs.forEach(npc => {
      this.npcCache.set(npc.id, npc);
    });

    // 加载 Mask 列表
    const masks = await storage.query('masks', 'worldId', worldId);
    masks.forEach(mask => {
      this.maskCache.set(mask.id, mask);
    });
  }

  /**
   * 清空缓存（上下文锁）
   */
  clearCache() {
    this.worldCache.clear();
    this.npcCache.clear();
    this.maskCache.clear();
  }

  /**
   * 保存世界快照
   * @param {string} worldId - 世界ID
   * @returns {Promise<void>}
   */
  async saveSnapshot(worldId) {
    // TODO: 实现世界快照保存逻辑
    // 包括：对话上下文、地图激活状态、记忆注入列表等
  }

  /**
   * 恢复世界快照
   * @param {string} worldId - 世界ID
   * @returns {Promise<void>}
   */
  async restoreSnapshot(worldId) {
    // TODO: 实现世界快照恢复逻辑
  }

  /**
   * 设置活动 Mask
   * @param {string} maskId - Mask ID
   */
  setActiveMask(maskId) {
    this.activeMaskId = maskId;
    eventBus.emit(Events.MASK_CHANGED, { maskId });
  }

  /**
   * 获取活动 Mask
   * @returns {Promise<Object|null>}
   */
  async getActiveMask() {
    if (!this.activeMaskId) {
      return null;
    }

    if (this.maskCache.has(this.activeMaskId)) {
      return this.maskCache.get(this.activeMaskId);
    }

    const mask = await storage.get('masks', this.activeMaskId);
    if (mask) {
      this.maskCache.set(this.activeMaskId, mask);
    }
    return mask;
  }

  /**
   * 构建 AI 上下文（用于 AI 调用）
   * @returns {Promise<string>} 组装好的系统提示词
   */
  async buildAIContext() {
    const world = await this.getActiveWorld();
    if (!world) {
      return '';
    }

    const contextParts = [];

    // L0: 世界观（如果有绑定）
    // TODO: 从提示词库加载世界观

    // L1: 全局协议
    const protocols = await storage.query('protocols', 'worldId', this.activeWorldId);
    const enabledProtocols = protocols
      .filter(p => p.isEnabled)
      .sort((a, b) => b.priority - a.priority);
    
    if (enabledProtocols.length > 0) {
      contextParts.push('=== 全局协议 ===');
      enabledProtocols.forEach(p => {
        contextParts.push(`${p.title}: ${p.content}`);
      });
    }

    // L2: NPC 角色人设（智能选择）
    // TODO: 实现 NPC 智能选择算法

    // L3: 工作记忆（最近 N 条对话）
    // TODO: 从 chatHistory 加载

    // L4: 当前激活 Mask
    const activeMask = await this.getActiveMask();
    if (activeMask) {
      contextParts.push('=== 当前人设 ===');
      contextParts.push(`姓名: ${activeMask.name}`);
      contextParts.push(`人设: ${activeMask.persona}`);
      contextParts.push(`初始身份: ${activeMask.initialIdentity}`);
    }

    // L5: 世界书条目
    const worldBooks = await storage.query('worldBooks', 'worldId', this.activeWorldId);
    const enabledBooks = worldBooks.filter(b => b.isEnabled);
    if (enabledBooks.length > 0) {
      contextParts.push('=== 世界书 ===');
      enabledBooks.forEach(b => {
        contextParts.push(`${b.title}: ${b.content}`);
      });
    }

    return contextParts.join('\n\n');
  }
}

// 导出单例
export const worldContext = new WorldContext();
