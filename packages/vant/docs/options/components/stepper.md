# Stepper 步进器

步进器组件，基于 Vant `Stepper` + `Field` 组件实现。

## 类型标识

- `t: 'stepper'`

## 额外 Props

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| stepperProps | `Partial<StepperProps>` | - | VanStepper 组件的属性 |
| stepperOn | `object` | `{}` | VanStepper 组件的事件 |
| stepperSlots | `object` | - | VanStepper 组件的插槽 |

## Slots

支持所有 [CommonSlots](/options/shares/share-slots) 插槽。

## 示例

### 基础用法

```typescript
const formConfig = defineOption([
    {
        field: 'quantity',
        t: 'stepper',
        label: '数量',
        defaultValue: 1,
        stepperProps: {
            min: 0,
            max: 99,
            step: 1,
        },
    },
]);
```

### 高级配置

```typescript
const formConfig = defineOption([
    {
        field: 'price',
        t: 'stepper',
        label: '价格',
        defaultValue: 0,
        stepperProps: {
            min: 0,
            max: 9999,
            step: 0.01,
            decimalLength: 2,
            inputWidth: '80px',
            buttonSize: '28px',
        },
    },
]);
```
