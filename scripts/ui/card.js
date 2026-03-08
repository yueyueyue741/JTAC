/**
 * 世界/NPC/面具卡片组件
 */

import { iconLoader } from './icon.js';

export class Card {
  /**
   * 创建世界卡片
   * @param {Object} worldData - 世界数据
   * @param {Object} options - 选项
   * @returns {HTMLElement}
   */
  static async createWorldCard(worldData, options = {}) {
    const { onClick, onLongPress } = options;
    
    const card = document.createElement('div');
    card.className = 'world-card';
    
    // 封面区
    const cover = document.createElement('div');
    cover.className = 'world-card__cover';
    
    if (worldData.coverImage) {
      const img = document.createElement('img');
      img.src = worldData.coverImage;
      img.alt = worldData.name;
      cover.appendChild(img);
    } else if (worldData.coverGradient && worldData.coverGradient.length >= 2) {
      cover.style.background = `linear-gradient(135deg, ${worldData.coverGradient[0]}, ${worldData.coverGradient[1]})`;
    } else {
      cover.style.background = `linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))`;
    }
    
    // 状态指示器
    if (worldData.meta && worldData.meta.lastPlayedAt) {
      const statusDot = document.createElement('div');
      statusDot.className = 'world-card__status';
      statusDot.style.cssText = `
        position: absolute;
        top: var(--space-2);
        right: var(--space-2);
        width: 8px;
        height: 8px;
        border-radius: var(--radius-full);
        background: var(--color-semantic-success);
        box-shadow: 0 0 0 2px var(--color-bg-l1);
      `;
      cover.appendChild(statusDot);
    }
    
    card.appendChild(cover);
    
    // 内容区
    const content = document.createElement('div');
    content.className = 'world-card__content';
    
    // 标题
    const title = document.createElement('div');
    title.className = 'world-card__title';
    title.textContent = worldData.name || '未命名世界';
    content.appendChild(title);
    
    // 副标题
    if (worldData.subtitle) {
      const subtitle = document.createElement('div');
      subtitle.className = 'world-card__subtitle';
      subtitle.textContent = worldData.subtitle;
      content.appendChild(subtitle);
    }
    
    // 标签组
    if (worldData.genre && worldData.genre.length > 0) {
      const tags = document.createElement('div');
      tags.className = 'world-card__tags';
      
      worldData.genre.slice(0, 3).forEach(genre => {
        const tag = document.createElement('span');
        tag.className = 'world-card__tag';
        tag.textContent = genre;
        tags.appendChild(tag);
      });
      
      content.appendChild(tags);
    }
    
    // 最后游玩时间
    if (worldData.meta && worldData.meta.lastPlayedAt) {
      const lastPlayed = document.createElement('div');
      lastPlayed.className = 'world-card__meta';
      lastPlayed.style.cssText = `
        font-size: var(--font-size-xs);
        color: var(--color-text-tertiary);
        margin-top: var(--space-2);
      `;
      const date = new Date(worldData.meta.lastPlayedAt);
      lastPlayed.textContent = `最后游玩: ${date.toLocaleDateString('zh-CN')}`;
      content.appendChild(lastPlayed);
    }
    
    card.appendChild(content);
    
    // 事件绑定
    if (onClick) {
      card.addEventListener('click', onClick);
    }
    
    if (onLongPress) {
      let longPressTimer = null;
      card.addEventListener('mousedown', () => {
        longPressTimer = setTimeout(() => {
          onLongPress();
        }, 500);
      });
      card.addEventListener('mouseup', () => {
        if (longPressTimer) {
          clearTimeout(longPressTimer);
        }
      });
      card.addEventListener('mouseleave', () => {
        if (longPressTimer) {
          clearTimeout(longPressTimer);
        }
      });
    }
    
    return card;
  }

