# Auto i18n

自动化国际化翻译工具 - 基于 AI 的智能翻译解决方案

## 🌟 特性

- 🤖 **AI 智能翻译** - 支持多种 AI 模型的翻译服务
- 📁 **多格式支持** - 完整支持 JSON 和 YAML 格式
- 🔄 **双翻译模式** - 初次翻译和更新翻译两种模式
- ✅ **批量编辑** - 选择性翻译和批量处理
- 🎯 **智能合并** - 自动识别新增和变更项
- 🌙 **深色模式** - 支持明暗主题切换
- 📱 **响应式设计** - 完美适配移动端和桌面端

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 预览生产版本

```bash
pnpm serve
```

## 📖 使用说明

### 初次翻译模式

1. 访问首页，点击"开始翻译"
2. 上传或粘贴 JSON/YAML 格式的国际化文件
3. 配置 AI 翻译参数（API 端点、密钥、模型等）
4. 选择需要翻译的字符串
5. 点击"AI翻译"开始自动翻译
6. 编辑和调整翻译结果
7. 下载完成的翻译文件

### 更新翻译模式

1. 上传基础文件（原始国际化文件）
2. 上传已翻译文件（之前的翻译结果）
3. 系统自动识别新增和变更项
4. 选择需要更新的内容进行翻译
5. 智能合并翻译结果
6. 下载更新后的文件

## 🛠️ 技术栈

- **框架**: SolidJS
- **构建工具**: Vite
- **样式**: UnoCSS + DaisyUI
- **路由**: @solidjs/router
- **状态管理**: SolidJS Primitives
- **代码规范**: ESLint + @antfu/eslint-config
- **类型检查**: TypeScript

## 📂 项目结构

```
src/
├── components/           # 组件目录
│   ├── AIConfig.tsx     # AI 配置组件
│   ├── AITranslator.tsx # AI 翻译组件
│   ├── Footer.tsx       # 页脚组件
│   └── GlobalNavigation.tsx # 全局导航
├── pages/               # 页面目录
│   ├── index.tsx        # 首页
│   ├── initial-translate.tsx # 初次翻译页
│   └── update-translate.tsx  # 更新翻译页
├── primitives/          # 原始工具函数
│   └── useDark.ts       # 深色模式hook
├── stores/              # 状态管理
│   └── aiConfig.ts      # AI配置状态
├── types/               # 类型定义
│   └── daisyui.d.ts     # DaisyUI类型
└── index.tsx            # 应用入口
```

## ⚙️ AI 配置

支持配置以下 AI 翻译参数：

- **API 端点** - AI 服务的 API 地址
- **API 密钥** - 访问 AI 服务的认证密钥
- **模型名称** - 使用的 AI 模型
- **提示模板** - 自定义翻译提示词

### 示例配置

```json
{
  "endpoint": "https://api.openai.com/v1/chat/completions",
  "apiKey": "your-api-key",
  "model": "gpt-3.5-turbo",
  "promptTemplate": "请将以下文本翻译成中文，保持原有格式："
}
```

## 🔧 开发工具

### 代码检查

```bash
pnpm lint
```

### 自动修复代码格式

```bash
pnpm lint:fix
```

## 📄 支持的文件格式

### JSON 格式示例

```json
{
  "common": {
    "hello": "Hello",
    "world": "World"
  },
  "navigation": {
    "home": "Home",
    "about": "About"
  }
}
```

### YAML 格式示例

```yaml
common:
  hello: Hello
  world: World
navigation:
  home: Home
  about: About
```

## 🌈 主题支持

项目支持明暗主题切换，基于 DaisyUI 主题系统：

- **浅色主题** - 默认明亮主题
- **深色主题** - 暗色护眼主题

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📝 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [SolidJS](https://www.solidjs.com/) - 响应式 JavaScript 框架
- [DaisyUI](https://daisyui.com/) - Tailwind CSS 组件库
- [UnoCSS](https://unocss.dev/) - 即时原子化 CSS 引擎
- [Vite](https://vitejs.dev/) - 下一代前端构建工具

---

<div align="center">
  <p>🚀 让国际化翻译更简单、更智能！</p>
</div>
