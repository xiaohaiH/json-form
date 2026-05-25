# Picker 选择器

选择器组件，基于 Vant `Picker` + `Popup` + `Field` 组件实现。支持单列选择、多列选择、级联选择。

## 类型标识

- `t: 'picker'`
- `t: 'select'`

## 额外 Props

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| pickerProps | `Partial<PickerProps>` | - | VanPicker 组件的属性 |
| pickerOn | `object` | `{}` | VanPicker 组件的事件 |
| pickerSlots | `PickerSlots` | - | VanPicker 组件的插槽 |
| isLink | `boolean` | `true` | 是否展示右侧箭头并开启点击反馈 |
| onRowClick | `(option, ev) => void` | - | 点击事件，传递此事件时会忽略内部打开弹窗操作 |
| separator | `string` | `'/'` | 页面显示时多个值之间的分隔符 |
| showAllLevels | `boolean` | `true` | 是否显示全路径，多列不生效 |
| format | `(option) => any` | - | 对值进行格式化 - 显示在页面上的值 |
| valueTrigger | `'change' \| 'confirm' \| 'cancel'` | `'confirm'` | 值触发方式 |
| popupProps | `Partial<PopupProps>` | - | 弹窗组件的属性 |
| popupOn | `object` | `{}` | 弹窗组件的事件 |

### PickerSlots

| 插槽名 | 绑定值 | 描述 |
| :--- | :--- | :--- |
| toolbar | `CommonSlotsProps` | 自定义整个顶部栏的内容 |
| title | `CommonSlotsProps` | 自定义标题内容 |
| confirm | `CommonSlotsProps` | 自定义确认按钮内容 |
| cancel | `CommonSlotsProps` | 自定义取消按钮内容 |
| option | `{ option, index } & CommonSlotsProps` | 自定义选项内容 |
| columnsTop | `CommonSlotsProps` | 自定义选项上方内容 |
| columnsBottom | `CommonSlotsProps` | 自定义选项下方内容 |
| empty | `CommonSlotsProps` | 自定义空状态内容 |

## Slots

支持所有 [CommonSlots](/options/shares/share-slots) 插槽。

## 示例

### 基础选择

```typescript
const formConfig = defineOption([
    {
        field: 'city',
        t: 'picker',
        label: '城市',
        placeholder: '请选择城市',
        columns: [
            { text: '北京', value: 'beijing' },
            { text: '上海', value: 'shanghai' },
            { text: '广州', value: 'guangzhou' },
        ],
    },
]);
```

### 多列选择

```typescript
const formConfig = defineOption([
    {
        field: 'birthday',
        t: 'picker',
        label: '生日',
        columns: [
            // 第一列
            [
                { text: '2024年', value: '2024' },
                { text: '2025年', value: '2025' },
            ],
            // 第二列
            [
                { text: '1月', value: '1' },
                { text: '2月', value: '2' },
            ],
        ],
        separator: '-',
    },
]);
```

### 异步数据源

```typescript
const formConfig = defineOption([
    {
        field: 'province',
        t: 'picker',
        label: '省份',
        depend: true,
        dependFields: 'country',
        async getOptions(cb, query) {
            const provinces = await fetchProvinces(query.country);
            cb(provinces);
        },
    },
]);
```

### 自定义格式化

```typescript
const formConfig = defineOption([
    {
        field: 'date',
        t: 'picker',
        label: '日期',
        columns: dateColumns,
        format: ({ value, separator }) => {
            return value.join('-');
        },
    },
]);
```

### 自定义弹窗插槽

```tsx
const formConfig = defineOption([
    {
        field: 'city',
        t: 'picker',
        label: '城市',
        columns: cityList,
        pickerSlots: {
            title: () => <div style="text-align:center;font-weight:bold">请选择城市</div>,
            confirm: () => <VanButton type="primary" size="small">确定</VanButton>,
        },
    },
]);
```
