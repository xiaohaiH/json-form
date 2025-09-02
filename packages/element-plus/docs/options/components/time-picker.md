# TimePicker 时间选择器

`TimePicker` 组件是一个基于 `ElementPlus` 时间选择器的封装组件, 支持多种时间格式和选择模式.

## 基本用法

```tsx
import { defineOption } from '@xiaohaih/json-form-plus';

defineOption({
    time: {
        t: 'time-picker',
        label: '时间',
        placeholder: '请选择时间',
    },
});
```

## Props

除了 [共享 Props](../shares/share-props.md) 和 [ElTimePicker 自带的 Props](https://element-plus.org/zh-CN/component/time-picker.html#attributes) 外, `TimePicker` 组件还支持以下特定属性:

### valueFormat

- 类型: `string`
- 默认: `'HH:mm:ss'`

时间格式化的类型

## 插槽

- 插槽项请参考 [`ElSwitch.slots`](https://element-plus.org/zh-CN/component/time-picker.html#api)

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

### 基础时间选择 + 时间范围选择

```tsx
defineOption({
    beginTime: {
        t: 'time-picker',
        label: '开始时间',
        placeholder: '请选择开始时间',
        valueFormat: 'HH:mm:ss',
    },
    timeRange: {
        t: 'time-picker',
        label: '时间范围',
        isRange: true,
        fields: ['startTime', 'endTime'],
        valueFormat: 'HH:mm:ss',
        defaultValue: ['09:00:00', '18:00:00'],
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7545048714827300890)

<Iframe src="https://code.juejin.cn/pen/7545048714827300890" />
:::

### 自定义格式 + 带默认值

```tsx
defineOption({
    time: {
        t: 'time-picker',
        label: '时间',
        format: 'HH:mm',
        valueFormat: 'HH:mm',
        placeholder: '请选择时间',
    },
    workTime: {
        t: 'time-picker',
        label: '工作时间',
        valueFormat: 'HH:mm:ss',
        defaultValue: '09:00:00',
        placeholder: '请选择工作时间',
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7545049213483581491)

<Iframe src="https://code.juejin.cn/pen/7545049213483581491" />
:::

## 注意事项

1. 支持 `ElFormItem` 组件所有的 `Props`
2. 支持 `ElTimePicker` 组件所有的 `Props`

::: info tips: 当 `ElFormItem` 组件与 `ElTimePicker` 组件的 `Props` 冲突时

- 可通过 `formItemProps` 将属性传递给 `ElFormItem`

- 可通过 `staticProps` 将属性传递给 `ElTimePicker`

:::
