# 代码大模型编程助手指南

## 项目概述

**json-form** 是一个 Vue 2/3 通用的动态表单库，核心架构解耦 UI 层与逻辑层。

- **核心包**: `packages/core` — 零 UI 依赖的纯逻辑实现
- **UI 适配**: `packages/element-plus`、`packages/element-ui` — 不同 UI 框架的适配层
- **示例工程**: `examples/el-vue2`、`examples/plus-vue3` — 开发测试环境

## 架构关键概念

### 组合式 API 设计

所有核心功能通过 `vue-demi` 组合式 API 实现，兼容 Vue 2.7+ 和 Vue 3。关键导出位置：

```
packages/core/use/
├── wrapper/index.ts      # useWrapper — 表单容器（父），负责数据流、校验、搜索
├── plain/index.ts        # usePlain — 表单项（子），负责单个字段的值管理
├── assist.ts             # useValue, useDisableInCurrentCycle — 辅助工具
└── constant.ts           # provideKey, ProvideValue, CommonMethod — 通信契约
```

### 核心数据流

```
useWrapper (容器)
├── provide: ProvideValue (定义在 constant.ts)
│   └── register(option: CommonMethod) — 子组件注册
│       └── child[] — 收集所有子组件引用
├── query (Ref) — 提交的字段值
├── backfill (props) — 外部回填数据
└── search/reset 事件 — 向外暴露的搜索/重置触发器

usePlain (表单项)
├── inject: ProvideValue — 获取父级提供的方法
├── checked (Ref) — 当前选中值
├── finalOption (computed) — 优先级：remoteOption > options
└── register 到 parent — 提供重置、校验、获取 query 等方法
```

**关键文件**:
- `packages/core/use/constant.ts` — `ProvideValue` 接口定义通信规范
- `packages/core/use/wrapper/index.ts` — `useWrapper` 实现（约 300 行，涉及搜索、重置、校验的全流程）
- `packages/core/use/plain/index.ts` — `usePlain` 实现（约 400 行，涉及依赖追踪、值同步、生命周期钩子）

### 重要的设计模式

1. **Provider/Inject 模式**: `useWrapper` 提供上下文，`usePlain` 注入后注册自身
2. **Ref 响应式**: 所有状态通过 `ref` 创建，支持外部订阅
3. **Watch 追踪依赖**: 复杂的 watch 链路实现依赖项变化、回填同步、字段值同步
4. **Computed 数据流**: `finalOption`、`insetHide` 等计算属性驱动 UI 更新

## 开发工作流

### 项目构建

使用 **pnpm monorepo** 工作区：

```bash
# 根目录 — 安装所有依赖
pnpm i

# 构建所有包
pnpm run build              # 构建 core + element-plus + element-ui
pnpm run build:core         # 仅构建 core

# 开发示例应用
pnpm run start              # 启动 plus-vue3 示例
pnpm run el-v2              # 启动 element-ui + vue2.7 示例
```

**核心构建配置**:
- `packages/core/rollup.config.js` — CJS/ESM/UMD 产物
- `packages/element-plus/vite.config.ts` — 文档构建（基于 @element-plus/vitepress）

### 单测与代码质量

#### 运行测试

```bash
# 添加 Vitest（首次）
pnpm add -D -w vitest

# 运行单测
pnpm -w vitest run                    # 完整测试
pnpm -w vitest run --watch            # 监听模式
pnpm -w vitest use/plain/index.spec   # 运行特定文件
```

#### Linting 与格式化

```bash
# ESLint 配置基于 @antfu/eslint-config
pnpm run lint              # 检查
pnpm run lint:fix          # 自动修复

# 关键规则（eslint.config.mjs）:
# - 4 空格缩进 (stylistic.indent)
# - 强制分号 (semi)
# - import 排序 (perfectionist/sort-imports)
# - 最多 1 条语句/行 (max-statements-per-line)
```

#### 测试文件约定

- 测试文件: `**/*.spec.ts`
- 模拟 vue-demi 在纯 Node 环境运行（见 `packages/core/use/plain/index.spec.ts`）
- 使用 `vi.fn()` 追踪函数调用，覆盖搜索、重置、校验、依赖追踪等核心流程

### 版本发布

使用 **changesets** 管理版本与发布：

```bash
pnpm run cg                 # 创建 changeset
pnpm run cg:version         # 版本更新 + 构建
pnpm run cg:publish         # 发布到 npm
```

相关文件: `.changeset/`、`CHANGELOG.md` 各包内存放

## 代码规范与模式

### Props 定义规范

使用泛型工厂函数定义可重用的 props：

```typescript
// packages/core/use/plain/types.ts
export function plainPropsGeneric<T, Query>() {
    return {
        field: { type: String, required: true },
        query: { type: Object, required: true },
        options: { type: Array, default: () => [] },
        // ...
    } as const;
}
export const plainProps = plainPropsGeneric();
export type PlainProps<T, Q> = ReturnType<typeof plainPropsGeneric<T, Q>>;
```

