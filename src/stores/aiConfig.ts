import { makePersisted } from '@solid-primitives/storage'
import { createSignal } from 'solid-js'

export interface AIConfigState {
  endpoint: string
  apiKey: string
  model: string
  promptTemplate: string
  concurrency: number
}

function createAIConfigStore() {
  const [aiConfig, setAiConfig] = makePersisted(createSignal<AIConfigState>({
    endpoint: '',
    apiKey: '',
    model: '',
    promptTemplate: '请将以下文本翻译成中文，直接输出翻译之后的内容，不要包含其他多余信息',
    concurrency: 3,
  }), {
    storage: localStorage,
    name: 'globalAIConfig',
  })

  return { aiConfig, setAiConfig }
}

export const useAIConfig = createAIConfigStore()
