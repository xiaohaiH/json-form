# RadioGroup 单选框组

单选框组组件，基于 Vant `RadioGroup` + `Radio` + `Field` 组件实现。

## 类型标识

- `t: 'radio-group'`

## 额外 Props

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| label | `string` | - | 输入框左侧文本 |
| radioGroupProps | `Partial<RadioGroupProps>` | - | VanRadioGroup 组件的属性 |
| radioGroupOn | `object` | `{}` | VanRadioGroup 组件的事件 |
| labelKey | `string` | `'label'` | 显示的标签 |
| valueKey | `string` | `'value'` | 提交的值 |
| cancelable | `boolean` | - | 是否可取消选中 |
| radioProps | `Partial<RadioProps>` | - | VanRadio 组件的属性 |
| radioOn | `object` | `{}` | VanRadio 组件的事件 |
| radioSlots | `RadioSlots` | - | VanRadio 组件的插槽 |

### RadioSlots

| 插槽名 | 绑定值 | 描述 |
| :--- | :--- | :--- |
| default | `{ checked, disabled, item } & CommonSlotsProps` | 自定义文本 |
| icon | `{ checked, disabled, item } & CommonSlotsProps` | 自定义图标 |

## Slots

支持所有 [CommonSlots](/options/shares/share-slots) 插槽。

## 示例

### 基础用法

```typescript
const formConfig = defineOption([
    {
        field: 'gender',
        t: 'radio-group',
        label: '性别',
        options: [
            { label: '男', value: 'male' },
            { label: '女', value: 'female' },
        ],
    },
]);
```

### 自定义选项键名

```typescript
const formConfig = defineOption([
    {
        field: 'status',
        t: 'radio-group',
        label: '状态',
        labelKey: 'name',
        valueKey: 'id',
        options: [
            { name: '启用', id: 1 },
            { name: '禁用', id: 0 },
        ],
    },
]);
```

### 自定义选项插槽

```tsx
const formConfig = defineOption([
    {
        field: 'gender',
        t: 'radio-group',
        label: '性别',
        options: genderList,
        radioSlots: {
            icon: ({ checked, item }) => (
                checked
                    ? <VanIcon name="success" color="#1989fa" />
                    : <VanIcon name="circle" />
            ),
        },
    },
]);
```
