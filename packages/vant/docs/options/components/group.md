# Group 表单分组

表单分组组件，用于将多个表单项组合在一起，形成分组展示。

## 类型标识

- `t: 'group'`

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
        field: 'userInfo',
        t: 'group',
        label: '用户信息',
        config: [
            {
                field: 'username',
                t: 'input',
                label: '用户名',
                placeholder: '请输入用户名',
            },
            {
                field: 'email',
                t: 'input',
                label: '邮箱',
                placeholder: '请输入邮箱',
            },
        ],
    },
    {
        field: 'addressInfo',
        t: 'group',
        label: '地址信息',
        config: [
            {
                field: 'province',
                t: 'picker',
                label: '省份',
                placeholder: '请选择省份',
            },
            {
                field: 'city',
                t: 'picker',
                label: '城市',
                placeholder: '请选择城市',
            },
        ],
    },
]);
```

### 动态分组配置

```typescript
const formConfig = defineOption(({ query }) => [
    {
        field: 'userInfo',
        t: 'group',
        label: '用户信息',
        config: [
            {
                field: 'username',
                t: 'input',
                label: '用户名',
                disabled: !query.email,
            },
            {
                field: 'email',
                t: 'input',
                label: '邮箱',
            },
        ],
    },
]);
```
