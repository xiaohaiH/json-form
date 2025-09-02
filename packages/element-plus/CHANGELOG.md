# @xiaohaih/json-form-plus

## 0.1.11

### Patch Changes

- 1. 增加生命周期以及事件回调
- 2. 增加 vitepress 文档
- 3. 修复打包后的 umd 还存在环境变量
- 4. 修复 input类组件的 bug (延时未生效, 按下回车后的用户体验)
- Updated dependencies
  - @xiaohaih/json-form-core@0.1.11

## 0.1.10

### Patch Changes

- 1. 修复 tree-select props 的错误声明
- 2. 支持对类下拉框组件的远程数据请求
- Updated dependencies
  - @xiaohaih/json-form-core@0.1.10

## 0.1.9

### Patch Changes

- 修复下拉框存在分组时搜索无法过滤

## 0.1.8

### Patch Changes

- 取消引用类型的比较
- Updated dependencies
  - @xiaohaih/json-form-core@0.1.8

## 0.1.7

### Patch Changes

- 支持表单级别的只读, 优化custom-render的开发体验
- Updated dependencies
  - @xiaohaih/json-form-core@0.1.7

## 0.1.6

### Patch Changes

- 修复element-plus 2.6.0以下版本单选框label无法定义

## 0.1.5

### Patch Changes

- 修复element-plus在高版本中声明提示存在的问题
- 修复 datum 更改后不生效的问题
- Updated dependencies
  - @xiaohaih/json-form-core@0.1.5

## 0.1.4

### Patch Changes

- 修复初始值为空数组, 且存在默认值时, 未用默认值替换空数组
- 调整 tree-select props 的声明, 防止不同版本的变量导出不一样导致报错
- Updated dependencies
  - @xiaohaih/json-form-core@0.1.4

## 0.1.3

### Patch Changes

- 更新 AssistOption 类型声明, 支持主动声明时可声明未在配置中的字段, 支持回调中的 query 和 options 可读取未声明的字段

## 0.1.2

### Patch Changes

- 1. 重构多个组件的插槽属性, 统一为 extraOptions 并调整声明

## 0.1.1

### Patch Changes

- 1. radio, checkbox增加默认插槽; 2. 增加 input-tag, segmented 组件

## 0.1.0

### Minor Changes

- 1. 增加版本导出; 2. 修复声明, 3. 更新表单容器的声明

### Patch Changes

- Updated dependencies
  - @xiaohaih/json-form-core@0.1.0

## 0.0.1

### Patch Changes

- 初始化项目, 已实现基于element-plus渲染的json-form
- Updated dependencies
  - @xiaohaih/json-form-core@0.0.1
