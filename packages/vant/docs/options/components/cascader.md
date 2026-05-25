# Cascader 级联选择器

级联选择组件，基于 Vant `Cascader` + `Popup` + `Field` 组件实现。

## 类型标识

- `t: 'cascader'`

## 额外 Props

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| label | `string` | - | 输入框左侧文本 |
| placeholder | `string` | - | 输入框的提示文字 |
| isLink | `boolean` | `true` | 是否展示右侧箭头并开启点击反馈 |
| checkStrictly | `boolean` | `undefined` | 是否严格的遵守父子节点不互相关联（可选任意级） |
| showAllLevels | `boolean` | `undefined` | 是否显示全路径 |
| emitPath | `boolean` | `undefined` | 节点关联的情况下，是否返回所有路径 |
| onRowClick | `(option, ev) => void` | - | 点击事件，传递此事件时会忽略内部打开弹窗操作 |
| cascaderProps | `Partial<CascaderProps>` | `{}` | VanCascader 组件的属性 |
| cascaderOn | `object` | `{}` | VanCascader 组件的事件 |
| cascaderSlots | `CascaderSlots` | - | VanCascader 组件的插槽 |
| popupProps | `Partial<PopupProps>` | - | 弹窗组件的属性 |
| popupOn | `object` | `{}` | 弹窗组件的事件 |

### CascaderSlots

| 插槽名 | 绑定值 | 描述 |
| :--- | :--- | :--- |
| title | `CommonSlotsProps` | 自定义顶部标题 |
| option | `{ option, selected } & CommonSlotsProps` | 自定义选项文字 |
| optionsTop | `{ tabIndex } & CommonSlotsProps` | 自定义选项上方的内容 |
| optionsBottom | `{ tabIndex } & CommonSlotsProps` | 自定义选项下方的内容 |

## Slots

支持所有 [CommonSlots](/options/shares/share-slots) 插槽。

## 示例

### 基础用法

```typescript
const formConfig = defineOption([
    {
        field: 'region',
        t: 'cascader',
        label: '地区',
        placeholder: '请选择地区',
        options: [
            {
                text: '浙江省',
                value: '330000',
                children: [
                    { text: '杭州市', value: '330100' },
                    { text: '宁波市', value: '330200' },
                ],
            },
            {
                text: '江苏省',
                value: '320000',
                children: [
                    { text: '南京市', value: '320100' },
                    { text: '苏州市', value: '320500' },
                ],
            },
        ],
    },
]);
```

### 可选任意级

```typescript
const formConfig = defineOption([
    {
        field: 'region',
        t: 'cascader',
        label: '地区',
        checkStrictly: true, // 允许选择任意一级
        options: regionData,
    },
]);
```

### 自定义选项插槽

```tsx
const formConfig = defineOption([
    {
        field: 'category',
        t: 'cascader',
        label: '分类',
        options: categoryData,
        cascaderSlots: {
            option: ({ option, selected }) => (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{option.text}</span>
                    {selected && <VanIcon name="success" />}
                </div>
            ),
        },
    },
]);
```
