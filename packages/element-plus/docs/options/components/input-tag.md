# InputTag 标签输入框

`InputTag` 组件是一个基于 `ElementPlus` 标签输入框的封装组件, 支持多标签输入和管理.

## 基本用法

```tsx
import { defineOption } from '@xiaohaih/json-form-plus';

defineOption({
    tags: {
        t: 'input-tag',
        label: '标签',
        placeholder: '请输入标签',
    },
});
```

## Props

除了 [共享 Props](../shares/share-props.md) 和 [ElInputTag 自带的 Props](https://element-plus.org/zh-CN/component/input-tag.html#%E5%B1%9E%E6%80%A7) 外, `InputTag` 组件还支持以下特定属性:

### clearable

- 类型: `boolean`
- 默认: `true`

是否显示清除按钮

## 插槽

- 插槽项请参考 [`ElInput.slots`](https://element-plus.org/zh-CN/component/input-tag.html#slots)

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

### 基础标签输入 + 限制标签数量

```tsx
defineOption({
    keywords: {
        t: 'input-tag',
        label: '关键词',
        placeholder: '请输入关键词',
        defaultValue: ['Vue', 'React'],
    },
    skills: {
        t: 'input-tag',
        label: '技能',
        placeholder: '请输入技能',
        max: 5,
    },
    colors: {
        t: 'input-tag',
        label: '颜色',
        placeholder: '请输入颜色',
        tagType: 'danger',
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7543945281654489098)

<Iframe src="https://code.juejin.cn/pen/7543945281654489098" />
:::

### 自定义标签样式 + 插槽

```tsx
defineOption({
    colors: {
        t: 'input-tag',
        label: '颜色',
        placeholder: '请输入颜色',
        tagType: 'danger',
        itemSlots: {
            tag: ({ value }) => h('div', [h('span', 'prefix-'), h('span', value)]),
        },
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7544932194788376616)

<Iframe src="https://code.juejin.cn/pen/7544932194788376616" />
:::

## 注意事项

1. 支持 `ElFormItem` 组件所有的 `Props`
2. 支持 `ElInputTag` 组件所有的 `Props`

::: info tips: 当 `ElFormItem` 组件与 `InputTag` 组件的 `Props` 冲突时

- 可通过 `formItemProps` 将属性传递给 `ElFormItem`

- 可通过 `staticProps` 将属性传递给 `InputTag`

:::
