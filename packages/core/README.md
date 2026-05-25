# @xiaohaih/json-form-core

[![npm version](https://img.shields.io/npm/v/@xiaohaih/json-form-core.svg)](https://www.npmjs.com/package/@xiaohaih/json-form-core)
[![npm downloads](https://img.shields.io/npm/dm/@xiaohaih/json-form-core.svg)](https://www.npmjs.com/package/@xiaohaih/json-form-core)

`@xiaohaih/json-form-core` 是 json-form 库的核心模块，提供零 UI 依赖的纯逻辑实现。它通过组合式 API 实现表单项的状态管理、依赖关系追踪、数据源管理等核心功能。

## ✨ 特性

- 🚀 **零 UI 依赖**: 纯逻辑实现，不依赖任何 UI 框架
- 🔄 **组合式 API**: 基于 Vue 3 Composition API，支持 Vue 2.7+
- 📦 **TypeScript**: 完整的类型定义和类型推导
- 🎯 **依赖追踪**: 智能的字段间依赖关系管理
- 🔍 **数据源管理**: 支持静态和动态数据源，优先级自动处理
- ✅ **表单校验**: 内置简单的全局校验机制，支持异步校验
- 🔗 **生命周期钩子**: 丰富的钩子函数用于自定义逻辑
- 🧩 **模块化设计**: 核心功能解耦，支持扩展

## 📦 安装

```bash
# 使用 pnpm
pnpm add @xiaohaih/json-form-core

# 或使用 npm
npm install @xiaohaih/json-form-core

# 或使用 yarn
yarn add @xiaohaih/json-form-core
```

## 🏗️ 架构设计

### 核心概念

json-form 采用 **组合式架构设计**，将表单逻辑与 UI 层完全解耦：

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI 适配层     │    │   核心逻辑层     │    │   业务逻辑层     │
│                 │    │                 │    │                 │
│ • Element Plus  │◄──►│ • useWrapper     │◄──►│ • 表单配置      │
│ • Element UI    │    │ • usePlain       │    │ • 数据处理      │
│ • 其他 UI 库    │    │ • 状态管理       │    │ • 业务规则      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 核心组件

#### useWrapper (容器组件)

表单容器的核心逻辑，负责：

- 管理整个表单的状态 (`query` 对象)
- 协调所有表单项的注册和通信
- 处理搜索事件和校验流程
- 支持 `backfill` 和 `model` 双模式

#### usePlain (表单项组件)

单个表单项的核心逻辑，负责：

- 管理字段值的状态同步
- 处理依赖关系和级联更新
- 管理数据源的获取和缓存
- 执行字段级校验

## 🚀 快速开始

### 基础用法

```typescript
import { usePlain, useWrapper } from '@xiaohaih/json-form-core';

// 1. 创建容器
const wrapperProps = {
    backfill: { username: '', status: 'active' },
    realtime: true,
    onSearch: (query) => {
        console.log('搜索条件:', query);
    // 执行搜索逻辑
    }
};

const wrapper = useWrapper(wrapperProps);

// 2. 创建表单项
const plainProps = {
    field: 'username',
    query: wrapper.query,
    validator: (query) => {
        if (!query.username) return '用户名不能为空';
    }
};

const plain = usePlain(plainProps);

// 3. 使用
console.log(plain.checked.value); // 获取当前值
plain.change('new value'); // 改变值
wrapper.search(); // 触发搜索
```

### 依赖关系

```typescript
// 省份选择影响城市选项
const provincePlain = usePlain({
    field: 'province',
    query: wrapper.query,
    options: [
        { label: '北京市', value: 'beijing' },
        { label: '上海市', value: 'shanghai' }
    ]
});

const cityPlain = usePlain({
    field: 'city',
    depend: true,
    dependFields: 'province',
    getOptions: (cb, query) => {
    // 根据省份获取城市列表
        fetchCities(query.province).then(cb);
    }
});
```

## 📚 API 参考

### useWrapper

#### Props

| 属性名     | 类型                                  | 默认值      | 描述                 |
| :--------- | :------------------------------------ | :---------- | :------------------- |
| realtime   | `boolean`                             | `undefined` | 是否实时触发搜索事件 |
| backfill   | `Record<string, any>`                 | -           | 回填数据             |
| model | `Record<string, any>`                 | -           | 双向绑定值           |
| validator  | `(query: Record<string, any>) => any` | -           | 表单级校验函数       |
| toast      | `(msg: string) => void`               | -           | 校验失败提示         |
| readonly   | `boolean`                             | -           | 表单只读状态         |
| disabled   | `boolean`                             | -           | 表单禁用状态         |

#### 返回值

```typescript
interface WrapperExpose {
    child: CommonMethod[]; // 已注册的子组件
    query: Ref<Record<string, any>>; // 表单查询对象
    search: () => Promise<void>; // 触发搜索
    reset: () => void; // 重置表单
    validateToast: () => Promise<any>; // 执行校验
}
```

### usePlain

#### Props

| 属性名       | 类型                  | 默认值 | 描述             |
| :----------- | :-------------------- | :----- | :--------------- |
| field        | `string`              | -      | 字段名           |
| query        | `Record<string, any>` | -      | 查询对象         |
| options      | `any[]`               | `[]`   | 静态数据源       |
| getOptions   | `GetOptions`          | -      | 动态数据源函数   |
| depend       | `boolean`             | -      | 是否依赖其他字段 |
| dependFields | `string \| string[]`  | -      | 依赖字段         |
| validator    | `Validator`           | -      | 字段校验函数     |
| initialValue | `any`                 | -      | 初始值           |
| defaultValue | `any`                 | -      | 默认值           |

#### 返回值

```typescript
interface PlainExpose {
    checked: ComputedRef<any>; // 当前值
    loading: Ref<boolean>; // 加载状态
    finalOption: ComputedRef<any[]>; // 最终数据源
    change: (value: any) => void; // 改变值
    reset: () => void; // 重置字段
    search: () => void; // 触发搜索
}
```

## 🗂️ 目录结构

```
packages/core/
├── index.ts              # 入口文件
├── interface.ts          # 类型定义
├── version.ts            # 版本信息
├── use/                  # 核心逻辑
│   ├── index.ts          # use 层导出
│   ├── constant.ts       # 常量和接口定义
│   ├── wrapper/          # 容器组件逻辑
│   │   ├── index.ts      # useWrapper 实现
│   │   ├── types.ts      # wrapper 类型定义
│   │   └── README.md     # wrapper 文档
│   └── plain/            # 表单项逻辑
│       ├── index.ts      # usePlain 实现
│       ├── types.ts      # plain 类型定义
│       └── README.md     # plain 文档
├── utils/                # 工具函数
│   ├── index.ts          # 工具导出
│   └── base.ts           # 基础工具
└── README.md             # 模块文档
```

## 🔧 开发指南

### 环境要求

- **Vue**: 3.0+ 或 2.7+ 或 @vue/composition-api 支持的版本
- **TypeScript**: 4.0+
- **Node.js**: 16+

### Peer Dependencies

```json
{
    "vue": "^3.0.0-0 || ^2.0.0",
    "@vue/composition-api": "^1.0.0-rc.1" // Vue 2.7+ 可选
}
```

### 构建

```bash
# 构建核心模块
pnpm run build

# 运行测试
pnpm run test
```

### 扩展开发

#### 添加新的表单项类型

1. 在 `use/plain/` 目录下实现新的逻辑
2. 在 `types.ts` 中定义对应的 props
3. 在 UI 适配层使用该逻辑

#### 自定义数据源

```typescript
const customPlain = usePlain({
    field: 'customField',
    getOptions: async (cb, query, option) => {
        const data = await fetchCustomData(query);
        cb(data);

        // 可通过 option 控制行为
        option.changeDefaultValue(data[0]);
    }
});
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

ISC License

## 🔗 相关链接

- [项目主页](https://github.com/xiaohaiH/json-form/tree/master/packages/core)
- [ElementPlus 适配](https://github.com/xiaohaih/json-form/tree/master/packages/element-plus)
- [ElementUI 适配](https://github.com/xiaohaih/json-form/tree/master/packages/element-ui)
- [Vant 适配](https://github.com/xiaohaih/json-form/tree/master/packages/vant)
- [使用示例](https://github.com/xiaohaih/json-form/tree/master/examples)
