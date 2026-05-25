# 简介

## 什么是 json-form-vant？

`@xiaohaih/json-form-vant` 是基于 Vant 4 的 JSON 驱动表单解决方案。通过 JSON 配置即可渲染完整的表单，支持表单项间的依赖关系、数据校验等高级功能。

## 设计理念

Vant 适配层基于 `@xiaohaih/json-form-core` 核心模块实现，将纯逻辑层与 UI 层完美结合：

```
JSON 配置 ──► 适配层解析 ──► Vant 组件
     │              │
     └──────────────┼──────────────► 核心逻辑层
                    │
                    ▼
              依赖管理、校验、状态同步
```

## 特性

- 🎨 **Vant 集成**: 深度集成 Vant 4 组件库
- 📋 **JSON 配置**: 通过 JSON 对象配置表单结构，支持配置动态表单
- 🔗 **依赖关系**: 支持表单项间的复杂依赖关系
- ✅ **表单校验**: 复用 Vant 的校验机制
- 🎯 **类型安全**: 完整的 TypeScript 类型定义
- 🔧 **高度可定制**: 支持所有 Vant 组件属性和插槽
- 📱 **响应式**: 支持响应式表单配置
- 🚀 **开箱即用**: 无需额外配置，开箱即用
- 🎪 **Vue 3 原生**: 基于 Vue 3 Composition API

## 组件类型

支持以下组件类型：

| 分类 | 组件类型 | 说明 |
| :--- | :--- | :--- |
| 基础输入 | `input` | 文本输入框 |
| 选择器 | `picker` / `select` | 选择器/下拉选择 |
| 级联选择 | `cascader` | 级联选择器 |
| 地区选择 | `area` | 省市区选择 |
| 复选框 | `checkbox` | 单个复选框 |
| 复选框组 | `checkbox-group` | 复选框组 |
| 单选框 | `radio` | 单个单选框 |
| 单选框组 | `radio-group` | 单选框组 |
| 开关 | `switch` | 开关切换 |
| 步进器 | `stepper` | 步进器 |
| 滑块 | `slider` | 滑块选择 |
| 评分 | `rate` | 评分组件 |
| 日期选择 | `date-picker` | 日期选择器 |
| 时间选择 | `time-picker` | 时间选择器 |
| 日期时间组合 | `date-time-picker-group` | 日期+时间组合选择 |
| 文件上传 | `upload` | 文件上传 |
| 签名 | `signature` | 手写签名 |
| 数字键盘 | `number-keyboard` | 数字键盘输入 |
| 密码输入 | `password-input` | 密码输入框 |
| 树形选择 | `tree-select` | 树形选择器 |
| 自定义渲染 | `custom-render` | 自定义渲染内容 |
| 分组 | `group` | 表单分组 |
| 动态列表 | `dynamic-group` | 动态增减表单项 |
| 单元格分组 | `cell-group` | 单元格分组布局 |

## 相关链接

- [GitHub 仓库](https://github.com/xiaohaiH/json-form)
- [Vant 官方文档](https://vant.pro/vant/)
- [核心库文档](https://github.com/xiaohaiH/json-form/tree/master/packages/core)
- [npm 包](https://www.npmjs.com/package/@xiaohaih/json-form-vant)
