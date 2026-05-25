# Area 省市区选择

省市区选择组件，基于 Vant `Area` + `Popup` + `Field` 组件实现。

## 类型标识

- `t: 'area'`

## 额外 Props

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| options | `any` | - | 省市区数据源（重写类型，支持更多格式） |
| areaProps | `Partial<AreaProps>` | - | VanArea 组件的属性 |
| areaOn | `object` | `{}` | VanArea 组件的事件 |
| areaSlots | `AreaSlots` | - | VanArea 组件的插槽 |
| isLink | `boolean` | `true` | 是否展示右侧箭头并开启点击反馈 |
| onRowClick | `(option, ev) => void` | - | 点击事件，传递此事件时会忽略内部打开弹窗操作 |
| separator | `string` | `'/'` | 显示文本的分隔符 |
| showAllLevels | `boolean` | `true` | 是否显示全路径 |
| format | `(option) => any` | - | 对值进行格式化 - 显示在页面上的值 |
| valueTrigger | `'change' \| 'confirm' \| 'cancel'` | `'confirm'` | 值触发方式 |
| popupProps | `Partial<PopupProps>` | - | 弹窗组件的属性 |
| popupOn | `object` | `{}` | 弹窗组件的事件 |

### AreaSlots

| 插槽名 | 绑定值 | 描述 |
| :--- | :--- | :--- |
| toolbar | `CommonSlotsProps` | 自定义整个顶部栏的内容 |
| title | `CommonSlotsProps` | 自定义标题内容 |
| confirm | `CommonSlotsProps` | 自定义确认按钮内容 |
| cancel | `CommonSlotsProps` | 自定义取消按钮内容 |
| columnsTop | `CommonSlotsProps` | 自定义选项上方内容 |
| columnsBottom | `CommonSlotsProps` | 自定义选项下方内容 |

## Slots

支持所有 [CommonSlots](/options/shares/share-slots) 插槽。

## 示例

### 基础用法

```typescript
const formConfig = defineOption([
    {
        field: 'address',
        t: 'area',
        label: '所在地区',
        placeholder: '请选择省市区',
    },
]);
```

### 使用自定义数据

```typescript
const formConfig = defineOption([
    {
        field: 'address',
        t: 'area',
        label: '所在地区',
        options: customAreaData,
        showAllLevels: true,
        separator: ' - ',
    },
]);
```

### 自定义格式化

```typescript
const formConfig = defineOption([
    {
        field: 'address',
        t: 'area',
        label: '所在地区',
        format: ({ value, showAllLevels, separator }) => {
            if (!value) return '';
            return `地区: ${value}`;
        },
    },
]);
```
