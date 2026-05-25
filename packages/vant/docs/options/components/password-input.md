# PasswordInput 密码输入框

密码输入框组件，基于 Vant `PasswordInput` + `NumberKeyboard` + `Field` 组件实现。

## 类型标识

- `t: 'password-input'`

## 额外 Props

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| passwordInputProps | `Partial<PasswordInputProps>` | - | VanPasswordInput 组件的属性 |
| passwordInputOn | `object` | `{}` | VanPasswordInput 组件的事件 |
| numberKeyboardProps | `Partial<NumberKeyboardProps>` | - | VanNumberKeyboard 组件的属性 |
| numberKeyboardOn | `object` | `{}` | VanNumberKeyboard 组件的事件 |
| numberKeyboardSlots | `object` | - | VanNumberKeyboard 组件的插槽 |
| isLink | `boolean` | `true` | 是否展示右侧箭头并开启点击反馈 |
| onRowClick | `(option, ev) => void` | - | 点击事件，传递此事件时会忽略内部打开弹窗操作 |

## Slots

支持所有 [CommonSlots](/options/shares/share-slots) 插槽。

## 示例

### 基础用法

```typescript
const formConfig = defineOption([
    {
        field: 'payPassword',
        t: 'password-input',
        label: '支付密码',
        placeholder: '点击输入支付密码',
        passwordInputProps: {
            length: 6,
            gutter: 10,
        },
    },
]);
```

### 自定义密码框样式

```typescript
const formConfig = defineOption([
    {
        field: 'password',
        t: 'password-input',
        label: '密码',
        passwordInputProps: {
            length: 4,
            gutter: 8,
            mask: true,
            focused: false,
        },
        numberKeyboardProps: {
            theme: 'custom',
            extraKey: '.',
        },
    },
]);
```
