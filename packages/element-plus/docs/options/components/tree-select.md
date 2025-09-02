# TreeSelect 树形下拉框

`TreeSelect` 组件是一个基于 `ElementPlus` 树形下拉框的封装组件, 支持树形数据的选择.

## 基本用法

```tsx
import { defineOption } from '@xiaohaih/json-form-plus';

defineOption({
    category: {
        t: 'tree-select',
        label: '分类',
        options: [
            {
                value: '1',
                label: '一级 1',
                children: [
                    { value: '1-1', label: '二级 1-1', },
                    { value: '1-2', label: '二级 1-2', },
                ],
            },
        ],
    },
});
```

## Props

除了 [共享 Props](../shares/share-props.md) 和 [ElTreeSelect 自带的 Props](https://element-plus.org/zh-CN/component/tree-select.html#attributes) 外, `TreeSelect` 组件还支持以下特定属性:

### filterable

- 类型: `boolean`
- 默认: `true`

是否可过滤

### clearable

- 类型: `boolean`
- 默认: `true`

是否可清除

## 插槽

- 插槽项请参考 [`ElTree.slots`](https://element-plus.org/zh-CN/component/tree.html#%E6%8F%92%E6%A7%BD) 和 [`ElSelect.slots`](https://element-plus.org/zh-CN/component/select.html#select-slots)

- 插槽实际的 `Props` 等于**插槽自带的 `Props` + `SlotProps`**

::: details 插槽示例

```tsx
defineOption({
    department: {
        t: 'tree-select',
        label: '部门',
        options: [
            {
                value: '1',
                label: '技术部',
                children: [
                    {
                        value: '1-1',
                        label: '前端组',
                        children: [
                            { value: '1-1-1', label: 'Vue团队' },
                            { value: '1-1-2', label: 'React团队' },
                        ],
                    },
                    {
                        value: '1-2',
                        label: '后端组',
                        children: [
                            { value: '1-2-1', label: 'Java团队' },
                            { value: '1-2-2', label: 'Python团队' },
                        ],
                    },
                ],
            },
        ],
        itemSlots: {
            header: () => h('div', 'please...')
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

<script setup>
import Iframe from '../../vue-components/iframe.vue';
</script>

### 基础树形选择 + 多选模式

```tsx
defineOption({
    department: {
        t: 'tree-select',
        label: '部门',
        options: [
            {
                value: '1',
                label: '技术部',
                children: [
                    {
                        value: '1-1',
                        label: '前端组',
                        children: [
                            { value: '1-1-1', label: 'Vue团队' },
                            { value: '1-1-2', label: 'React团队' },
                        ],
                    },
                    {
                        value: '1-2',
                        label: '后端组',
                        children: [
                            { value: '1-2-1', label: 'Java团队' },
                            { value: '1-2-2', label: 'Python团队' },
                        ],
                    },
                ],
            },
        ],
    },
    permissions: {
        t: 'tree-select',
        label: '权限',
        multiple: true,
        checkStrictly: true,
        options: [
            {
                value: 'system',
                label: '系统管理',
                children: [
                    { value: 'user', label: '用户管理' },
                    { value: 'role', label: '角色管理' },
                    { value: 'menu', label: '菜单管理' },
                ],
            },
        ],
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7545052802381578292)

<Iframe src="https://code.juejin.cn/pen/7545052802381578292" />
:::

### 自定义搜索 + 搜索远程数据

```tsx
defineOption({
    category: {
        t: 'tree-select',
        label: '不区分大小写',
        filterNodeMethod: (value, data) => data.value.toLowerCase().includes(value.toLowerCase()),
        async getOptions(callback, query) {
            const org = await fetchOrganization();
            callback(org);
        },
    },
    organization: {
        t: 'tree-select',
        label: '组织架构',
        remote: true,
        async getOptions(callback, query, { filterValue }) {
            if (!filterValue) return callback([]);
            const org = await fetchOrganization(filterValue);
            callback(org);
        },
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7545054186598039603)

<Iframe src="https://code.juejin.cn/pen/7545054186598039603" />
:::

## 注意事项

1. 支持 `ElFormItem` 组件所有的 `Props`
2. 支持 `ElTree` 和 `ElSelect` 组件所有的 `Props`
3. 自定义过滤(`filterNodeMethod`)和远程搜索(`remote` 需要设为 `true`)请参考 [自定义搜索 + 搜索远程数据](#自定义搜索_+_搜索远程数据)

::: info tips: 当 `ElFormItem` 组件与 `ElTreeSelect` 组件的 `Props` 冲突时

- 可通过 `formItemProps` 将属性传递给 `ElFormItem`

- 可通过 `staticProps` 将属性传递给 `ElTreeSelect`

:::
