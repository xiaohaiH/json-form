# Cascader 级联选择器

`Cascader` 组件是一个基于 `ElementPlus` 级联选择器的封装组件, 支持多级数据的选择.

## 基本用法

```tsx
import { defineOption } from '@xiaohaih/json-form-plus';

defineOption({
    region: {
        t: 'cascader',
        label: '地区',
        options: [
            {
                value: 'beijing',
                label: '北京',
                children: [{ value: 'haidian', label: '海淀区' }],
            },
            {
                value: 'tianjin',
                label: '天津',
                children: [{ value: 'heping', label: '和平区' }],
            },
        ],
    },
});
```

## Props

除了 [共享 Props](../shares/share-props.md) 和 [ElCascader 自带的 Props](https://element-plus.org/zh-CN/component/cascader.html#cascader-attributes) 外, `Cascader` 组件还支持以下特定属性:

### filterable

- 类型: `boolean`
- 默认: `true`

是否可过滤

### clearable

- 类型: `boolean`
- 默认: `true`

是否可清除

## 插槽

- 插槽项请参考 [`ElCascader.slots`](https://element-plus.org/zh-CN/component/cascader.html#cascader-slots)

- 插槽实际的 `Props` 等于**插槽自带的 `Props` + `SlotProps`**

::: details 插槽示例

```tsx
defineOption({
    address: {
        t: 'cascader',
        label: '地区',
        placeholder: '请选择',
        itemSlots: {
            default: () => h('div', '没得数据'),
        },
        options: [],
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

### 基础级联选择 + 表单校验

```tsx
defineOption({
    address: {
        t: 'cascader',
        label: '地址',
        placeholder: '请选择',
        showAllLevels: false,
        props: { label: 'title', value: 'code', checkStrictly: true, emitPath: false },
        initialValue: 'hangzhou',
        options: [
            {
                code: 'zhejiang',
                title: '浙江',
                children: [
                    {
                        code: 'hangzhou',
                        title: '杭州',
                        children: [{ code: 'xihu', title: '西湖区' }],
                    },
                ],
            },
        ],
        rules: [
            { required: true, message: '不能为空' },
        ],
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7543894748365324334)

<Iframe src="https://code.juejin.cn/pen/7543894748365324334" />
:::

### 远程数据 + 各级对应不同字段 + 定义插槽

```tsx
defineOption({
    address: {
        t: 'cascader',
        label: '地区',
        placeholder: '请选择',
        showAllLevels: false,
        itemSlots: {
            empty: () => h('div', '没得数据'),
        },
        fields: ['province', 'city', 'region'],
        getOptions(callback) {
            setTimeout(() => {
                callback([
                    {
                        value: 'zhejiang',
                        label: '浙江',
                        children: [
                            {
                                value: 'hangzhou',
                                label: '杭州',
                                children: [{ value: 'xihu', label: '西湖区' }],
                            },
                            {
                                value: 'ningbo',
                                label: '宁波',
                                children: [{ value: 'yinzhou', label: '鄞州区' }],
                            },
                        ],
                    },
                    {
                        value: 'beijing',
                        label: '北京',
                        children: [
                            { value: 'chaoyang', label: '朝阳区', },
                            { value: 'tongzhou', label: '通州区', },
                        ],
                    },
                ]);
            }, 2000);
        },
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7543898693812879395)

<Iframe src="https://code.juejin.cn/pen/7543898693812879395" />
:::

## 注意事项

1. 支持 `ElFormItem` 组件所有的 `Props`
2. 支持 `ElCascader` 组件所有的 `Props`

::: info tips: 当 `ElFormItem` 组件与 `ElCascader` 组件的 `Props` 冲突时

- 可通过 `formItemProps` 将属性传递给 `ElFormItem`

- 可通过 `staticProps` 将属性传递给 `ElCascader`

:::
