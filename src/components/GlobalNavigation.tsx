import type { Component } from 'solid-js'

const GlobalNavigation: Component = () => {
  return (
    <nav class="bg-base-100 mb-6 shadow-lg">
      <div class="container mx-auto max-w-7xl">
        <div class="navbar">
          <div class="navbar-start">
            <a href="/" class="btn btn-ghost text-xl">
              <i class="i-carbon:translate" />
              Auto i18n
            </a>
          </div>

          <div class="navbar-center hidden lg:flex">
            <ul class="menu menu-horizontal px-1">
              <li>
                <a href="/" class="btn btn-ghost">
                  <i class="i-carbon:home" />
                  首页
                </a>
              </li>
              <li>
                <a href="/initial-translate" class="btn btn-ghost">
                  <i class="i-carbon:document-add" />
                  初次翻译
                </a>
              </li>
              <li>
                <a href="/update-translate" class="btn btn-ghost">
                  <i class="i-carbon:document-tasks" />
                  更新翻译
                </a>
              </li>
            </ul>
          </div>

          <div class="navbar-end">
            <div class="dropdown dropdown-end lg:hidden">
              <label tabindex="0" class="btn btn-ghost lg:hidden">
                <i class="i-carbon:menu" />
              </label>
              <ul tabindex="0" class="bg-base-100 dropdown-content menu menu-sm rounded-box z-[1] mt-3 w-52 p-2 shadow">
                <li>
                  <a href="/">
                    <i class="i-carbon:home" />
                    首页
                  </a>
                </li>
                <li>
                  <a href="/initial-translate">
                    <i class="i-carbon:document-add" />
                    初次翻译
                  </a>
                </li>
                <li>
                  <a href="/update-translate">
                    <i class="i-carbon:document-tasks" />
                    更新翻译
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default GlobalNavigation
