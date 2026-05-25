# TimePicker 时间选择器

时间选择组件，基于 Vant `TimePicker` + `Popup` + `Field` 组件实现。

## 类型标识

- `t: 'time-picker'`

## 额外 Props

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| timePickerProps | `Partial<TimePickerProps>` | - | VanTimePicker 组件的属性 |
| timePickerOn | `object` | `{}` | VanTimePicker 组件的事件 |
| timePickerSlots | `TimePickerSlots` | - | VanTimePicker 组件的插槽 |
| isLink | `boolean` | `true` | 是否展示右侧箭头并开启点击反馈 |
| onRowClick | `(option, ev) => void` | - | 点击事件，传递此事件时会忽略内部打开弹窗操作 |
| separator | `string` | `':'` | 时间分隔符 |
| format | `(option, separator) => any` | - | 对值进行格式化 - 显示在页面上的值 |
| valueFormat | `(option, separator) => any` | - | 对值进行格式化 - 提交值 |
| valueUnformat | `(option, separator) => string[]` | - | 取消值的格式化 - 给 VanTimePicker 的值 |
| valueTrigger | `'change' \| 'confirm' \| 'cancel'` | `'confirm'` | 值触发方式 |
| popupProps | `Partial<PopupProps>` | - | 弹窗组件的属性 |
| popupOn | `object` | `{}` | 弹窗组件的事件 |

### TimePickerSlots

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
        field: 'meetingTime',
        t: 'time-picker',
        label: '会议时间',
        placeholder: '选择时间',
        timePickerProps: {
            title: '选择时间',
        },
    },
]);
```

### 自定义时间范围

```typescript
const formConfig = defineOption([
    {
        field: 'startTime',
        t: 'time-picker',
        label: '开始时间',
        timePickerProps: {
            minHour: 8,
            maxHour: 18,
            minMinute: 0,
            maxMinute: 59,
        },
    },
]);
```

### 自定义格式化

```typescript
const formConfig = defineOption([
    {
        field: 'time',
        t: 'time-picker',
        label: '时间',
        format: (option, separator) => {
            return `${option[0]}时${option[1]}分`;
        },
        valueFormat: (option, separator) => {
            return option.join(':');
        },
    },
]);
```
