import type { Component } from 'solid-js'
import { useAIConfig } from '~/stores/aiConfig'

const AIConfig: Component = () => {
  const { aiConfig, setAiConfig } = useAIConfig

  const updateConfig = (updates: Record<string, string>) => {
    setAiConfig(prev => ({ ...prev, ...updates }))
  }

  return (
    <div class="bg-base-100 card mb-6 shadow-xl">
      <div class="card-body">
        <h2 class="card-title mb-4">
          <i class="i-carbon:ai-launch" />
          AI模型配置
        </h2>
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-4 md:grid-cols-2">
          <div class="form-control">
            <label class="label">
              <span class="label-text">API端点</span>
            </label>
            <input
              type="text"
              class="input-bordered input input-sm"
              placeholder="https://api.openai.com/v1/chat/completions"
              value={aiConfig().endpoint}
              onInput={e => updateConfig({ endpoint: e.currentTarget.value })}
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">API Key</span>
            </label>
            <input
              type="password"
              class="input-bordered input input-sm"
              placeholder="sk-..."
              value={aiConfig().apiKey}
              onInput={e => updateConfig({ apiKey: e.currentTarget.value })}
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">模型名称</span>
            </label>
            <input
              type="text"
              class="input-bordered input input-sm"
              placeholder="gpt-3.5-turbo"
              value={aiConfig().model}
              onInput={e => updateConfig({ model: e.currentTarget.value })}
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">提示词模板</span>
            </label>
            <textarea
              class="textarea-bordered textarea textarea-sm"
              placeholder="请将以下文本翻译成中文"
              value={aiConfig().promptTemplate}
              onInput={e => updateConfig({ promptTemplate: e.currentTarget.value })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIConfig
