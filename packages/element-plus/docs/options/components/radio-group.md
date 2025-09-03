# RadioGroup 单选框组

`RadioGroup` 组件是一个基于 `ElementPlus` 单选框组的封装组件, 支持单选功能和选项配置.

## 基本用法

```tsx
import { defineOption } from '@xiaohaih/json-form-plus';

defineOption({
    gender: {
        t: 'radio-group',
        label: '性别',
        options: [
            { label: '男', value: 'male' },
            { label: '女', value: 'female' },
        ],
    },
});
```

## Props

除了 [共享 Props](../shares/share-props.md) 和 [ElRadioGroup 等相关组件的 Props](https://element-plus.org/zh-CN/component/radio.html#radiogroup-attributes) 外, `RadioGroup` 组件还支持以下特定属性:

### labelKey

- 类型: `string`
- 默认: `'label'`

展示的字段

### valueKey

- 类型: `string`
- 默认: `'value'`

提交的字段

### type

- 类型: `'radio' | 'button'`
- 默认: `'radio'`

按钮显示的类型

### cancelable

- 类型: `boolean`
- 默认: `-`

选中状态是否可以被取消

### disabledKey

- 类型: `string`
- 默认: `'disabled'`

选项禁用字段

### itemProps

- 类型: `object`
- 默认: `-`

暴露给 Radio 或 RadioButton 的属性, 可参考[https://element-plus.org/zh-CN/component/radio.html#radio-attributes](https://element-plus.org/zh-CN/component/radio.html#radio-attributes)

## 插槽

- 插槽项请参考 [`ElRadio.slots`](https://element-plus.org/zh-CN/component/radio.html#radio-slots)

- 插槽实际的 `Props` 等于**插槽自带的 `Props` + `SlotProps`**

::: details 插槽示例

```tsx
defineOption({
    sex: {
        t: 'radio-group',
        label: '性别',
        itemSlots: {
            default: ({ option }) => h('div', `prefix-${option.label}`),
        },
        options: [{ label: '男', value: 'nan' }, { label: '女', value: 'nv' }],
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

### 基础单选框组 + 按钮样式

```tsx
defineOption({
    level: {
        t: 'radio-group',
        label: '等级',
        options: [
            { label: '初级', value: 'beginner' },
            { label: '中级', value: 'intermediate' },
            { label: '高级', value: 'advanced' },
        ],
    },
    size: {
        t: 'radio-group',
        label: '尺寸',
        type: 'button',
        options: [
            { label: '小', value: 'small' },
            { label: '中', value: 'medium' },
            { label: '大', value: 'large' },
        ],
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7545001395426967593)

<Iframe src="https://code.juejin.cn/pen/7545001395426967593" />
:::

### 可取消选择 + 带禁用选项 + 自定义字段名 + 远程数据

```tsx
defineOption({
    priority: {
        t: 'radio-group',
        label: '优先级',
        cancelable: true,
        options: [
            { label: '低', value: 'low' },
            { label: '中', value: 'medium' },
            { label: '高', value: 'high' },
        ],
    },
    role: {
        t: 'radio-group',
        label: '角色',
        options: [
            { label: '用户', value: 'user' },
            { label: '管理员', value: 'admin' },
            { label: '超级管理员', value: 'super_admin', disabled: true },
        ],
    },
    department: {
        t: 'radio-group',
        label: '部门',
        labelKey: 'name',
        valueKey: 'id',
        options: [
            { name: '技术部', id: 1 },
            { name: '设计部', id: 2 },
            { name: '产品部', id: 3 },
        ],
    },
    category: {
        t: 'radio-group',
        label: '分类',
        async getOptions(callback) {
            const categories = await fetchCategories();
            callback(categories);
        },
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7545007953091248168)

<Iframe src="https://code.juejin.cn/pen/7545007953091248168" />
:::

## 注意事项

1. 支持 `ElFormItem` 组件所有的 `Props`
2. 支持 `ElRadioGroup` 组件所有的 `Props`
3. 选项对象需要包含 `label` 和 `value` 字段或通过 `labelKey` 和 `valueKey` 自定义字段名
4. 设置 `type: 'button'` 可以显示为按钮样式
5. 设置 `cancelable: true` 允许取消选择
6. 可以通过 `disabled` 字段禁用特定选项

::: info tips: 当 `ElFormItem` 组件与 `ElRadioGroup` 组件的 `Props` 冲突时

- 可通过 `formItemProps` 将属性传递给 `ElFormItem`

- 可通过 `staticProps` 将属性传递给 `ElRadioGroup`

:::
