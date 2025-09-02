# DatePicker 日期选择器

`DatePicker` 组件是一个基于 `ElementPlus` 日期选择器的封装组件, 支持多种日期格式和选择模式.

## 基本用法

```tsx
import { defineOption } from '@xiaohaih/json-form-plus';

defineOption({
    birthday: {
        t: 'date-picker',
        label: '生日',
        placeholder: '请选择生日',
    },
});
```

## Props

除了 [共享 Props](../shares/share-props.md) 和 [ElDatePicker 自带的 Props](https://element-plus.org/zh-CN/component/date-picker.html#%E5%B1%9E%E6%80%A7) 外, `DatePicker` 组件还支持以下特定属性:

### valueFormat

- 类型: `string`
- 默认: `'YYYY-MM-DD'`

日期格式化的类型

## 插槽

- 插槽项请参考 [`ElDatePicker.slots`](https://element-plus.org/zh-CN/component/date-picker.html#%E6%8F%92%E6%A7%BD)

- 插槽实际的 `Props` 等于**插槽自带的 `Props` + `SlotProps`**

::: details 插槽示例

```tsx
defineOption({
    date: {
        t: 'date-picker',
        label: '日期',
        type: 'daterange',
        itemSlots: {
            rangeSeparator: () => h('div', '分割线'),
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

### 基础日期选择

```tsx
defineOption({
    date: {
        t: 'date-picker',
        label: '日期',
        placeholder: '请选择日期',
    },
    datetime: {
        t: 'date-picker',
        label: '日期时间',
        type: 'datetime',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        placeholder: '请选择日期时间',
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7543936405324431398)

<Iframe src="https://code.juejin.cn/pen/7543936405324431398" />
:::

### 日期范围选择(起始日期和结束日期各用一个字段) + 周选择

```tsx
defineOption({
    dateRange: {
        t: 'date-picker',
        label: '日期范围',
        type: 'daterange',
        fields: ['startDate', 'endDate'],
        defaultValue: ['2023-01-01', '2023-12-31'],
    },
    week: {
        t: 'date-picker',
        label: '周',
        type: 'week',
        valueFormat: 'ww',
        placeholder: '请选择周',
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7543936655137177638)

<Iframe src="https://code.juejin.cn/pen/7543936655137177638" />
:::

## 注意事项

1. 支持 `ElFormItem` 组件所有的 `Props`
2. 支持 `ElDatePicker` 组件所有的 `Props`
3. 日期范围选择可以使用 `fields` 属性提交多个字段, 但是该选项不能是必填, 否则会校验失败

::: info tips: 当 `ElFormItem` 组件与 `ElDatePicker` 组件的 `Props` 冲突时

- 可通过 `formItemProps` 将属性传递给 `ElFormItem`

- 可通过 `staticProps` 将属性传递给 `ElDatePicker`

:::
