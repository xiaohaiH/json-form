# @xiaohaih/json-form-plus

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
