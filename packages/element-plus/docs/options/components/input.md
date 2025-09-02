# Input 输入框

`Input` 组件是一个基于 `ElementPlus` 输入框的封装组件, 提供了统一的配置接口和增强功能.

## 基本用法

```tsx
import { defineOption } from '@xiaohaih/json-form-plus';

defineOption({
    username: {
        t: 'input',
        label: '用户名',
        placeholder: '请输入用户名',
    },
});
```

## Props

除了 [共享 Props](../shares/share-props.md) 和 [ElInput 自带的 Props](https://element-plus.org/zh-CN/component/input.html#attributes) 外, `Input` 组件还支持以下特定属性:

### realtime

- 类型: `boolean`
- 默认: `true`

是否实时触发搜索事件

### waitTime

- 类型: `number`
- 默认: `300`

实时触发时防抖动的时间

### clearable

- 类型: `boolean`
- 默认: `true`

是否显示清除按钮

## 插槽

- 插槽项请参考 [`ElInput.slots`](https://element-plus.org/zh-CN/component/input.html#slots)

- 插槽实际的 `Props` 等于**插槽自带的 `Props` + `SlotProps`**

::: details 插槽示例

```tsx
defineOption({
    sex: {
        t: 'input',
        label: '延迟时长',
        placeholder: '请输入',
        itemSlots: {
            suffix: () => h('div', 'ms'),
        },
    },
});
```

:::

::: details SlotProps 声明如下

<<< ../declaration.ts#slotProps

---

<<< ../declaration.ts#plain
:::

## 示例

<script setup>
import Iframe from '../../vue-components/iframe.vue';
</script>

### 基础输入框 + 文本域

```tsx
defineOption({
    name: {
        t: 'input',
        label: '姓名',
        placeholder: '请输入姓名',
    },
    textarea: {
        t: 'input',
        label: '说明',
        type: 'textarea',
        placeholder: '请输入说明',
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7544961553456758794)

<Iframe src="https://code.juejin.cn/pen/7544961553456758794" />
:::

### 带前缀后缀

```tsx
defineOption({
    prefix: {
        t: 'input',
        label: '价格',
        placeholder: '请输入价格',
        itemSlots: {
            prefix: '¥',
            suffix: '元',
        },
    },
    domain: {
        t: 'input',
        label: '域名',
        placeholder: '请输入域名',
        itemSlots: {
            prepend: 'https://',
            append: '.com',
        },
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7544990430547738634)

<Iframe src="https://code.juejin.cn/pen/7544990430547738634" />
:::

## 注意事项

1. 当 `realtime` 为 `true` 时, 输入会实时触发搜索事件
2. 可以通过 `waitTime` 设置防抖时间, 避免频繁触发搜索
3. 支持 `ElFormItem` 组件所有的 `Props`
4. 支持 `ElCheckbox` 组件所有的 `Props`

::: info tips: 当 `ElFormItem` 组件与 `ElInput` 组件的 `Props` 冲突时

- 可通过 `formItemProps` 将属性传递给 `ElFormItem`

- 可通过 `staticProps` 将属性传递给 `ElInput`

:::
