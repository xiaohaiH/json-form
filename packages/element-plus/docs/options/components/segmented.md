# Segmented 分段控制器

`Segmented` 组件是一个基于 `ElementPlus` 分段控制器的封装组件, 用于在多个选项之间进行切换.

## 基本用法

```tsx
import { defineOption } from '@xiaohaih/json-form-plus';

defineOption({
    view: {
        t: 'segmented',
        label: '视图',
        options: [
            { label: '列表', value: 'list' },
            { label: '网格', value: 'grid' },
        ],
    },
});
```

## Props

支持 [共享 Props](../shares/share-props.md) 和 [ElSegmented 自带的 Props](https://element-plus.org/zh-CN/component/segmented.html#%E5%B1%9E%E6%80%A7)

## 插槽

- 插槽项请参考 [`ElSegmented.slots`](https://element-plus.org/zh-CN/component/segmented.html#slots)

- 插槽实际的 `Props` 等于**插槽自带的 `Props` + `SlotProps`**

::: details 插槽示例

```tsx
defineOption({
    theme: {
        t: 'segmented',
        label: '主题',
        options: [
            { label: '浅色', value: 'light' },
            { label: '深色', value: 'dark' },
            { label: '自动', value: 'auto' },
        ],
        itemSlots: {
            default: ({ item }) => h('div', `prefix-${item.label}`),
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

### 基础分段控制器 + 禁用选项

```tsx
defineOption({
    theme: {
        t: 'segmented',
        label: '主题',
        options: [
            { label: '浅色', value: 'light' },
            { label: '深色', value: 'dark' },
            { label: '自动', value: 'auto' },
        ],
    },
    status: {
        t: 'segmented',
        label: '状态',
        options: [
            { label: '全部', value: 'all' },
            { label: '进行中', value: 'pending' },
            { label: '已完成', value: 'completed', disabled: true },
        ],
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7545022095420620863)

<Iframe src="https://code.juejin.cn/pen/7545022095420620863" />
:::

### 自定义大小 + 带默认值

```tsx
defineOption({
    size: {
        t: 'segmented',
        label: '尺寸',
        size: 'large',
        options: [
            { label: '小', value: 'small' },
            { label: '中', value: 'medium' },
            { label: '大', value: 'large' },
        ],
    },
    language: {
        t: 'segmented',
        label: '语言',
        defaultValue: 'zh',
        options: [
            { label: '中文', value: 'zh' },
            { label: 'English', value: 'en' },
            { label: '日本語', value: 'ja' },
        ],
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7545022163951026186)

<Iframe src="https://code.juejin.cn/pen/7545022163951026186" />
:::

## 注意事项

1. 支持 `ElFormItem` 组件所有的 `Props`
2. 支持 `ElSegmented` 组件所有的 `Props`

::: info tips: 当 `ElFormItem` 组件与 `ElSegmented` 组件的 `Props` 冲突时

- 可通过 `formItemProps` 将属性传递给 `ElFormItem`

- 可通过 `staticProps` 将属性传递给 `ElSegmented`

:::
