import type { Component } from 'solid-js'

import Footer from '~/components/Footer'
import GlobalNavigation from '~/components/GlobalNavigation'
import logo from '~/logo.svg'

const App: Component = () => {
  return (
    <div class="min-h-screen bg-light-50 dark:bg-gray-900">
      <GlobalNavigation />
      <div class="p-4">
        <header class="flex flex-col items-center justify-center space-y-6">
          <img src={logo} class="animate-spin-slow h-32 w-32" alt="logo" />

          <div class="text-center">
            <h1 class="mb-2 text-4xl text-gray-800 font-bold dark:text-white">Auto i18n</h1>
            <p class="text-lg text-gray-600 dark:text-gray-300">自动化国际化翻译工具</p>
          </div>

          <div class="grid grid-cols-1 max-w-4xl w-full gap-6 md:grid-cols-2">
            {/* Initial Translation Mode */}
            <div class="bg-base-100 card shadow-xl">
              <div class="card-body">
                <h2 class="card-title">
                  <i class="i-carbon:add-filled" />
                  初次翻译模式
                </h2>
                <p class="text-gray-600 dark:text-gray-300">
                  上传或输入JSON/YAML文件，进行首次翻译编辑。支持字符串检测、选择标记和文件下载。
                </p>
                <div class="card-actions justify-end">
                  <a href="/initial-translate" class="btn btn-primary">
                    <i class="i-carbon:document-add" />
                    开始翻译
                  </a>
                </div>
              </div>
            </div>

            {/* Update Translation Mode */}
            <div class="bg-base-100 card shadow-xl">
              <div class="card-body">
                <h2 class="card-title">
                  <i class="i-carbon:update-now" />
                  更新翻译模式
                </h2>
                <p class="text-gray-600 dark:text-gray-300">
                  基于基础文件和已翻译文件，智能合并和更新翻译内容。自动标识新增和变更项。
                </p>
                <div class="card-actions justify-end">
                  <a href="/update-translate" class="btn btn-secondary">
                    <i class="i-carbon:document-tasks" />
                    更新翻译
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="stats shadow">
            <div class="stat">
              <div class="stat-title">支持格式</div>
              <div class="stat-value text-lg">JSON / YAML</div>
              <div class="stat-desc">完整支持</div>
            </div>
            <div class="stat">
              <div class="stat-title">翻译模式</div>
              <div class="stat-value text-lg">2</div>
              <div class="stat-desc">初次 + 更新</div>
            </div>
            <div class="stat">
              <div class="stat-title">功能特性</div>
              <div class="stat-value text-lg">5+</div>
              <div class="stat-desc">批量编辑、选择标记</div>
            </div>
          </div>
        </header>
        <Footer />
      </div>
    </div>
  )
}

export default App
