# DatePicker 日期选择器

日期选择组件，基于 Vant `DatePicker` + `Popup` + `Field` 组件实现。

## 类型标识

- `t: 'date-picker'`

## 额外 Props

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| datePickerProps | `Partial<DatePickerProps>` | - | VanDatePicker 组件的属性 |
| datePickerOn | `object` | `{}` | VanDatePicker 组件的事件 |
| datePickerSlots | `DatePickerSlots` | - | VanDatePicker 组件的插槽 |
| isLink | `boolean` | `true` | 是否展示右侧箭头并开启点击反馈 |
| onRowClick | `(option, ev) => void` | - | 点击事件，传递此事件时会忽略内部打开弹窗操作 |
| separator | `string` | `'-'` | 日期分隔符 |
| format | `(option, separator) => any` | - | 对值进行格式化 - 显示在页面上的值 |
| valueFormat | `(option, separator) => any` | - | 对值进行格式化 - 提交值 |
| valueUnformat | `(option, separator) => string[]` | - | 取消值的格式化 - 给 VanDatePicker 的值 |
| valueTrigger | `'change' \| 'confirm' \| 'cancel'` | `'confirm'` | 值触发方式 |
| popupProps | `Partial<PopupProps>` | - | 弹窗组件的属性 |
| popupOn | `object` | `{}` | 弹窗组件的事件 |

### DatePickerSlots

| 插槽名 | 绑定值 | 描述 |
| :--- | :--- | :--- |
| toolbar | `CommonSlotsProps` | 自定义整个顶部栏的内容 |
| title | `CommonSlotsProps` | 自定义标题内容 |
| confirm | `CommonSlotsProps` | 自定义确认按钮内容 |
| cancel | `CommonSlotsProps` | 自定义取消按钮内容 |
| option | `{ option, index } & CommonSlotsProps` | 自定义选项内容 |
| columnsTop | `CommonSlotsProps` | 自定义选项上方内容 |
| columnsBottom | `CommonSlotsProps` | 自定义选项下方内容 |

## Slots

支持所有 [CommonSlots](/options/shares/share-slots) 插槽。

## 示例

### 基础用法

```typescript
const formConfig = defineOption([
    {
        field: 'birthday',
        t: 'date-picker',
        label: '生日',
        placeholder: '选择日期',
        datePickerProps: {
            type: 'date',
            minDate: new Date(1900, 0, 1),
            maxDate: new Date(),
        },
    },
]);
```

### 年月日选择

```typescript
const formConfig = defineOption([
    {
        field: 'date',
        t: 'date-picker',
        label: '日期',
        datePickerProps: {
            type: 'date',
            title: '选择日期',
        },
        separator: '/',
    },
]);
```

### 年月选择

```typescript
const formConfig = defineOption([
    {
        field: 'month',
        t: 'date-picker',
        label: '月份',
        datePickerProps: {
            type: 'year-month',
            title: '选择月份',
        },
        format: (option, separator) => option.join(separator),
    },
]);
```

### 自定义格式化

```typescript
const formConfig = defineOption([
    {
        field: 'date',
        t: 'date-picker',
        label: '日期',
        format: (option, separator) => {
            return `${option[0]}年${option[1]}月${option[2]}日`;
        },
        valueFormat: (option, separator) => {
            return option.join('-');
        },
        valueUnformat: (val) => {
            return val ? val.split('-') : [];
        },
    },
]);
```
