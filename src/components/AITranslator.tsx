import type { Component } from 'solid-js'
import type { AIConfigState } from '~/stores/aiConfig'
import { createSignal } from 'solid-js'

interface TranslationItem {
  path: string
  value: string
  selected: boolean
}

interface AITranslatorProps {
  config: AIConfigState
  items: TranslationItem[]
  onTranslationComplete: (index: number, translation: string) => void
  disabled?: boolean
}

export function useAITranslator() {
  const [isTranslating, setIsTranslating] = createSignal(false)
  let abortController: AbortController | null = null

  const translateWithAI = async (
    config: AIConfigState,
    items: TranslationItem[],
    onTranslationComplete: (index: number, translation: string) => void,
  ) => {
    if (!config.endpoint || !config.apiKey || !config.model) {
      alert('请先配置AI模型参数')
      return
    }

    const selectedItems = items.filter(item => item.selected)
    if (selectedItems.length === 0) {
      alert('请先选择要翻译的项目')
      return
    }

    setIsTranslating(true)
    abortController = new AbortController()

    try {
      const concurrency = Math.max(1, Math.min(config.concurrency || 3, 10)) // 限制并发数在 1-10 之间

      // 将选中的项目分批处理
      for (let i = 0; i < selectedItems.length; i += concurrency) {
        if (abortController.signal.aborted) {
          break
        }

        const batch = selectedItems.slice(i, i + concurrency)

        // 并发执行当前批次的翻译请求
        const promises = batch.map(async (item) => {
          if (!abortController || abortController.signal.aborted) {
            return
          }

          try {
            const response = await fetch(config.endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`,
              },
              body: JSON.stringify({
                model: config.model,
                messages: [
                  {
                    role: 'system',
                    content: config.promptTemplate,
                  },
                  {
                    role: 'user',
                    content: item.value,
                  },
                ],
                max_tokens: 1000,
                temperature: 0.3,
              }),
              signal: abortController.signal,
            })

            if (response.ok) {
              const data = await response.json()
              const translation = data.choices?.[0]?.message?.content?.trim() || item.value

              const index = items.findIndex(it => it.path === item.path)
              if (index !== -1) {
                onTranslationComplete(index, translation)
              }
            }
          } catch (error) {
            if (error instanceof Error && error.name !== 'AbortError') {
              console.error(`翻译失败 ${item.path}:`, error)
            }
          }
        })

        // 等待当前批次完成
        await Promise.all(promises)
      }
    }
    catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('AI翻译已取消')
      } else {
        console.error('AI翻译失败:', error)
        alert('AI翻译失败，请检查配置和网络连接')
      }
    }
    finally {
      setIsTranslating(false)
      abortController = null
    }
  }

  const cancelTranslation = () => {
    if (abortController) {
      abortController.abort()
    }
  }

  return {
    isTranslating,
    translateWithAI,
    cancelTranslation,
  }
}

const AITranslator: Component<AITranslatorProps> = (props) => {
  const { isTranslating, translateWithAI } = useAITranslator()

  const handleTranslate = () => {
    translateWithAI(props.config, props.items, props.onTranslationComplete)
  }

  return (
    <button
      class="btn btn-secondary btn-sm"
      disabled={props.disabled || props.items.filter(item => item.selected).length === 0 || isTranslating()}
      onClick={handleTranslate}
    >
      {isTranslating()
        ? (
            <>
              <span class="loading loading-spinner loading-xs" />
              翻译中...
            </>
          )
        : (
            <>
              <i class="i-carbon:ai-launch" />
              AI翻译
            </>
          )}
    </button>
  )
}

export default AITranslator
