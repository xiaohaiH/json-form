# Switch 开关

开关切换组件，基于 Vant `Switch` + `Field` 组件实现。

## 类型标识

- `t: 'switch'`

## 额外 Props

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| switchProps | `Partial<SwitchProps>` | - | VanSwitch 组件的属性 |
| switchOn | `object` | `{}` | VanSwitch 组件的事件 |
| switchSlots | `SwitchSlots` | - | VanSwitch 组件的插槽 |

### SwitchSlots

| 插槽名 | 绑定值 | 描述 |
| :--- | :--- | :--- |
| node | `CommonSlotsProps` | 自定义按钮的内容 |
| background | `CommonSlotsProps` | 自定义开关的背景内容 |

## Slots

支持所有 [CommonSlots](/options/shares/share-slots) 插槽。

## 示例

### 基础用法

```typescript
const formConfig = defineOption([
    {
        field: 'enabled',
        t: 'switch',
        label: '启用',
        defaultValue: false,
    },
]);
```

### 自定义开关样式

```typescript
const formConfig = defineOption([
    {
        field: 'enabled',
        t: 'switch',
        label: '启用',
        switchProps: {
            size: '28px',
            activeColor: '#07c160',
            inactiveColor: '#ee0a24',
        },
    },
]);
```

### 自定义按钮内容

```tsx
const formConfig = defineOption([
    {
        field: 'enabled',
        t: 'switch',
        label: '启用',
        switchSlots: {
            node: () => <VanIcon name="success" />,
        },
    },
]);
```
