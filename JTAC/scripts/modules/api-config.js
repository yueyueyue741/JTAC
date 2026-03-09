/** API配置面板：密钥池、模型获取、调度器。见 Section 10 */

/**
 * 轻量占位视图，只负责按照文档划分出主要区域，后续再接入真实存储与请求逻辑
 * - 顶部：当前全局 Provider + 模型摘要
 * - 中部：当�?Provider 配置（Base URL / 密钥�?/ 模型列表 / 温度�?
 * - 底部：请求超时与重试配置
 *
 * @param {HTMLElement} root
 */
export function render(root) {
  if (!root) return;

  root.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'api-config';

  const header = document.createElement('section');
  header.className = 'api-config__section api-config__section--summary';
  header.innerHTML = `
    <div class="card card--p1">
      <div class="api-config__section-title">当前配置</div>
      <div class="api-config__summary-line">
        <span class="api-config__summary-label">供应�?/span>
        <select class="input api-config__provider-select" disabled>
          <option>OpenAI</option>
        </select>
      </div>
      <div class="api-config__summary-line">
        <span class="api-config__summary-label">模型</span>
        <select class="input api-config__model-select" disabled>
          <option>点击下方“获取模型列表”后可选择</option>
        </select>
      </div>
      <p class="api-config__summary-hint">
        这里仅为 UI 结构占位，实�?Provider / 模型列表与温度参数由后续逻辑接入�?
      </p>
    </div>
  `;

  const providerPanel = document.createElement('section');
  providerPanel.className = 'api-config__section api-config__section--provider';
  providerPanel.innerHTML = `
    <div class="card">
      <div class="api-config__section-title">当前供应商配�?/div>

      <label class="api-config__field">
        <span class="api-config__field-label">Base URL</span>
        <input class="input" type="text" placeholder="https://api.openai.com/v1" disabled />
      </label>

      <div class="api-config__field">
        <div class="api-config__field-label">API 密钥�?/div>
        <div class="api-config__keys-placeholder">
          <div class="api-config__key-row">
            <input class="input" type="password" value="********" disabled />
          </div>
          <button type="button" class="btn" disabled>+ 添加密钥</button>
        </div>
      </div>

      <div class="api-config__field api-config__field--inline">
        <div class="api-config__field-main">
          <span class="api-config__field-label">Model Name</span>
          <select class="input" disabled>
            <option>尚未获取模型列表</option>
          </select>
        </div>
        <button type="button" class="btn btn--primary" disabled>获取模型列表</button>
      </div>

      <div class="api-config__field">
        <span class="api-config__field-label">Temperature</span>
        <input class="api-config__temperature-range" type="range" min="0" max="2" step="0.1" value="1" disabled />
        <div class="api-config__temperature-labels">
          <span>0.0 稳定</span>
          <span>1.0 平衡</span>
          <span>2.0 创意</span>
        </div>
      </div>
    </div>
  `;

  const advancedPanel = document.createElement('section');
  advancedPanel.className = 'api-config__section api-config__section--advanced';
  advancedPanel.innerHTML = `
    <div class="card">
      <div class="api-config__section-title">高级设置</div>
      <div class="api-config__field api-config__field--inline">
        <label class="api-config__field-main">
          <span class="api-config__field-label">请求超时（毫秒）</span>
          <input class="input" type="number" value="30000" disabled />
        </label>
        <label class="api-config__field-main">
          <span class="api-config__field-label">最大重试次�?/span>
          <input class="input" type="number" value="2" disabled />
        </label>
      </div>
      <p class="api-config__summary-hint">
        行为与字段结构见 1.md Section 10，本阶段仅搭�?UI 骨架�?
      </p>
    </div>
  `;

  container.appendChild(header);
  container.appendChild(providerPanel);
  container.appendChild(advancedPanel);

  root.appendChild(container);
}

export default { render };
