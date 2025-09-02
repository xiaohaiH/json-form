# Rate 评分

`Rate` 组件是一个基于 `ElementPlus` 评分的封装组件, 用于星级评分.

## 基本用法

```tsx
import { defineOption } from '@xiaohaih/json-form-plus';

defineOption({
    rating: {
        t: 'rate',
        label: '评分',
    },
});
```

## Props

支持 [共享 Props](../shares/share-props.md) 和 [ElRate 自带的 Props](https://element-plus.org/zh-CN/component/rate.html#attributes)

## 插槽

- 插槽项请参考 [`ElRate.slots`](https://element-plus.org/zh-CN/component/rate.html#)

- 插槽实际的 `Props` 等于**插槽自带的 `Props` + `SlotProps`**

::: details SlotProps 声明如下

<<< ../declaration.ts#slotProps

---

<<< ../declaration.ts#plain
:::

## 示例

<script setup>
import Iframe from '../../vue-components/iframe.vue';
</script>

### 基础评分 + 自定义最大值 + 半星评分

```tsx
defineOption({
    score: {
        t: 'rate',
        label: '评分',
        max: 10,
        allowHalf: true,
        defaultValue: 3,
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7545015141579980836)

<Iframe src="https://code.juejin.cn/pen/7545015141579980836" />
:::

### 带文字说明

```tsx
defineOption({
    display: {
        t: 'rate',
        label: '显示评分',
        // disabled: true,
        defaultValue: 4,
        showText: true,
        texts: ['很差', '较差', '一般', '较好', '很好'],
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7545015351869161512)

<Iframe src="https://code.juejin.cn/pen/7545015351869161512" />
:::

## 注意事项

1. 支持 `ElFormItem` 组件所有的 `Props`
2. 支持 `ElRate` 组件所有的 `Props`

::: info tips: 当 `ElFormItem` 组件与 `ElRate` 组件的 `Props` 冲突时

- 可通过 `formItemProps` 将属性传递给 `ElFormItem`

- 可通过 `staticProps` 将属性传递给 `ElRate`

:::
