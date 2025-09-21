import type { Component } from 'solid-js'
import { createMemo, createSignal, Index } from 'solid-js'
import * as YAML from 'yaml'
import AIConfig from '~/components/AIConfig'
import { useAITranslator } from '~/components/AITranslator'
import Footer from '~/components/Footer'
import GlobalNavigation from '~/components/GlobalNavigation'
import { useAIConfig } from '~/stores/aiConfig'

interface StringValue {
  path: string
  originalValue: string
  translatedValue?: string
  currentValue: string
  selected: boolean
  edited?: string
  isNew?: boolean
  isUpdated?: boolean
}

const UpdateTranslatePage: Component = () => {
  const [baseContent, setBaseContent] = createSignal('')
  const [translatedContent, setTranslatedContent] = createSignal('')
  const [inputType, setInputType] = createSignal<'json' | 'yaml'>('json')
  const [baseData, setBaseData] = createSignal<any>(null)
  const [translatedData, setTranslatedData] = createSignal<any>(null)
  const [baseError, setBaseError] = createSignal('')
  const [translatedError, setTranslatedError] = createSignal('')
  const [stringValues, setStringValues] = createSignal<StringValue[]>([])

  const { aiConfig } = useAIConfig
  const { isTranslating, translateWithAI, cancelTranslation } = useAITranslator()

  const isValidInput = createMemo(() => {
    return baseContent().trim() !== '' && !baseError() && baseData() !== null
  })

  const extractStringValues = (obj: any, path = ''): { path: string, value: string }[] => {
    const result: { path: string, value: string }[] = []

    const traverse = (current: any, currentPath: string) => {
      if (typeof current === 'string') {
        result.push({
          path: currentPath,
          value: current,
        })
      }
      else if (typeof current === 'object' && current !== null) {
        Object.keys(current).forEach((key) => {
          const newPath = currentPath ? `${currentPath}.${key}` : key
          traverse(current[key], newPath)
        })
      }
    }

    traverse(obj, path)
    return result
  }

  const compareAndMerge = () => {
    if (!baseData())
      return

    const baseStrings = extractStringValues(baseData())
    const translatedStrings = translatedData() ? extractStringValues(translatedData()) : []

    const translatedMap = new Map(translatedStrings.map(item => [item.path, item.value]))

    const merged: StringValue[] = baseStrings.map((baseString) => {
      const translatedValue = translatedMap.get(baseString.path)
      const hasTranslation = translatedValue !== undefined

      return {
        path: baseString.path,
        originalValue: baseString.value,
        translatedValue,
        currentValue: hasTranslation ? translatedValue : baseString.value,
        selected: false,
        isNew: !hasTranslation,
        isUpdated: hasTranslation && translatedValue !== baseString.value,
      }
    })

    setStringValues(merged)
  }

  const handleBaseInputChange = (value: string) => {
    setBaseContent(value)
    setBaseError('')

    if (!value.trim()) {
      setBaseData(null)
      setStringValues([])
      return
    }

    try {
      let parsed: any
      if (inputType() === 'json') {
        parsed = JSON.parse(value)
      }
      else {
        parsed = YAML.parse(value)
      }

      setBaseData(parsed)
      compareAndMerge()
    }
    catch (e) {
      setBaseError(`Invalid ${inputType().toUpperCase()}: ${(e as Error).message}`)
      setBaseData(null)
      setStringValues([])
    }
  }

  const handleTranslatedInputChange = (value: string) => {
    setTranslatedContent(value)
    setTranslatedError('')

    if (!value.trim()) {
      setTranslatedData(null)
      compareAndMerge()
      return
    }

    try {
      let parsed: any
      if (inputType() === 'json') {
        parsed = JSON.parse(value)
      }
      else {
        parsed = YAML.parse(value)
      }

      setTranslatedData(parsed)
      compareAndMerge()
    }
    catch (e) {
      setTranslatedError(`Invalid ${inputType().toUpperCase()}: ${(e as Error).message}`)
      setTranslatedData(null)
    }
  }

  const handleBaseFileUpload = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file)
      return

    // 智能判断文件类型
    const fileName = file.name.toLowerCase()
    const fileExtension = fileName.split('.').pop()

    if (fileExtension === 'json') {
      setInputType('json')
    } else if (fileExtension === 'yaml' || fileExtension === 'yml') {
      setInputType('yaml')
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setBaseContent(content)
      handleBaseInputChange(content)
    }
    reader.readAsText(file)
  }

  const handleTranslatedFileUpload = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file)
      return

    // 智能判断文件类型（如果基础文件还没有设置类型）
    if (!baseContent()) {
      const fileName = file.name.toLowerCase()
      const fileExtension = fileName.split('.').pop()

      if (fileExtension === 'json') {
        setInputType('json')
      } else if (fileExtension === 'yaml' || fileExtension === 'yml') {
        setInputType('yaml')
      }
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setTranslatedContent(content)
      handleTranslatedInputChange(content)
    }
    reader.readAsText(file)
  }

  const toggleStringSelection = (index: number) => {
    setStringValues(prev => prev.map((item, i) =>
      i === index ? { ...item, selected: !item.selected } : item,
    ))
  }

  const updateStringValue = (index: number, newValue: string) => {
    setStringValues(prev => prev.map((item, i) =>
      i === index ? { ...item, edited: newValue, currentValue: newValue } : item,
    ))
  }

  const resetStringValue = (index: number) => {
    setStringValues(prev => prev.map((item, i) => {
      if (i === index) {
        const resetValue = item.translatedValue || item.originalValue
        return { ...item, edited: undefined, currentValue: resetValue }
      }
      return item
    }))
  }

  // 全选/反选功能
  const toggleSelectAll = () => {
    const allSelected = stringValues().every(item => item.selected)
    setStringValues(prev => prev.map(item => ({
      ...item,
      selected: !allSelected,
    })))
  }

  const selectUntranslated = () => {
    setStringValues(prev => prev.map(item => ({
      ...item,
      selected: (!item.edited || item.edited.trim() === '') && (!item.translatedValue || item.translatedValue.trim() === ''),
    })))
  }

  const handleAITranslation = () => {
    const items = stringValues().map(item => ({
      path: item.path,
      value: item.originalValue,
      selected: item.selected,
    }))
    translateWithAI(aiConfig(), items, updateStringValue)
  }

  const getFinalData = () => {
    if (!baseData())
      return null

    const result = JSON.parse(JSON.stringify(baseData()))

    stringValues().forEach((stringVal) => {
      const finalValue = stringVal.edited !== undefined ? stringVal.edited : stringVal.currentValue

      const pathParts = stringVal.path.split('.')
      let current = result

      for (let i = 0; i < pathParts.length - 1; i++) {
        current = current[pathParts[i]]
      }

      current[pathParts[pathParts.length - 1]] = finalValue
    })

    return result
  }

  const downloadFile = () => {
    const finalData = getFinalData()
    if (!finalData)
      return

    let content: string
    let mimeType: string
    let fileExtension: string

    if (inputType() === 'json') {
      content = JSON.stringify(finalData, null, 2)
      mimeType = 'application/json'
      fileExtension = 'json'
    }
    else {
      content = YAML.stringify(finalData)
      mimeType = 'text/yaml'
      fileExtension = 'yaml'
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `updated_translation_${Date.now()}.${fileExtension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatDisplay = (data: any) => {
    if (inputType() === 'json') {
      return JSON.stringify(data, null, 2)
    }
    else {
      return YAML.stringify(data)
    }
  }

  return (
    <div class="min-h-screen bg-light-50 dark:bg-gray-900">
      <GlobalNavigation />
      <div class="p-4">
        <div class="container mx-auto max-w-7xl">
          <header class="mb-6 text-center">
            <h1 class="text-3xl text-gray-800 font-bold dark:text-white">更新翻译模式</h1>
            <p class="mt-2 text-gray-600 dark:text-gray-300">基于基础文件和已翻译文件，更新翻译内容</p>
          </header>

          <AIConfig />

          <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Left Panel - Input Files */}
            <div class="space-y-6">
              {/* Base File Input */}
              <div class="bg-base-100 card shadow-xl">
                <div class="card-body">
                  <h2 class="card-title">基底文件 (必需)</h2>

                  {/* File Type Selector */}
                  <div class="form-control mb-4">
                    <div class="flex gap-4">
                      <label class="label cursor-pointer">
                        <span class="label-text mr-2">JSON</span>
                        <input
                          type="radio"
                          name="fileType"
                          class="radio radio-primary"
                          checked={inputType() === 'json'}
                          onChange={() => setInputType('json')}
                        />
                      </label>
                      <label class="label cursor-pointer">
                        <span class="label-text mr-2">YAML</span>
                        <input
                          type="radio"
                          name="fileType"
                          class="radio radio-primary"
                          checked={inputType() === 'yaml'}
                          onChange={() => setInputType('yaml')}
                        />
                      </label>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div class="form-control mb-4">
                    <label class="label">
                      <span class="label-text">上传基底文件</span>
                    </label>
                    <input
                      type="file"
                      class="file-input-bordered file-input w-full"
                      accept=".json,.yaml,.yml"
                      onChange={handleBaseFileUpload}
                    />
                  </div>

                  {/* Text Input */}
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text">或直接输入内容</span>
                    </label>
                    <textarea
                      class="textarea-bordered textarea h-48 text-sm font-mono"
                      placeholder={`输入基底${inputType().toUpperCase()}内容...`}
                      value={baseContent()}
                      onInput={e => handleBaseInputChange(e.currentTarget.value)}
                    />
                  </div>

                  {baseError() && (
                    <div class="alert alert-error mt-4">
                      <i class="i-carbon:warning" />
                      <span>{baseError()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Translated File Input */}
              <div class="bg-base-100 card shadow-xl">
                <div class="card-body">
                  <h2 class="card-title">已翻译文件 (可选)</h2>

                  {/* File Upload */}
                  <div class="form-control mb-4">
                    <label class="label">
                      <span class="label-text">上传已翻译文件</span>
                    </label>
                    <input
                      type="file"
                      class="file-input-bordered file-input w-full"
                      accept=".json,.yaml,.yml"
                      onChange={handleTranslatedFileUpload}
                    />
                  </div>

                  {/* Text Input */}
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text">或直接输入内容</span>
                    </label>
                    <textarea
                      class="textarea-bordered textarea h-48 text-sm font-mono"
                      placeholder={`输入已翻译${inputType().toUpperCase()}内容...`}
                      value={translatedContent()}
                      onInput={e => handleTranslatedInputChange(e.currentTarget.value)}
                    />
                  </div>

                  {translatedError() && (
                    <div class="alert alert-error mt-4">
                      <i class="i-carbon:warning" />
                      <span>{translatedError()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Middle Panel - Translation Editing */}
            <div class="bg-base-100 card shadow-xl">
              <div class="card-body">
                <div class="mb-4">
                  <div class="flex items-center gap-2 mb-3 flex-wrap">
                    <h2 class="card-title">翻译编辑</h2>
                    <span class="badge badge-neutral whitespace-nowrap">
                      总计 {stringValues().length}
                    </span>
                    <span class="badge badge-success whitespace-nowrap">
                      已翻译 {stringValues().filter(s => {
                        const hasEdited = s.edited && s.edited.trim() !== ''
                        const hasTranslated = s.translatedValue && s.translatedValue.trim() !== ''
                        return hasEdited || (!hasEdited && hasTranslated)
                      }).length}
                    </span>
                    <span class="badge badge-warning whitespace-nowrap">
                      未翻译 {stringValues().filter(s => {
                        const hasEdited = s.edited && s.edited.trim() !== ''
                        const hasTranslated = s.translatedValue && s.translatedValue.trim() !== ''
                        return !hasEdited && !hasTranslated
                      }).length}
                    </span>
                    <span class="badge badge-info whitespace-nowrap">
                      新增 {stringValues().filter(s => s.isNew).length}
                    </span>
                    <span class="badge badge-info whitespace-nowrap">
                      更新 {stringValues().filter(s => s.isUpdated).length}
                    </span>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <button
                      class="btn btn-outline btn-sm"
                      disabled={!isValidInput() || stringValues().length === 0}
                      onClick={toggleSelectAll}
                    >
                      <i class="i-carbon:checkbox-checked" />
                      <span class="hidden sm:inline">{stringValues().every(item => item.selected) ? '反选' : '全选'}</span>
                    </button>
                    <button
                      class="btn btn-outline btn-sm"
                      disabled={!isValidInput() || stringValues().length === 0}
                      onClick={selectUntranslated}
                    >
                      <i class="i-carbon:select-01" />
                      <span class="hidden sm:inline">选择未翻译</span>
                    </button>
                    <button
                      class="btn btn-secondary btn-sm min-w-20"
                      disabled={!isValidInput() || stringValues().filter(item => item.selected).length === 0 || isTranslating()}
                      onClick={handleAITranslation}
                    >
                      {isTranslating()
                        ? (
                            <>
                              <span class="loading loading-spinner loading-xs" />
                              <span class="hidden sm:inline">翻译中</span>
                            </>
                          )
                        : (
                            <>
                              <i class="i-carbon:ai-launch" />
                              <span class="hidden sm:inline">AI翻译</span>
                            </>
                          )}
                    </button>
                    {isTranslating() && (
                      <button
                        class="btn btn-error btn-sm"
                        onClick={cancelTranslation}
                      >
                        <i class="i-carbon:stop" />
                        <span class="hidden sm:inline">取消</span>
                      </button>
                    )}
                    <button
                      class="btn btn-primary btn-sm"
                      disabled={!isValidInput() || stringValues().length === 0}
                      onClick={downloadFile}
                    >
                      <i class="i-carbon:download" />
                      <span class="hidden sm:inline">下载</span>
                    </button>
                  </div>
                </div>

                {!isValidInput() ? (
                  <div class="h-96 flex items-center justify-center text-gray-500">
                    <div class="text-center">
                      <i class="i-carbon:document-add mb-4 text-4xl" />
                      <p>请先输入有效的基底文件</p>
                    </div>
                  </div>
                ) : (
                  <div class="space-y-4">
                    {/* String Values for Editing */}
                    <div class="max-h-[600px] overflow-y-auto space-y-3">
                      <Index each={stringValues()}>
                        {(stringVal, index) => (
                          <div class={`border rounded-lg p-4 ${stringVal().isNew
                            ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20'
                            : stringVal().isUpdated
                              ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-base-300'
                          }`}
                          >
                            <div class="flex items-start gap-3">
                              <input
                                type="checkbox"
                                class="checkbox checkbox-primary mt-1"
                                checked={stringVal().selected}
                                onChange={() => toggleStringSelection(index)}
                              />
                              <div class="min-w-0 flex-1">
                                <div class="mb-1 flex items-center gap-2">
                                  <div class="text-sm text-gray-500 font-mono">{stringVal().path}</div>
                                  {stringVal().isNew && (
                                    <span class="badge badge-warning badge-sm">新增</span>
                                  )}
                                  {stringVal().isUpdated && (
                                    <span class="badge badge-info badge-sm">更新</span>
                                  )}
                                </div>
                                <div class="space-y-2">
                                  <div class="text-sm text-gray-700 dark:text-gray-300">
                                    原文:
                                    {' '}
                                    {stringVal().originalValue}
                                  </div>
                                  {stringVal().translatedValue && (
                                    <div class="text-sm text-green-600 dark:text-green-400">
                                      已译:
                                      {' '}
                                      {stringVal().translatedValue}
                                    </div>
                                  )}
                                  <div class="flex gap-2">
                                    <input
                                      type="text"
                                      class="input-bordered input input-sm flex-1"
                                      placeholder="编辑翻译..."
                                      value={stringVal().edited || stringVal().currentValue}
                                      onInput={e => updateStringValue(index, e.currentTarget.value)}
                                    />
                                    <button
                                      class="btn btn-ghost btn-sm"
                                      disabled={!stringVal().edited}
                                      onClick={() => resetStringValue(index)}
                                      title="重置为原文"
                                    >
                                      <i class="i-carbon:reset" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Index>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div class="bg-base-100 card shadow-xl">
              <div class="card-body">
                <div class="mb-4 flex items-center justify-between">
                  <h2 class="card-title">预览结果</h2>
                  <button
                    class="btn btn-ghost btn-sm"
                    disabled={!isValidInput()}
                    onClick={() => {
                      const content = formatDisplay(getFinalData())
                      navigator.clipboard.writeText(content)
                        .then(() => {
                          // 可以添加成功提示
                        })
                        .catch(err => console.error('复制失败:', err))
                    }}
                    title="复制预览结果"
                  >
                    <i class="i-carbon:copy" />
                    复制
                  </button>
                </div>

                {!isValidInput()
                  ? (
                      <div class="h-96 flex items-center justify-center text-gray-500">
                        <div class="text-center">
                          <i class="i-carbon:eye mb-4 text-4xl" />
                          <p>预览将在编辑后显示</p>
                        </div>
                      </div>
                    )
                  : (
                      <pre class="bg-base-200 h-[600px] overflow-auto whitespace-pre-wrap rounded p-4 text-sm font-mono">
                        {formatDisplay(getFinalData())}
                      </pre>
                    )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default UpdateTranslatePage
