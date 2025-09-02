# InputNumber 数字输入框

`InputNumber` 组件是一个基于 `ElementPlus` 数字输入框的封装组件, 专门用于数字类型的输入.

## 基本用法

```tsx
import { defineOption } from '@xiaohaih/json-form-plus';

defineOption({
    age: {
        t: 'input-number',
        label: '年龄',
        placeholder: '请输入年龄',
    },
});
```

## Props

除了 [共享 Props](../shares/share-props.md) 和 [ElInputNumber 自带的 Props](https://element-plus.org/zh-CN/component/input-number.html#attributes) 外, `InputNumber` 组件还支持以下特定属性:

### debounceTime

- 类型: `number`
- 默认: -

延迟触发抖动时长(单位 `ms`)

## 插槽

- 插槽项请参考 [`ElInputNumber.slots`](https://element-plus.org/zh-CN/component/input-number.html#slots)

- 插槽实际的 `Props` 等于**插槽自带的 `Props` + `SlotProps`**

::: details 插槽示例

```tsx
defineOption({
    num: {
        t: 'input-number',
        label: '数值',
        itemSlots: {
            prefix: () => h('div', '前缀'),
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

### 基础数字输入 + 带精度控制

```tsx
defineOption({
    quantity: {
        t: 'input-number',
        label: '数量',
        placeholder: '请输入数量',
        min: 0,
        max: 100,
    },
    price: {
        t: 'input-number',
        label: '价格',
        placeholder: '请输入价格',
        precision: 2,
        step: 0.1,
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7543940513415331875)

<Iframe src="https://code.juejin.cn/pen/7543940513415331875" />
:::

### 实时搜索

```tsx
defineOption({
    score: {
        t: 'input-number',
        label: '评分',
        placeholder: '请输入评分',
        debounceTime: 500,
        min: 0,
        max: 100,
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7543941425876959284)

<Iframe src="https://code.juejin.cn/pen/7543941425876959284" />
:::

## 注意事项

1. 支持 `ElFormItem` 组件所有的 `Props`
2. 支持 `ElInputNumber` 组件所有的 `Props`
3. 可以通过 `debounceTime` 设置抖动时长, 避免频繁触发搜索

::: info tips: 当 `ElFormItem` 组件与 `ElInputNumber` 组件的 `Props` 冲突时

- 可通过 `formItemProps` 将属性传递给 `ElFormItem`

- 可通过 `staticProps` 将属性传递给 `ElInputNumber`

:::
