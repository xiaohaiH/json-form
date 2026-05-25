# TreeSelect 树形选择器

树形选择组件，基于 Vant `TreeSelect` + `Field` 组件实现。

## 类型标识

- `t: 'tree-select'`

## 额外 Props

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| treeSelectProps | `Partial<TreeSelectProps>` | - | VanTreeSelect 组件的属性 |
| treeSelectOn | `object` | `{}` | VanTreeSelect 组件的事件 |
| treeSelectSlots | `TreeSelectSlots` | - | VanTreeSelect 组件的插槽 |
| isLink | `boolean` | `true` | 是否展示右侧箭头并开启点击反馈 |
| onRowClick | `(option, ev) => void` | - | 点击事件，传递此事件时会忽略内部打开弹窗操作 |
| popupProps | `Partial<PopupProps>` | - | 弹窗组件的属性 |
| popupOn | `object` | `{}` | 弹窗组件的事件 |

### TreeSelectSlots

| 插槽名 | 绑定值 | 描述 |
| :--- | :--- | :--- |
| content | `CommonSlotsProps` | 自定义右侧 tab 内容 |
| navLeft | `CommonSlotsProps` | 自定义左侧导航栏头部区域 |
| navRight | `CommonSlotsProps` | 自定义左侧导航栏底部区域 |

## Slots

支持所有 [CommonSlots](/options/shares/share-slots) 插槽。

## 示例

### 基础用法

```typescript
const formConfig = defineOption([
    {
        field: 'department',
        t: 'tree-select',
        label: '部门',
        placeholder: '请选择部门',
        treeSelectProps: {
            items: [
                {
                    text: '技术部',
                    children: [
                        { text: '前端组', id: 1 },
                        { text: '后端组', id: 2 },
                    ],
                },
                {
                    text: '产品部',
                    children: [
                        { text: '产品组', id: 3 },
                        { text: '设计组', id: 4 },
                    ],
                },
            ],
            mainActiveIndex: 0,
            activeId: 1,
        },
    },
]);
```

### 多选模式

```typescript
const formConfig = defineOption([
    {
        field: 'departments',
        t: 'tree-select',
        label: '部门（多选）',
        treeSelectProps: {
            items: departmentData,
            mainActiveIndex: 0,
            activeId: [1, 3],
            max: 3,
        },
    },
]);
```

### 自定义内容插槽

```tsx
const formConfig = defineOption([
    {
        field: 'department',
        t: 'tree-select',
        label: '部门',
        treeSelectSlots: {
            content: () => <div>自定义内容区域</div>,
            navLeft: () => <VanIcon name="search" />,
        },
    },
]);
```
