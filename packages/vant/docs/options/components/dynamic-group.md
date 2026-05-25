# DynamicGroup 动态列表

动态增减表单项组件，支持动态添加和删除表单项。

## 类型标识

- `t: 'dynamic-group'`

## 额外 Props

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| label | `string` | - | 分组标题 |
| config | `(option: DynamicConfigOption) => JSONFormOption[]` | - | 子级表单项配置 |
| cellGroupProps | `Partial<CellGroupProps>` | - | VanCellGroup 组件的属性 |
| cellGroupOn | `object` | `{}` | VanCellGroup 组件的事件 |
| cellGroupSlots | `object` | - | VanCellGroup 组件的插槽 |

### DynamicConfigOption

| 参数 | 类型 | 描述 |
| :--- | :--- | :--- |
| item | `Record<string, any>` | 当前项的数据 |
| index | `number` | 当前项的索引 |
| query | `Record<string, any>` | 表单的 model 对象 |
| wrapper | `ReturnType<typeof useWrapper>` | 表单级的共用属性 |

## Slots

| 插槽名 | 绑定值 | 描述 |
| :--- | :--- | :--- |
| append | `{ query }` | 底部插槽，用于添加新项 |
| prepend | `{ query }` | 顶部插槽 |

### ItemSlots

| 插槽名 | 绑定值 | 描述 |
| :--- | :--- | :--- |
| append | `{ checked, index }` | 每项底部插槽，用于删除操作 |
| prepend | `{ checked, index }` | 每项顶部插槽 |

## 示例

### 基础用法

```tsx
const formConfig = defineOption([
    {
        field: 'users',
        t: 'dynamic-group',
        label: '用户列表',
        config: ({ item, index }) => ([
            {
                field: 'name',
                t: 'input',
                label: '姓名',
                placeholder: '请输入姓名',
            },
            {
                field: 'age',
                t: 'stepper',
                label: '年龄',
                min: 0,
                max: 120,
            },
        ]),
        itemSlots: {
            append: ({ checked, index }) => (
                <VanButton
                    onClick={() => checked.splice(index, 1)}
                    type="danger"
                    size="small"
                >
                    删除
                </VanButton>
            ),
        },
        slots: {
            append: ({ query }) => (
                <VanButton
                    onClick={() => query.users.push({ name: '', age: 0 })}
                    type="primary"
                >
                    添加用户
                </VanButton>
            ),
        },
    },
]);
```

### 复杂表单

```tsx
const formConfig = defineOption([
    {
        field: 'educationList',
        t: 'dynamic-group',
        label: '教育经历',
        config: ({ item, index }) => ([
            {
                field: 'school',
                t: 'input',
                label: '学校',
                placeholder: '请输入学校名称',
            },
            {
                field: 'major',
                t: 'input',
                label: '专业',
                placeholder: '请输入专业',
            },
            {
                field: 'startDate',
                t: 'date-picker',
                label: '开始时间',
            },
            {
                field: 'endDate',
                t: 'date-picker',
                label: '结束时间',
            },
        ]),
        itemSlots: {
            append: ({ checked, index }) => (
                <VanIcon
                    name="delete"
                    color="#ee0a24"
                    onClick={() => checked.splice(index, 1)}
                />
            ),
        },
        slots: {
            append: ({ query }) => (
                <VanCell
                    title="添加教育经历"
                    icon="plus"
                    isLink
                    onClick={() => query.educationList.push({
                        school: '',
                        major: '',
                        startDate: '',
                        endDate: '',
                    })}
                />
            ),
        },
    },
]);
```
