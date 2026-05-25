# NumberKeyboard 数字键盘

数字键盘输入组件，基于 Vant `NumberKeyboard` + `Field` 组件实现。

## 类型标识

- `t: 'number-keyboard'`

## 额外 Props

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| numberKeyboardProps | `Partial<NumberKeyboardProps>` | - | VanNumberKeyboard 组件的属性 |
| numberKeyboardOn | `object` | `{}` | VanNumberKeyboard 组件的事件 |
| numberKeyboardSlots | `NumberKeyboardSlots` | - | VanNumberKeyboard 组件的插槽 |
| isLink | `boolean` | `true` | 是否展示右侧箭头并开启点击反馈 |
| onRowClick | `(option, ev) => void` | - | 点击事件，传递此事件时会忽略内部打开弹窗操作 |

### NumberKeyboardSlots

| 插槽名 | 绑定值 | 描述 |
| :--- | :--- | :--- |
| delete | `CommonSlotsProps` | 自定义删除按键内容 |
| extraKey | `CommonSlotsProps` | 自定义左下角按键内容 |
| titleLeft | `CommonSlotsProps` | 自定义标题栏左侧内容 |

## Slots

支持所有 [CommonSlots](/options/shares/share-slots) 插槽。

## 示例

### 基础用法

```typescript
const formConfig = defineOption([
    {
        field: 'amount',
        t: 'number-keyboard',
        label: '金额',
        placeholder: '点击输入金额',
        numberKeyboardProps: {
            theme: 'custom',
            extraKey: '.',
            maxlength: 10,
        },
    },
]);
```

### 身份证输入

```typescript
const formConfig = defineOption([
    {
        field: 'idCard',
        t: 'number-keyboard',
        label: '身份证号',
        placeholder: '点击输入身份证号',
        numberKeyboardProps: {
            extraKey: 'X',
            maxlength: 18,
        },
    },
]);
```
