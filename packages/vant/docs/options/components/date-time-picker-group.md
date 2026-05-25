# DateTimePickerGroup 日期时间组合选择

日期时间组合选择组件，基于 Vant `PickerGroup` + `DatePicker` + `TimePicker` + `Popup` + `Field` 组件实现。

## 类型标识

- `t: 'date-time-picker-group'`

## 额外 Props

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| pickerGroupProps | `Partial<PickerGroupProps>` | - | VanPickerGroup 组件的属性 |
| pickerGroupOn | `object` | `{}` | VanPickerGroup 组件的事件 |
| pickerGroupSlots | `PickerGroupSlots` | - | VanPickerGroup 组件的插槽 |
| isLink | `boolean` | `true` | 是否展示右侧箭头并开启点击反馈 |
| onRowClick | `(option, ev) => void` | - | 点击事件，传递此事件时会忽略内部打开弹窗操作 |
| format | `(option) => any` | - | 对值进行格式化 - 显示在页面上的值 |
| valueFormat | `(option) => any` | - | 对值进行格式化 - 提交值 |
| valueUnformat | `(option) => string[]` | - | 取消值的格式化 |
| valueTrigger | `'change' \| 'confirm' \| 'cancel'` | `'confirm'` | 值触发方式 |
| datePickerProps | `Partial<DatePickerProps>` | - | VanDatePicker 组件的属性 |
| datePickerOn | `object` | `{}` | VanDatePicker 组件的事件 |
| datePickerSlots | `object` | - | VanDatePicker 组件的插槽 |
| timePickerProps | `Partial<TimePickerProps>` | - | VanTimePicker 组件的属性 |
| timePickerOn | `object` | `{}` | VanTimePicker 组件的事件 |
| timePickerSlots | `object` | - | VanTimePicker 组件的插槽 |
| popupProps | `Partial<PopupProps>` | - | 弹窗组件的属性 |
| popupOn | `object` | `{}` | 弹窗组件的事件 |

### PickerGroupSlots

| 插槽名 | 绑定值 | 描述 |
| :--- | :--- | :--- |
| toolbar | `CommonSlotsProps` | 自定义整个顶部栏的内容 |
| title | `CommonSlotsProps` | 自定义标题内容 |
| confirm | `CommonSlotsProps` | 自定义确认按钮内容 |
| cancel | `CommonSlotsProps` | 自定义取消按钮内容 |

## Slots

支持所有 [CommonSlots](/options/shares/share-slots) 插槽。

## 示例

### 基础用法

```typescript
const formConfig = defineOption([
    {
        field: 'datetime',
        t: 'date-time-picker-group',
        label: '日期时间',
        placeholder: '选择日期和时间',
    },
]);
```

### 自定义日期时间范围

```typescript
const formConfig = defineOption([
    {
        field: 'appointment',
        t: 'date-time-picker-group',
        label: '预约时间',
        datePickerProps: {
            minDate: new Date(),
            maxDate: new Date(2025, 11, 31),
        },
        timePickerProps: {
            minHour: 9,
            maxHour: 18,
        },
    },
]);
```

### 自定义格式化

```typescript
const formConfig = defineOption([
    {
        field: 'datetime',
        t: 'date-time-picker-group',
        label: '日期时间',
        format: (option) => {
            const [date, time] = option;
            if (!date && !time) return '';
            const dateStr = date ? date.join('-') : '';
            const timeStr = time ? time.join(':') : '';
            return `${dateStr} ${timeStr}`;
        },
        valueFormat: (option) => {
            const [date, time] = option;
            const dateStr = date ? date.join('-') : '';
            const timeStr = time ? time.join(':') : '';
            return `${dateStr} ${timeStr}`.trim();
        },
    },
]);
```
