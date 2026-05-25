# Rate 评分

评分组件，基于 Vant `Rate` + `Field` 组件实现。

## 类型标识

- `t: 'rate'`

## 额外 Props

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| rateProps | `Partial<RateProps>` | - | VanRate 组件的属性 |
| rateOn | `object` | `{}` | VanRate 组件的事件 |
| rateSlots | `object` | - | VanRate 组件的插槽 |

## Slots

支持所有 [CommonSlots](/options/shares/share-slots) 插槽。

## 示例

### 基础用法

```typescript
const formConfig = defineOption([
    {
        field: 'rating',
        t: 'rate',
        label: '评分',
        defaultValue: 3,
        rateProps: {
            count: 5,
            size: '24px',
            color: '#ee0a24',
            voidColor: '#c8c9cc',
        },
    },
]);
```

### 允许半星

```typescript
const formConfig = defineOption([
    {
        field: 'score',
        t: 'rate',
        label: '综合评分',
        defaultValue: 3.5,
        rateProps: {
            count: 5,
            allowHalf: true,
            size: '28px',
        },
    },
]);
```

### 只读模式

```typescript
const formConfig = defineOption([
    {
        field: 'rating',
        t: 'rate',
        label: '评分',
        defaultValue: 4,
        readonly: true,
        rateProps: {
            count: 5,
            size: '20px',
        },
    },
]);
```
