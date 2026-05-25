# CheckboxGroup 复选框组

复选框组组件，基于 Vant `CheckboxGroup` + `Checkbox` + `Field` 组件实现。

## 类型标识

- `t: 'checkbox-group'`

## 额外 Props

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| label | `string` | - | 输入框左侧文本 |
| checkboxGroupProps | `Partial<CheckboxGroupProps>` | - | VanCheckboxGroup 组件的属性 |
| checkboxGroupOn | `object` | `{}` | VanCheckboxGroup 组件的事件 |
| labelKey | `string` | `'label'` | 显示的标签 |
| valueKey | `string` | `'value'` | 提交的值 |
| checkboxProps | `Partial<CheckboxProps>` | - | VanCheckbox 组件的属性 |
| checkboxOn | `object` | `{}` | VanCheckbox 组件的事件 |
| checkboxSlots | `CheckboxSlots` | - | VanCheckbox 组件的插槽 |

### CheckboxSlots

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
        field: 'hobbies',
        t: 'checkbox-group',
        label: '爱好',
        options: [
            { label: '阅读', value: 'reading' },
            { label: '运动', value: 'sports' },
            { label: '音乐', value: 'music' },
            { label: '旅行', value: 'travel' },
        ],
    },
]);
```

### 自定义选项键名

```typescript
const formConfig = defineOption([
    {
        field: 'tags',
        t: 'checkbox-group',
        label: '标签',
        labelKey: 'name',
        valueKey: 'id',
        options: [
            { name: '前端', id: 1 },
            { name: '后端', id: 2 },
            { name: '全栈', id: 3 },
        ],
    },
]);
```

### 自定义选项插槽

```tsx
const formConfig = defineOption([
    {
        field: 'hobbies',
        t: 'checkbox-group',
        label: '爱好',
        options: hobbyList,
        checkboxSlots: {
            icon: ({ checked, item }) => (
                checked
                    ? <VanIcon name="like" color="red" />
                    : <VanIcon name="like-o" />
            ),
        },
    },
]);
```
