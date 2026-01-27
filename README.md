# json-form

[![npm version](https://img.shields.io/npm/v/@xiaohaih/json-form-core.svg)](https://www.npmjs.com/package/@xiaohaih/json-form-core)
[![npm downloads](https://img.shields.io/npm/dm/@xiaohaih/json-form-core.svg)](https://www.npmjs.com/package/@xiaohaih/json-form-core)

`json-form` 是一个基于 Vue 的动态表单库，通过 JSON 配置即可渲染完整的表单组件。支持表单项间的复杂依赖关系、数据校验、多种 UI 框架适配等高级功能。

## ✨ 特性

- 🎯 **JSON 配置驱动**: 通过 JSON 对象配置表单，无需手写模板
- 🔗 **智能依赖**: 支持表单项间的级联依赖和数据联动
- ✅ **表单校验**: 沿用 UI 框架本身的校验机制
- 🎨 **多 UI 适配**: 支持 Element UI、Element Plus 等主流 UI 框架
- 📦 **模块化设计**: 核心逻辑与 UI 层解耦，支持扩展
- 🎪 **Vue 3 优先**: 基于 Vue 3 Composition API，同时支持 Vue 2
- 🎯 **TypeScript**: 完整的类型定义和类型推导
- 🚀 **开箱即用**: 丰富的组件类型，开箱即用
- 📱 **响应式**: 支持响应式表单配置和数据绑定

## 📦 安装

<!-- ### 核心模块

```bash
# 纯逻辑实现，无 UI 依赖
pnpm add @xiaohaih/json-form-core
```

### UI 适配层 -->

```bash
# Element Plus 版本 (Vue 3)
pnpm add @xiaohaih/json-form-plus

# Element UI 版本 (Vue 2)
pnpm add @xiaohaih/json-form-el
```

## 🏗️ 架构设计

### 设计理念

json-form 采用 **分层架构设计**，将表单逻辑与 UI 渲染完全解耦：

```
┌─────────────────────────────────────┐
│           业务层 (Business)         │
│         表单配置、数据处理           │
├─────────────────────────────────────┤
│          适配层 (Adapter)           │
│     Element UI / Element Plus       │
├─────────────────────────────────────┤
│         核心层 (Core Logic)         │
│       依赖管理、校验、状态同步       │
├─────────────────────────────────────┤
│          Vue 生态 (Ecosystem)       │
│       Vue 3 / Vue 2 + 组合式 API     │
└─────────────────────────────────────┘
```

### 核心模块

#### `@xiaohaih/json-form-core`

- **纯逻辑实现**: 零 UI 依赖的核心逻辑
- **组合式 API**: 基于 Vue 3 Composition API
- **依赖追踪**: 智能的字段间依赖关系管理
- **状态管理**: 响应式表单状态管理
- **校验机制**: 内置校验流程

#### `@xiaohaih/json-form-plus` (Element Plus)

- **Vue 3 原生**: 基于 Vue 3 全新实现
- **Element Plus 集成**: 深度集成 Element Plus 2.x
- **现代化特性**: 支持最新的 Element Plus 特性
- **性能优化**: 更好的性能表现

#### `@xiaohaih/json-form-el` (Element UI)

- **Vue 2 支持**: 兼容 Vue 2.7+
- **Element UI 集成**: 深度集成 Element UI 2.x
- **完整组件库**: 支持所有 Element UI 表单组件
- **向下兼容**: 保持与旧版本的兼容性

## 🚀 快速开始

### 使用 Element Plus 版本

- [请参考对应文档](https://github.com/xiaohaiH/json-form/tree/master/packages/element-plus/README.md)

### 使用 Element UI 版本

- [请参考对应文档](https://github.com/xiaohaiH/json-form/tree/master/packages/element-ui/README.md)

## 🔧 开发指南

### 环境要求

#### Element Plus 版本

- Vue 3.0+
- Element Plus 2.x
- TypeScript 4.0+ (推荐)

#### Element UI 版本

- Vue 2.7+
- Element UI 2.x
- TypeScript 4.0+ (推荐)

### 项目结构

```
json-form/
├── packages/
│   ├── core/              # 核心逻辑模块
│   │   ├── use/           # 组合式 API
│   │   │   ├── wrapper/   # 容器逻辑
│   │   │   └── plain/     # 表单项逻辑
│   │   └── utils/         # 工具函数
│   ├── element-ui/        # Element UI 适配
│   │   └── components/    # UI 组件实现
│   └── element-plus/      # Element Plus 适配
│       ├── components/    # UI 组件实现
│       └── docs/          # 文档和示例
├── examples/              # 示例项目
│   ├── el-vue2/          # Element UI 示例
│   └── plus-vue3/        # Element Plus 示例
└── README.md              # 项目文档
```

### 开发命令

```bash
# 安装依赖
pnpm install

# 启动 Element Plus 示例 (默认)
pnpm start

# 启动 Element UI 示例
pnpm run el-v2

# 构建所有包
pnpm run build

# 运行测试
pnpm --filter="@xiaohaih/json-form-core" test
```

### 扩展开发

#### 添加新的 UI 适配

1. 在 `packages/` 下创建新的适配包
2. 基于 `@xiaohaih/json-form-core` 实现 UI 组件
3. 导出统一的 `JsonForm` 组件接口
4. 添加相应的示例和文档

#### 添加新的组件类型

1. 在对应适配包的 `components/` 目录下实现
2. 使用 `usePlain` 处理逻辑层
3. 组件负责 UI 渲染和事件处理
4. 更新文档和类型定义

## 🌟 在线示例

- [Vue 3 + Element Plus 示例](https://xiaohaih.github.io/json-form/example-plus-vue3/index.html)
- [Vue 2 + Element UI 示例](https://xiaohaih.github.io/json-form/example-el-vue2/index.html)
- [Element Plus 文档](https://xiaohaih.github.io/json-form/docs-plus/index.html)

## 📊 版本对比

| 特性       | Element UI 版本 | Element Plus 版本 |
| :--------- | :-------------- | :---------------- |
| Vue 版本   | 2.7+            | 3.0+              |
| UI 框架    | Element UI 2.x  | Element Plus 2.x  |
| 组件数量   | 16+             | 18+               |
| TypeScript | ✅              | ✅                |
| 组合式 API | ⚠️ (兼容)       | ✅ (原生)         |
| 虚拟化组件 | ❌              | ✅                |
| 新特性支持 | ❌              | ✅                |

## 🤝 贡献

我们欢迎各种形式的贡献！

### 贡献方式

- 🐛 **Bug 报告**: 在 [Issues](https://github.com/xiaohaih/json-form/issues) 中报告问题
- 💡 **功能建议**: 提出新功能或改进建议
- 🔧 **代码贡献**: 提交 Pull Request
- 📖 **文档完善**: 改进文档或添加示例

### 开发流程

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

感谢所有贡献者和用户对 json-form 项目的支持！

特别感谢：

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Element UI](https://element.eleme.cn/) - Vue 2 组件库
- [Element Plus](https://element-plus.org/) - Vue 3 组件库
- [vue-demi](https://github.com/vueuse/vue-demi) - Vue 版本兼容工具

## 🔗 相关链接

- 📚 [核心模块文档](./packages/core/README.md)
- 🎨 [Element UI 适配文档](./packages/element-ui/README.md)
- 🎪 [Element Plus 适配文档](./packages/element-plus/README.md)
- 🏠 [GitHub 仓库](https://github.com/xiaohaih/json-form)

---

<p align="center">
  <strong>json-form</strong> - 让表单开发变得简单而强大
</p>
