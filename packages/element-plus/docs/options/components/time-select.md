# TimeSelect 时间选择

`TimeSelect` 组件是一个基于 `ElementPlus` 时间选择的封装组件, 用于时间点的选择.

## 基本用法

```tsx
import { defineOption } from '@xiaohaih/json-form-plus';

defineOption({
    time: {
        t: 'time-select',
        label: '时间',
        placeholder: '请选择时间',
    },
});
```

## Props

支持 [共享 Props](../shares/share-props.md) 和 [ElTimeSelect 自带的 Props](https://element-plus.org/zh-CN/component/time-select.html#attributes)

## 插槽

- 插槽项请参考 [`ElTimeSelect.slots`](https://element-plus.org/zh-CN/component/time-select.html#api)

- 插槽实际的 `Props` 等于**插槽自带的 `Props` + `SlotProps`**

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

### 基础时间选择 + 自定义时间间隔

```tsx
defineOption({
    startTime: {
        t: 'time-select',
        label: '开始时间',
        placeholder: '请选择开始时间',
        defaultValue: '09:00',
    },
    time: {
        t: 'time-select',
        label: '时间',
        start: '08:30',
        step: '00:15',
        end: '18:30',
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7545049941266137134)

<Iframe src="https://code.juejin.cn/pen/7545049941266137134" />
:::

### 带默认值

```tsx
defineOption({
    workTime: {
        t: 'time-select',
        label: '工作时间',
        start: '09:00',
        end: '18:00',
        step: '00:30',
        defaultValue: '14:00',
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7545050586907934766)

<Iframe src="https://code.juejin.cn/pen/7545050586907934766" />
:::

## 注意事项

1. 支持 `ElFormItem` 组件所有的 `Props`
2. 支持 `ElTimeSelect` 组件所有的 `Props`

::: info tips: 当 `ElFormItem` 组件与 `ElTimeSelect` 组件的 `Props` 冲突时

- 可通过 `formItemProps` 将属性传递给 `ElFormItem`

- 可通过 `staticProps` 将属性传递给 `ElTimeSelect`

:::
