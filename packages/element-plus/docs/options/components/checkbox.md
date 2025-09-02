# Checkbox 复选框

`Checkbox` 组件是一个基于 `ElementPlus` 复选框的封装组件, 用于布尔值的选择.

## 基本用法

```tsx
import { defineOption } from '@xiaohaih/json-form-plus';

defineOption({
    agree: {
        t: 'checkbox',
        label: '同意协议',
    },
});
```

## Props

支持 [共享 Props](../shares/share-props.md) 和 [ElCheckbox 自带的 Props](https://element-plus.org/zh-CN/component/checkbox.html#checkbox-attributes)

## 插槽

- 插槽项请参考 [`ElCheckbox.slots`](https://element-plus.org/zh-CN/component/checkbox.html#checkbox-slots)

- 插槽实际的 `Props` 等于**插槽自带的 `Props` + `SlotProps`**

::: details 插槽示例

```tsx
defineOption({
    sex: {
        t: 'checkbox',
        label: '同意协议',
        itemSlots: {
            default: () => h('div', '我已阅读并同意《用户协议》和《隐私政策》'),
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

### 基础复选框

```tsx
defineOption({
    newsletter: {
        t: 'checkbox',
        label: '订阅 newsletter',
        initialValue: true,
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7543917330028298281)

<Iframe src="https://code.juejin.cn/pen/7543917330028298281" />
:::

### 带说明文字 + 禁用状态 + 中间状态

```tsx
defineOption({
    terms: {
        t: 'checkbox',
        label: '我已阅读并同意',
        staticProps: {
            label: '我已阅读并同意《用户协议》和《隐私政策》',
        },
    },
    feature: {
        t: 'checkbox',
        label: '禁用选项',
        disabled: true,
    },
    selectAll: {
        t: 'checkbox',
        label: '全选',
        indeterminate: true,
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7543920008175288366)

<Iframe src="https://code.juejin.cn/pen/7543920008175288366" />
:::

## 注意事项

1. 支持 `ElFormItem` 组件所有的 `Props`
2. 支持 `ElCheckbox` 组件所有的 `Props`

::: info tips: 当 `ElFormItem` 组件与 `ElCheckbox` 组件的 `Props` 冲突时

- 可通过 `formItemProps` 将属性传递给 `ElFormItem`

- 可通过 `staticProps` 将属性传递给 `ElCheckbox`

:::