  /**
   * 创建 NPC 卡片
   * @param {Object} npcData - NPC 数据
   * @param {Object} options - 选项
   * @returns {HTMLElement}
   */
  static async createNPCCard(npcData, options = {}) {
    const { onClick } = options;
    
    const card = document.createElement('div');
    card.className = 'card';
    
    // 头部：头像 + 信息
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-3);
    `;
    
    // 头像
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    if (npcData.avatar) {
      const img = document.createElement('img');
      img.src = npcData.avatar;
      img.alt = npcData.name;
      avatar.appendChild(img);
    } else {
      avatar.style.background = `linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))`;
    }
    header.appendChild(avatar);
    
    // 信息
    const info = document.createElement('div');
    info.style.flex = '1';
    
    const name = document.createElement('div');
    name.style.cssText = `
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin-bottom: var(--space-1);
    `;
    name.textContent = npcData.name || '未命名NPC';
    info.appendChild(name);
    
    if (npcData.identityTag) {
      const tag = document.createElement('span');
      tag.style.cssText = `
        font-size: var(--font-size-xs);
        color: var(--color-text-secondary);
        background: var(--color-bg-neutral-100);
        padding: 2px var(--space-2);
        border-radius: var(--radius-sm);
      `;
      tag.textContent = npcData.identityTag;
      info.appendChild(tag);
    }
    
    header.appendChild(info);
    card.appendChild(header);
    
    // 状态徽标
    if (npcData.currentStatus) {
      const status = document.createElement('div');
      status.style.cssText = `
        font-size: var(--font-size-xs);
        color: var(--color-text-tertiary);
        margin-top: var(--space-2);
      `;
      status.textContent = `状态: ${npcData.currentStatus}`;
      card.appendChild(status);
    }
    
    if (onClick) {
      card.addEventListener('click', onClick);
      card.style.cursor = 'pointer';
    }
    
    return card;
  }

  /**
   * 创建 Mask 卡片
   * @param {Object} maskData - Mask 数据
   * @param {Object} options - 选项
   * @returns {HTMLElement}
   */
  static async createMaskCard(maskData, options = {}) {
    const { onClick } = options;
    
    const card = document.createElement('div');
    card.className = 'card';
    
    // 头部：头像 + 名称
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-3);
    `;
    
    // 头像
    const avatar = document.createElement('div');
    avatar.className = 'avatar avatar--large';
    if (maskData.avatar) {
      const img = document.createElement('img');
      img.src = maskData.avatar;
      img.alt = maskData.name;
      avatar.appendChild(img);
    } else {
      avatar.style.background = `linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))`;
    }
    header.appendChild(avatar);
    
    // 名称和身份
    const info = document.createElement('div');
    info.style.flex = '1';
    
    const name = document.createElement('div');
    name.style.cssText = `
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin-bottom: var(--space-1);
    `;
    name.textContent = maskData.name || '未命名人设';
    info.appendChild(name);
    
    const identity = document.createElement('div');
    identity.style.cssText = `
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    `;
    identity.textContent = maskData.initialIdentity === '自定义' 
      ? maskData.customIdentityLabel 
      : maskData.initialIdentity || '未设置';
    info.appendChild(identity);
    
    header.appendChild(info);
    card.appendChild(header);
    
    // 世界影响力条
    const influenceBar = document.createElement('div');
    influenceBar.style.cssText = `
      margin-top: var(--space-3);
    `;
    
    const influenceLabel = document.createElement('div');
    influenceLabel.style.cssText = `
      font-size: var(--font-size-xs);
      color: var(--color-text-secondary);
      margin-bottom: var(--space-1);
    `;
    influenceLabel.textContent = `世界影响力: ${maskData.worldInfluence || 0}/1000`;
    influenceBar.appendChild(influenceLabel);
    
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      height: 4px;
      background: var(--color-bg-neutral-200);
      border-radius: var(--radius-full);
      overflow: hidden;
    `;
    
    const progressFill = document.createElement('div');
    progressFill.style.cssText = `
      height: 100%;
      width: ${((maskData.worldInfluence || 0) / 1000) * 100}%;
      background: var(--color-accent-primary);
      border-radius: var(--radius-full);
      transition: width var(--duration-normal) var(--ease-smooth);
    `;
    progressBar.appendChild(progressFill);
    influenceBar.appendChild(progressBar);
    
    card.appendChild(influenceBar);
    
    // 激活状态标识
    if (maskData.isActive) {
      const activeBadge = document.createElement('div');
      activeBadge.style.cssText = `
        position: absolute;
        top: var(--space-2);
        right: var(--space-2);
        width: 8px;
        height: 8px;
        border-radius: var(--radius-full);
        background: var(--color-semantic-success);
        box-shadow: 0 0 0 2px var(--color-bg-l1);
      `;
      card.style.position = 'relative';
      card.appendChild(activeBadge);
    }
    
    if (onClick) {
      card.addEventListener('click', onClick);
      card.style.cursor = 'pointer';
    }
    
    return card;
  }
}
