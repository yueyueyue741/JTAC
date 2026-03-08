/**
 * AI 请求调度器
 * 负责 API 调用、密钥池轮询、上下文注入
 */

import { worldContext } from './world-context.js';
import { storage } from './storage.js';

class AIDispatcher {
  constructor() {
    this.currentProvider = null;
    this.currentModel = null;
    this.apiConfig = null;
  }

  /**
   * 初始化（从 localStorage 加载配置）
   */
  init() {
    this.apiConfig = storage.getLocal('api_config', {});
    this.currentProvider = this.apiConfig.currentProvider || null;
    this.currentModel = this.apiConfig.currentModel || null;
  }

  /**
   * 设置当前使用的供应商和模型
   * @param {string} provider - 供应商名称
   * @param {string} model - 模型名称
   */
  setProvider(provider, model) {
    this.currentProvider = provider;
    this.currentModel = model;
    
    // 保存到配置
    this.apiConfig.currentProvider = provider;
    this.apiConfig.currentModel = model;
    storage.setLocal('api_config', this.apiConfig);
  }

  /**
   * 获取当前配置的供应商信息
   * @returns {Object|null}
   */
  getProviderConfig() {
    if (!this.currentProvider || !this.apiConfig.providers) {
      return null;
    }
    return this.apiConfig.providers[this.currentProvider] || null;
  }

  /**
   * 从密钥池中选择密钥（按策略）
   * @param {Array} keys - 密钥数组
   * @param {string} strategy - 策略：'sequential' | 'random' | 'load-balance'
   * @returns {string}
   */
  selectKey(keys, strategy = 'sequential') {
    if (!keys || keys.length === 0) {
      throw new Error('No API keys available');
    }

    switch (strategy) {
      case 'random':
        return keys[Math.floor(Math.random() * keys.length)];
      case 'load-balance':
        // TODO: 实现负载均衡逻辑
        return keys[0];
      case 'sequential':
      default:
        return keys[0];
    }
  }

  /**
   * 发送 AI 请求
   * @param {string} userMessage - 用户消息
   * @param {Object} options - 选项
   * @param {Function} onStream - 流式响应回调
   * @returns {Promise<string>} 完整响应
   */
  async sendRequest(userMessage, options = {}) {
    const providerConfig = this.getProviderConfig();
    if (!providerConfig || !providerConfig.enabled) {
      throw new Error('No enabled provider configured');
    }

    // 构建系统提示词（从世界上下文）
    const systemPrompt = await worldContext.buildAIContext();

    // 选择密钥
    const apiKey = this.selectKey(
      providerConfig.apiKeys || [],
      providerConfig.keyStrategy || 'sequential'
    );

    // 构建请求
    const requestBody = {
      model: this.currentModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      stream: options.stream || false,
    };

    // 发送请求
    try {
      const response = await fetch(providerConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      if (options.stream) {
        // 处理流式响应
        return this.handleStreamResponse(response, options.onStream);
      } else {
        const data = await response.json();
        return data.choices[0].message.content;
      }
    } catch (error) {
      console.error('AI request failed:', error);
      throw error;
    }
  }

  /**
   * 处理流式响应
   * @param {Response} response - Fetch 响应对象
   * @param {Function} onChunk - 数据块回调
   * @returns {Promise<string>} 完整响应
   */
  async handleStreamResponse(response, onChunk) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const json = JSON.parse(data);
            const content = json.choices[0]?.delta?.content || '';
            if (content) {
              fullResponse += content;
              if (onChunk) {
                onChunk(content);
              }
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }

    return fullResponse;
  }
}

// 导出单例
export const aiDispatcher = new AIDispatcher();
