# SelectV2 虚拟列表下拉框

`SelectV2` 组件是一个基于 `ElementPlus` 虚拟列表下拉框的封装组件, 支持大数据量的高效渲染.

## 基本用法

```tsx
import { defineOption } from '@xiaohaih/json-form-plus';

defineOption({
    users: {
        t: 'select-v2',
        label: '用户',
        options: [
            { label: '用户1', value: 'user1' },
            { label: '用户2', value: 'user2' },
        ],
    },
});
```

## Props

除了 [共享 Props](../shares/share-props.md) 和 [ElSelectV2 自带的 Props](https://element-plus.org/zh-CN/component/select-v2.html#attributes) 外, `SelectV2` 组件还支持以下特定属性:

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
- 默认: `-`

过滤方法(第一项是搜索值, 第二项是筛选数据, 过滤掉返回 `false` 的数据)

## 插槽

- 插槽项请参考 [`ElSelectV2.slots`](https://element-plus.org/zh-CN/component/select-v2.html#slots)

- 插槽实际的 `Props` 等于**插槽自带的 `Props` + `SlotProps`**

::: details 插槽示例

```tsx
defineOption({
    items: {
        t: 'select-v2',
        label: '项目',
        options: Array.from({ length: 10000 }, (_, i) => ({
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

<script setup>
import Iframe from '../../vue-components/iframe.vue';
</script>

### 基础虚拟列表下拉框 + 过滤

```tsx
defineOption({
    items: {
        t: 'select-v2',
        label: '项目',
        options: Array.from({ length: 10000 }, (_, i) => ({
            label: `项目 ${i + 1}`,
            value: `item_${i + 1}`,
        })),
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7545026229834154047)

<Iframe src="https://code.juejin.cn/pen/7545026229834154047" />
:::

### 远程数据 + 远程搜索数据

```tsx
defineOption({
    users: {
        t: 'select-v2',
        label: '用户',
        multiple: true,
        placeholder: '请选择',
        // 第一项是搜索值, 第二项是筛选数据, 过滤掉返回 false 的数据
        filterMethod: (val, option) => {
            return option.label.toLowerCase().includes(val.toLowerCase()) || option.value.toLowerCase().includes(val.toLowerCase());
        },
        async getOptions(callback, query) {
            const users = await searchUsers();
            callback(users);
        },
    },
    tags: {
        t: 'select-v2',
        label: '标签',
        placeholder: '请选择',
        // 开启远程搜索
        remote: true,
        multiple: true,
        async getOptions(callback, query, { filterValue }) {
            // filterValue 为远程搜索的值
            if (!filterValue) return callback([]);
            const users = await searchUsers(filterValue);
            callback(users);
        },
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7545035332786978867)

<Iframe src="https://code.juejin.cn/pen/7545035332786978867" />
:::

## 注意事项

1. 支持 `ElFormItem` 组件所有的 `Props`
2. 支持 `ElSelectV2` 组件所有的 `Props`
3. `filterMethod` 和 `remoteMethod` 进行过调整, 示例请参考 [远程数据 + 远程搜索数据](#远程数据_+_远程搜索数据)

::: info tips: 当 `ElFormItem` 组件与 `ElSelectV2` 组件的 `Props` 冲突时

- 可通过 `formItemProps` 将属性传递给 `ElFormItem`

- 可通过 `staticProps` 将属性传递给 `ElSelectV2`

:::
