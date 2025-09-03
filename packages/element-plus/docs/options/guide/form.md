# HForm 表单组件

`HForm` 是对 `ElForm` 包装后的组件, 支持 `ElForm` 的所有属性(`model` 外部不需要再传递了)

## 基本用法

```vue
<template>
    <HForm
        :datum="formOption"
        :render-btn="false" :realtime="true"
        @search="log" @submit.prevent
    />
</template>

<script lang="tsx" setup>
import { defineOption, HForm } from '@xiaohaih/json-form-plus';

function formOption() {
    return defineOption({
        name: { t: 'input', label: '姓名', placeholder: '请输入' },
    });
}
const log = console.log.bind(null, '表单值: ');
</script>
```

## Props

除了 [ElForm 自带的 Props](https://element-plus.org/zh-CN/component/form.html#form-attributes) 外, `HForm` 组件还支持以下特定属性:

### datum

- 类型: `Function | object`
- 默认: `-`

给表单提供的 `json` 数据, 通过 `@xiaohaih/json-form-plus` 暴露出的 `defineOption` 生成

::: details 示例

```tsx
import { defineOption } from '@xiaohaih/json-form-plus';

function formOption() {
    return defineOption({
        name: {
            t: 'input',
            label: '姓名',
            placeholder: '请输入',
            rules: [{ required: true, message: '不能为空' }]
        },
        age: { t: 'input-number', label: 'age', placeholder: '请输入' },
    });
}
```

:::

### realtime

- 类型: `boolean`
- 默认: `-`

是否在数据发生变动后实时触发搜索事件

### searchAtDatumChanged

- 类型: `boolean`
- 默认: `-`

是否在数据源发生改变后触发一次搜索事件

### backfill

- 类型: `object`
- 默认: `-`

等同 `ElForm` 的 `model`

### validator

- 类型: `(query: Record<string, any>) => any | Promise<any>`
- 默认: `-`

搜索事件触发时调用的校验函数, 返回值为真且是字符串时会执行 `toast` 方法, 优先调用配置项中的 `validator`, 全部通过后才会调用此方法

::: warning 提示
该方法与 `ElForm.validate`, `ElForm.rules` 是有区别的, 前者是 `HForm` 针对 `query` 进行处理后产生反馈提示, 后者是 `ElForm` 提供的校验
:::

### toast

- 类型: `(msg: string) => void`
- 默认: `-`

校验失败时, 产生的提示语

### readonly

- 类型: `boolean`
- 默认: `-`

表单只读(类似 `Select` 之类没有只读的, 自动改为禁用), `custom-render` 内的组件需要自己主动实现(通过读取 `plain.globalReadonly` 属性读取)

### disabled

- 类型: `boolean`
- 默认: `-`

表单禁用, `custom-render` 内的组件需要自己主动实现(通过读取 `plain.globalDisabled` 属性读取)

### immediateSearch

- 类型: `boolean`
- 默认: `-`

渲染后是否触发搜索事件(存在默认值时, 需要设置为真, 否则与外部不一致)

### triggerSearchAtReset

- 类型: `boolean`
- 默认: `-`

重置时是否触发搜索事件

### renderBtn

- 类型: `boolean`
- 默认: `true`

渲染搜索与重置按钮(由于历史包袱无法删除, 外部手动置为 `false` 即可)

### searchText

- 类型: `string`
- 默认: `搜索`

搜索按钮文字

### resetText

- 类型: `string`
- 默认: `重置`

重置按钮文字

## HForm Exposes

### formRef

- `ElForm` 的 `ref` 引用

### options

- `datum` 对象(如果是函数, 则是其返回值)

### reset

- 重置表单, 注意: 不要调用 `ElForm.resetFields`

### validate

- 校验表单, 参考 `ElForm.validate`

### validateField

- 校验表单字段, 参考 `ElForm.validateField`

### clearValidate

- 清空校验结果, 参考 `ElForm.clearValidate`

### scrollToField

- 滚动到指定的字段, 参考 `ElForm.scrollToField`

### getField

- 获取字段的 context, 参考 `ElForm.getField`

### ...

- `useWrapper` 的返回值, 可查看 [`prepend`](#prepend) 中的 `SlotsProps.wrapper` 对象内的属性

## 插槽

### prepend

- 在 `json` 数据前渲染

::: details `slotProps`

<<< ../declaration.ts#wrapper

:::

### default

- 在 `json` 数据后渲染

::: details `slotProps`

<<< ../declaration.ts#wrapper

:::

### btn

- 搜索重置按钮的插槽

::: details `slotProps`

```tsx
interface SlotProps {
    /** 触发表单搜索 */
    search: () => void;
    /** 重置表单 */
    reset: () => void;
    /** 重置并触发表单搜索 */
    resetAndSearch: () => void;
}
```

:::

## 注意事项

1. 支持 `ElForm` 组件所有的 `Props`
2. 不要调用 `ElForm` 的 `resetFields` 方法, 应调用 `HForm` 组件的 `reset` 方法
