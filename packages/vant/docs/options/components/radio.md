# Radio 单选框

单个单选框组件，基于 Vant `Radio` + `Field` 组件实现。

## 类型标识

- `t: 'radio'`

## 额外 Props

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| label | `string` | - | 输入框左侧文本 |
| radioProps | `Partial<RadioProps>` | - | VanRadio 组件的属性 |
| radioOn | `object` | `{}` | VanRadio 组件的事件 |
| radioSlots | `RadioSlots` | - | VanRadio 组件的插槽 |
| cancelable | `boolean` | `true` | 是否可取消选中 |

### RadioSlots

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
        field: 'gender',
        t: 'radio',
        label: '性别',
        defaultValue: 'male',
        radioProps: {
            checkedColor: '#1989fa',
        },
    },
]);
```

### 自定义图标

```tsx
const formConfig = defineOption([
    {
        field: 'gender',
        t: 'radio',
        label: '性别',
        radioSlots: {
            icon: ({ checked }) => (
                checked
                    ? <VanIcon name="success" color="#1989fa" />
                    : <VanIcon name="circle" />
            ),
        },
    },
]);
```
