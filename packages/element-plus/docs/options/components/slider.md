# Slider 滑块

`Slider` 组件是一个基于 `ElementPlus` 滑块的封装组件, 用于数值范围的选择.

## 基本用法

```tsx
import { defineOption } from '@xiaohaih/json-form-plus';

defineOption({
    volume: {
        t: 'slider',
        label: '音量',
    },
});
```

## Props

支持 [共享 Props](../shares/share-props.md) 和 [ElSlider 自带的 Props](https://element-plus.org/zh-CN/component/slider.html#%E5%B1%9E%E6%80%A7)

## 插槽

- 插槽项请参考 [`ElSlider.slots`](https://element-plus.org/zh-CN/component/slider.html#api)

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

### 基础滑块 + 范围滑块

```tsx
defineOption({
    progress: {
        t: 'slider',
        label: '进度',
        defaultValue: 50,
    },
    range: {
        t: 'slider',
        label: '范围',
        range: true,
        initialValue: [10, 30]
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7545043868123660326)

<Iframe src="https://code.juejin.cn/pen/7545043868123660326" />
:::

### 带标记 + 自定义步长 + 垂直滑块

```tsx
defineOption({
    level: {
        t: 'slider',
        label: '等级',
        marks: {
            0: '0°C',
            26: '26°C',
            37: '37°C',
            100: '100°C',
        },
    },
    precision: {
        t: 'slider',
        label: '精度',
        step: 0.1,
        min: 0,
        max: 1,
    },
    height: {
        t: 'slider',
        label: '高度',
        vertical: true,
        height: '200px',
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7545044171657052169)

<Iframe src="https://code.juejin.cn/pen/7545044171657052169" />
:::

## 注意事项

1. 支持 `ElFormItem` 组件所有的 `Props`
2. 支持 `ElSlider` 组件所有的 `Props`

::: info tips: 当 `ElFormItem` 组件与 `ElSlider` 组件的 `Props` 冲突时

- 可通过 `formItemProps` 将属性传递给 `ElFormItem`

- 可通过 `staticProps` 将属性传递给 `ElSlider`

:::
