/**
 * 头像组件（支持自定义图片/颜色块）
 * 包含上传与裁剪功能
 */

import { modal } from './modal.js';
import { storage } from '../core/storage.js';

// 确保 storage 已初始化（如果还未初始化，会在使用时自动初始化）

export class Avatar {
  /**
   * 创建头像元素
   * @param {Object} options - 选项
   * @param {string} options.src - 头像图片（base64）
   * @param {string} options.size - 尺寸：'small' | 'medium' | 'large'
   * @param {string} options.color - 颜色块背景色（当无图片时）
   * @param {Function} options.onClick - 点击回调（用于打开选择器）
   * @returns {HTMLElement}
   */
  static create(options = {}) {
    const { src, size = 'medium', color, onClick } = options;
    
    const avatar = document.createElement('div');
    avatar.className = `avatar avatar--${size}`;
    
    if (src) {
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'Avatar';
      avatar.appendChild(img);
    } else if (color) {
      avatar.style.background = color;
    } else {
      // 默认渐变
      avatar.style.background = `linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))`;
    }
    
    if (onClick) {
      avatar.style.cursor = 'pointer';
      avatar.addEventListener('click', () => {
        Avatar.showPicker(onClick);
      });
    }
    
    return avatar;
  }

  /**
   * 显示头像选择器
   * @param {Function} onConfirm - 确认回调，参数为 base64 字符串
   */
  static showPicker(onConfirm) {
    const pickerContent = document.createElement('div');
    pickerContent.style.cssText = `
      padding: var(--space-4);
      min-width: 300px;
    `;
    
    // 选择来源按钮组
    const sourceButtons = document.createElement('div');
    sourceButtons.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      margin-bottom: var(--space-4);
    `;
    
    // 从本地文件选择
    const fileBtn = document.createElement('button');
    fileBtn.className = 'btn btn--primary';
    fileBtn.textContent = '从本地文件选择';
    fileBtn.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          Avatar.processImage(file, onConfirm);
        }
      });
      input.click();
    });
    sourceButtons.appendChild(fileBtn);
    
    // 从相册选择（本地缓存）
    const galleryBtn = document.createElement('button');
    galleryBtn.className = 'btn btn--secondary';
    galleryBtn.textContent = '从相册选择';
    galleryBtn.addEventListener('click', () => {
      Avatar.showGallery(onConfirm);
    });
    sourceButtons.appendChild(galleryBtn);
    
    pickerContent.appendChild(sourceButtons);
    
    modal.show({
      title: '选择头像',
      content: pickerContent,
      closable: true,
    });
  }

  /**
   * 处理图片（裁剪并转换为 base64）
   * @param {File} file - 图片文件
   * @param {Function} onConfirm - 确认回调
   */
  static processImage(file, onConfirm) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // 显示裁剪界面
        Avatar.showCropEditor(img, onConfirm);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  /**
   * 显示裁剪编辑器
   * @param {HTMLImageElement} img - 图片元素
   * @param {Function} onConfirm - 确认回调
   */
  static showCropEditor(img, onConfirm) {
    const cropContent = document.createElement('div');
    cropContent.style.cssText = `
      padding: var(--space-4);
      min-width: 320px;
    `;
    
    // 预览区域
    const previewContainer = document.createElement('div');
    previewContainer.style.cssText = `
      position: relative;
      width: 256px;
      height: 256px;
      margin: 0 auto var(--space-4);
      border-radius: var(--radius-full);
      overflow: hidden;
      border: 2px solid var(--color-border-default);
    `;
    
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // 计算裁剪区域（圆形）
    const size = Math.min(img.width, img.height);
    const x = (img.width - size) / 2;
    const y = (img.height - size) / 2;
    
    // 绘制圆形裁剪
    ctx.beginPath();
    ctx.arc(128, 128, 128, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, x, y, size, size, 0, 0, 256, 256);
    
    previewContainer.appendChild(canvas);
    cropContent.appendChild(previewContainer);
    
    // 操作按钮
    const actions = document.createElement('div');
    actions.style.cssText = `
      display: flex;
      gap: var(--space-3);
      justify-content: flex-end;
    `;
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn--ghost';
    cancelBtn.textContent = '取消';
    cancelBtn.addEventListener('click', () => {
      modal.close();
    });
    
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn btn--primary';
    confirmBtn.textContent = '确认';
    confirmBtn.addEventListener('click', () => {
      const base64 = canvas.toDataURL('image/png');
      onConfirm(base64);
      modal.close();
    });
    
    actions.appendChild(cancelBtn);
    actions.appendChild(confirmBtn);
    cropContent.appendChild(actions);
    
    modal.show({
      title: '裁剪头像',
      content: cropContent,
      closable: true,
    });
  }

  /**
   * 显示相册（本地缓存的头像）
   * @param {Function} onConfirm - 确认回调
   */
  static showGallery(onConfirm) {
    // 从 localStorage 获取已用头像列表
    const gallery = storage.getLocal('avatar_gallery', []);
    
    if (gallery.length === 0) {
      // TODO: 显示空状态提示
      return;
    }
    
    const galleryContent = document.createElement('div');
    galleryContent.style.cssText = `
      padding: var(--space-4);
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-3);
      max-height: 400px;
      overflow-y: auto;
    `;
    
    gallery.forEach((avatarSrc) => {
      const item = document.createElement('div');
      item.style.cssText = `
        width: 80px;
        height: 80px;
        border-radius: var(--radius-full);
        overflow: hidden;
        cursor: pointer;
        border: 2px solid var(--color-border-default);
        transition: var(--transition-fast);
      `;
      
      const img = document.createElement('img');
      img.src = avatarSrc;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      item.appendChild(img);
      
      item.addEventListener('click', () => {
        onConfirm(avatarSrc);
        modal.close();
      });
      
      item.addEventListener('mouseenter', () => {
        item.style.borderColor = 'var(--color-accent-primary)';
        item.style.transform = 'scale(1.1)';
      });
      
      item.addEventListener('mouseleave', () => {
        item.style.borderColor = 'var(--color-border-default)';
        item.style.transform = 'scale(1)';
      });
      
      galleryContent.appendChild(item);
    });
    
    modal.show({
      title: '从相册选择',
      content: galleryContent,
      closable: true,
    });
  }

  /**
   * 保存头像到相册
   * @param {string} base64 - base64 字符串
   */
  static saveToGallery(base64) {
    const gallery = storage.getLocal('avatar_gallery', []);
    if (!gallery.includes(base64)) {
      gallery.unshift(base64);
      // 限制相册数量
      if (gallery.length > 20) {
        gallery.pop();
      }
      storage.setLocal('avatar_gallery', gallery);
    }
  }
}
