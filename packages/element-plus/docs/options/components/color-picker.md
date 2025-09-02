# ColorPicker 颜色选择器

`ColorPicker` 组件是一个基于 `ElementPlus` 颜色选择器的封装组件, 支持颜色选择和格式转换.

## 基本用法

```tsx
import { defineOption } from '@xiaohaih/json-form-plus';

defineOption({
    theme: {
        t: 'color-picker',
        label: '主题色',
    },
});
```

## Props

支持 [共享 Props](../shares/share-props.md) 和 [ElColorPicker 自带的 Props](https://element-plus.org/zh-CN/component/color-picker.html#attributes)

## 插槽

- 插槽项请参考 [`ElColorPicker.slots`](https://element-plus.org/zh-CN/component/color-picker.html)

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

### 基础颜色选择

```tsx
defineOption({
    primary: {
        t: 'color-picker',
        label: '主色调',
        defaultValue: '#409EFF',
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7543932276728397859)

<Iframe src="https://code.juejin.cn/pen/7543932276728397859" />
:::

### 预设颜色 + 不同格式 + 设置透明度 + 自定义大小

```tsx
defineOption({
    color: {
        t: 'color-picker',
        label: '颜色',
        predefine: ['#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585',],
    },
    hsl: {
        t: 'color-picker',
        label: 'hsl',
        colorFormat: 'hsl',
    },
    alpha: {
        t: 'color-picker',
        label: '设置透明度',
        showAlpha: true,
    },
    size: {
        t: 'color-picker',
        label: '调整大小',
        size: 'large',
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7543932927597445163)

<Iframe src="https://code.juejin.cn/pen/7543932927597445163" />
:::

## 注意事项

1. 支持 `ElFormItem` 组件所有的 `Props`
2. 支持 `ElColorPicker` 组件所有的 `Props`

::: info tips: 当 `ElFormItem` 组件与 `ElColorPicker` 组件的 `Props` 冲突时

- 可通过 `formItemProps` 将属性传递给 `ElFormItem`

- 可通过 `staticProps` 将属性传递给 `ElColorPicker`

:::
