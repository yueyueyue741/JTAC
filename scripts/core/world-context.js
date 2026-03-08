// ActiveWorldContext 单例：承载当前世界膜状态
// 目前实现最小可用版本，仅管理 activeWorldId 与简单订阅。

import { emit } from './event-bus.js';

class WorldContext {
  constructor() {
    this.activeWorldId = null;
  }

  getActiveWorldId() {
    return this.activeWorldId;
  }

  activate(worldId) {
    if (this.activeWorldId === worldId) return;
    this.activeWorldId = worldId;
    emit('world:changed', { worldId });
  }
}

export const worldContext = new WorldContext();

