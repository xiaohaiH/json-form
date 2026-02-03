# @xiaohaih/json-form-el

## 0.2.5

### Patch Changes

- 修复动态表单重置时, 父级提供的 defaultValue 被子级覆盖, 并增加相应的测试代码
- Updated dependencies
  - @xiaohaih/json-form-core@0.2.5

## 0.2.4

### Patch Changes

- 1. 修复设置默认值时, 数组算空值, 保持与 checked.value 一样的逻辑
- 2. wrapper 增加 fromRef 的注入
- 3. 调整 dynamic-group 的逻辑, 使其更符合真实场景
- 4. 调整 group 插槽的参数
- Updated dependencies
  - @xiaohaih/json-form-core@0.2.4

## 0.2.3

### Patch Changes

- 1. defineOption 增加返回函数(暴露了 query, wrapper, formRef 供配置项使用)
- 2. 支持事件的传入(通过 on 属性传)
- 3. 插槽声明全部进行了调整
- 4. 删除 dynamicProps, staticProps 等属性
- Updated dependencies
  - @xiaohaih/json-form-core@0.2.3

## 0.2.2

### Patch Changes

- 调整 defineOption 的声明以及返回格式(支持定义数组, 返回类型为 Ref)
- Updated dependencies
  - @xiaohaih/json-form-core@0.2.2

## 0.2.1

### Patch Changes

- 1. core 模块的 model-value 改为 model(与主流框架保持统一)
- 2. 修复插槽参数错误传递导致无法使用
- Updated dependencies
  - @xiaohaih/json-form-core@0.2.1

## 0.2.0

### Minor Changes

- 1. 核心模块的逻辑重构(core)
- 2. 核心模块增加单元测试(core)
- 3. 增加 autocomplete 组件
- 4. custom-render 支持直接传递组件
- 5. 其他更改若干

## 0.1.12

### Patch Changes

- 修复上传组件覆盖上传时未自动上传

## 0.1.11

### Patch Changes

- 1. 增加生命周期以及事件回调
- 2. 修复打包后的 umd 还存在环境变量
- 3. 修复 input类组件的 bug (延时未生效, 按下回车后的用户体验)
- Updated dependencies
  - @xiaohaih/json-form-core@0.1.11

## 0.1.10

### Patch Changes

- 支持对类下拉框组件的远程数据请求
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

- 修复单选框label无法定义, 单个单选框无法取消选中

## 0.1.5

### Patch Changes

- 修复element-plus在高版本中声明提示存在的问题
- 修复 datum 更改后不生效的问题
- Updated dependencies
  - @xiaohaih/json-form-core@0.1.5

## 0.1.4

### Patch Changes

- 修复初始值为空数组, 且存在默认值时, 未用默认值替换空数组
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

- 1. radio, checkbox增加默认插槽;

## 0.1.0

### Minor Changes

- 1. 增加版本导出; 2. 修复声明, 3. 更新表单容器的声明

### Patch Changes

- Updated dependencies
  - @xiaohaih/json-form-core@0.1.0

## 0.0.1

### Patch Changes

- 初始化项目, 已实现基于element-ui渲染的json-form
  - @xiaohaih/json-form-core@0.0.1
