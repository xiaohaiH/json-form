# CellGroup 单元格分组

单元格分组布局组件，基于 Vant `CellGroup` 组件实现，用于将表单项以单元格形式分组展示。

## 类型标识

- `t: 'cell-group'`

## 额外 Props

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| label | `string` | - | 分组标题 |
| config | `JSONFormOption[] \| ((option: ConfigOption) => JSONFormOption[])` | - | 子级表单项配置 |
| cellGroupProps | `Partial<CellGroupProps>` | - | VanCellGroup 组件的属性 |
| cellGroupOn | `object` | `{}` | VanCellGroup 组件的事件 |
| cellGroupSlots | `object` | - | VanCellGroup 组件的插槽 |

## 示例

### 基础用法

```typescript
const formConfig = defineOption([
    {
        field: 'contactInfo',
        t: 'cell-group',
        label: '联系方式',
        config: [
            {
                field: 'phone',
                t: 'input',
                label: '手机号',
                placeholder: '请输入手机号',
                type: 'tel',
                maxlength: 11,
            },
            {
                field: 'email',
                t: 'input',
                label: '邮箱',
                placeholder: '请输入邮箱',
            },
            {
                field: 'wechat',
                t: 'input',
                label: '微信',
                placeholder: '请输入微信号',
            },
        ],
    },
]);
```

### 自定义 CellGroup 属性

```typescript
const formConfig = defineOption([
    {
        field: 'settings',
        t: 'cell-group',
        label: '设置',
        cellGroupProps: {
            inset: true,
            border: true,
        },
        config: [
            {
                field: 'notification',
                t: 'switch',
                label: '消息通知',
                defaultValue: true,
            },
            {
                field: 'sound',
                t: 'switch',
                label: '声音',
                defaultValue: true,
            },
        ],
    },
]);
```
