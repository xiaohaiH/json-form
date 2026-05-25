# Checkbox 复选框

单个复选框组件，基于 Vant `Checkbox` + `Field` 组件实现。

## 类型标识

- `t: 'checkbox'`

## 额外 Props

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| label | `string` | - | 输入框左侧文本 |
| checkboxProps | `Partial<CheckboxProps>` | - | VanCheckbox 组件的属性 |
| checkboxOn | `object` | `{}` | VanCheckbox 组件的事件 |
| checkboxSlots | `CheckboxSlots` | - | VanCheckbox 组件的插槽 |

### CheckboxSlots

| 插槽名 | 绑定值 | 描述 |
| :--- | :--- | :--- |
| default | `{ checked, disabled } & CommonSlotsProps` | 自定义文本 |
| icon | `{ checked, disabled } & CommonSlotsProps` | 自定义图标 |

## Slots

支持所有 [CommonSlots](/options/shares/share-slots) 插槽。

## 示例

### 基础用法

```typescript
const formConfig = defineOption([
    {
        field: 'agree',
        t: 'checkbox',
        label: '同意协议',
        defaultValue: false,
        checkboxProps: {
            shape: 'square',
        },
    },
]);
```

### 自定义图标

```tsx
const formConfig = defineOption([
    {
        field: 'agree',
        t: 'checkbox',
        label: '同意协议',
        checkboxSlots: {
            icon: ({ checked }) => (
                checked
                    ? <VanIcon name="success" color="#1989fa" />
                    : <VanIcon name="circle" />
            ),
        },
    },
]);
```