**为什么**: 既支持 Vue 2 `ExtractPropTypes` 类型推断，又支持 Vue 3 完整的泛型。

### Watch 链路设计

`usePlain` 中的 watch 链路（约 8 条）处理不同的更新场景：

| Watch 目标 | 触发时机 | 作用 |
|----------|---------|------|
| `finalOption` | 数据源改变 | 同步到 wrapper.options 存储 |
| `field` | 字段名改变 | 清理旧字段，更新父级 query |
| `checked.value` | 值改变 | 同步到 wrapper.query，触发搜索（若 realtime） |
| `depend` | 依赖标志改变 | 触发 getOption，重置值 |
| `optionsDepend` | 依赖数据源标志改变 | 同上 |
| `getOptions` 函数 | props 改变 | 重新加载数据源 |
| `props.initialValue` | props 改变 | 更新覆盖值 |
| `query[dependFields]` | 依赖字段值改变 | 清空当前值，重新加载数据源 |

**修改建议**: 若需增加新的响应式场景，在相应 watch 中添加逻辑，不要创建新的 watch（避免副作用交叉）。

### 空值处理

全项目的空值转换通过 `emptyToValue` 工具（`utils/base.ts`）统一处理：

- `emptyValues` (props) — 定义哪些值被视为空 (默认: `['', null, undefined]`)
- `emptyValue` (props) — 空值转换的目标值 (默认: `undefined`)

使用场景:
```typescript
// usePlain 中
const value = emptyToValue(checked.value, props.emptyValue);
// 如果 checked.value 在 emptyValues 中，返回 emptyValue；否则返回原值
```

### 依赖追踪

`usePlain` 的 `depend` 特性支持级联清空和重新加载：

```typescript
if (!isNeedReset || isEmptyValue(checked.value) || !allowDependChangeValue.value) return;
change(getAppointProp('defaultValue'));  // 依赖项改变时重置为默认值
```

**限制**: 目前不支持链式依赖（A 依赖 B，B 依赖 C），若需要应在 UI 层手动管理。

## 关键文件速查表

| 文件 | 职责 | 关键导出 |
|-----|------|---------|
| `packages/core/use/wrapper/index.ts` | 表单容器逻辑 | `useWrapper`, `execOnCallback` |
| `packages/core/use/plain/index.ts` | 表单项逻辑 | `usePlain` |
| `packages/core/use/constant.ts` | 通信协议定义 | `ProvideValue`, `CommonMethod`, `provideKey` |
| `packages/core/utils/base.ts` | 工具函数库 | `emptyToValue`, `clone`, `get`, `isArray` 等 |
| `packages/element-plus/components/*/index.ts` | UI 适配实现 | 各组件包装（Input、Select 等） |
| `examples/plus-vue3/src/App.vue` | 完整示例 | 实际使用参考 |

## 扩展点与常见任务

### 添加新的表单字段类型

1. 在 `packages/element-plus/components/{type}/` 创建适配组件
2. 在 `packages/element-plus/components/index.ts` 导出
3. 使用 `usePlain` 处理逻辑，组件负责 UI（参考 `packages/element-plus/components/input/`）

### 修改校验逻辑

- 全局校验: 修改 `packages/core/use/wrapper/index.ts` 的 `validateToast` 函数
- 字段级校验: 通过 props 传入 `validator` 函数

### 增加新的生命周期钩子

在 `packages/core/use/plain/types.ts` 的 `HookOption` 接口中添加，然后在 `usePlain` 中相应位置调用（见 `initialProps.hooks?.created?.`）

### 支持新的依赖场景

编辑 `usePlain` 中的 depend 相关 watch，或在 `wrapper` 中扩展 `insetSearch` 的逻辑

## 常见陷阱与最佳实践

1. **Watch 副作用交叉**: 避免在一个 watch 内改变另一个 watch 的依赖项；使用 `useDisableInCurrentCycle` 来禁用某个周期内的响应
2. **Ref vs 普通值**: 所有状态必须通过 `ref` 或 `reactive` 创建，以支持响应式更新
3. **Props 变化同步**: 修改 props 后，相应的内部 `ref` 需要通过 watch 同步（见 `coverProps`）
4. **Deep Clone**: 修改复杂对象前需要 `clone()`，避免引用污染（见 `checked.value` 的处理）

## 贡献建议

- **修改时优先查阅**: `packages/core/use/constant.ts`（理解通信契约）→ `plain/index.ts`（理解字段逻辑）→ `wrapper/index.ts`（理解容器逻辑）
- **新增功能**: 先在 `useWrapper` 或 `usePlain` 中添加 option，再在 UI 适配层消费
- **测试覆盖**: 每个 hook 和工具函数都应有对应的 `.spec.ts` 文件；使用中文注释便于国内开发者阅读
- **文档同步**: 修改 props 时更新对应的 `README.md`（如 `packages/core/use/plain/README.md`）

---

**最后更新**: 2025-12-29  
**适用版本**: v0.1.0+
