# Select 下拉框

`Select` 组件是一个基于 `ElementPlus` 下拉框的封装组件, 支持单选、多选、分组、过滤等功能.

## 基本用法

```tsx
import { defineOption } from '@xiaohaih/json-form-plus';

defineOption({
    status: {
        t: 'select',
        label: '状态',
        options: [
            { label: '启用', value: 1 },
            { label: '禁用', value: 0 },
        ],
    },
});
```

## Props

除了 [共享 Props](../shares/share-props.md) 和 [ElSelect 自带的 Props](https://element-plus.org/zh-CN/component/select.html#select-attributes) 外, `Select` 组件还支持以下特定属性:

### group

- 类型: `boolean`
- 默认: -

是否将选项进行分组

### groupChildrenKey

- 类型: `string`
- 默认: `'children'`

存在分组时的读取的子级键

### labelKey

- 类型: `string`
- 默认: `'label'`

展示的字段

### valueKey

- 类型: `string`
- 默认: `'value'`

提交的字段

### valueIsWhole

- 类型: `boolean`
- 默认: -

是否将整个选项都作为值传递给 `ElOption`(相当于忽略 `valueKey`)

### filterable

- 类型: `boolean`
- 默认: `true`

是否可过滤

### clearable

- 类型: `boolean`
- 默认: `true`

是否可清除

### filterMethod

- 类型: `(val: string, option: T) => boolean`
- 默认: -

过滤方法(第一项是搜索值, 第二项是筛选数据, 过滤掉返回 `false` 的数据)

### disabledKey

- 类型: `string`
- 默认: `'disabled'`

选项禁用字段

## 插槽

- 插槽项请参考 [`ElSelect.slots`](https://element-plus.org/zh-CN/component/select.html#select-slots)

- 插槽实际的 `Props` 等于**插槽自带的 `Props` + `SlotProps`**

::: details 插槽示例

```tsx
defineOption({
    items: {
        t: 'select',
        label: '项目',
        options: Array.from({ length: 100 }, (_, i) => ({
            label: `项目 ${i + 1}`,
            value: `item_${i + 1}`,
        })),
        itemSlots: {
            header: () => h('div', 'please...'),
        },
    },
});
```

:::

::: details SlotProps 声明如下

<<< ../declaration.ts#slotProps

---

<<< ../declaration.ts#plain
:::

## 示例

### 基础下拉框 + 分组下拉框

```tsx
defineOption({
    category: {
        t: 'select',
        label: '分类',
        options: [
            { label: '技术', value: 'tech' },
            { label: '设计', value: 'design' },
            { label: '产品', value: 'product' },
        ],
    },
    city: {
        t: 'select',
        label: '城市',
        group: true,
        options: [
            {
                label: '一线城市',
                children: [
                    { label: '北京', value: 'beijing' },
                    { label: '上海', value: 'shanghai' },
                ],
            },
            {
                label: '二线城市',
                children: [
                    { label: '杭州', value: 'hangzhou' },
                    { label: '南京', value: 'nanjing' },
                ],
            },
        ],
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7545039760717578274)

<Iframe src="https://code.juejin.cn/pen/7545039760717578274" />
:::

### 自定义过滤 + 远程搜索

```tsx
defineOption({
    product: {
        t: 'select',
        label: '产品',
        filterable: true,
        // 第一项是搜索值, 第二项是筛选数据, 过滤掉返回 false 的数据
        filterMethod: (val, option) => {
            return option.label.toLowerCase().includes(val.toLowerCase());
        },
        async getOptions(callback, query) {
            const users = await searchUsers();
            callback(users);
        },
    },
    user: {
        t: 'select',
        label: '用户',
        // 开启远程搜索
        remote: true,
        filterable: true,
        async getOptions(callback, query, { filterValue }) {
            // filterValue 为远程搜索的值
            if (!filterValue) return callback([]);
            const users = await searchUsers(filterValue);
            callback(users);
        },
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7545040976461430823)

<Iframe src="https://code.juejin.cn/pen/7545040976461430823" />
:::

## 注意事项

1. 支持 `ElFormItem` 组件所有的 `Props`
2. 支持 `ElSelect` 组件所有的 `Props`
3. 选项对象需要包含 `label` 和 `value` 字段或者使用 `labelKey` 和 `valueKey` 指定
4. 启用分组时, 选项需要包含 `children` 字段或使用 `groupChildrenKey` 指定
5. `filterMethod` 和 `remoteMethod` 进行过调整, 示例请参考 [远程数据 + 远程搜索数据](#自定义过滤_+_远程搜索)

::: info tips: 当 `ElFormItem` 组件与 `ElSelect` 组件的 `Props` 冲突时

- 可通过 `formItemProps` 将属性传递给 `ElFormItem`

- 可通过 `staticProps` 将属性传递给 `ElSelect`

:::
