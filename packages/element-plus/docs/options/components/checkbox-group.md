# CheckboxGroup 复选框组

`CheckboxGroup` 组件是一个基于 `ElementPlus` 复选框组的封装组件, 支持多选功能和选项配置.

## 基本用法

```tsx
import { defineOption } from '@xiaohaih/json-form-plus';

defineOption({
    hobbies: {
        t: 'checkbox-group',
        label: '兴趣爱好',
        options: [
            { label: '阅读', value: 'reading' },
            { label: '音乐', value: 'music' },
            { label: '运动', value: 'sports' },
        ],
    },
});
```

## Props

除了 [共享 Props](../shares/share-props.md) 和 [ElCheckboxGroup 自带的 Props](https://element-plus.org/zh-CN/component/checkbox.html#checkboxgroup-attributes) 外, `CheckboxGroup` 组件还支持以下特定属性:

### labelKey

- 类型: `string`
- 默认: `'label'`

展示的字段

### valueKey

- 类型: `string`
- 默认: `'value'`

提交的字段

### type

- 类型: `'checkbox' | 'button'`
- 默认: -

按钮类型(checkbox|button), 默认 checkbox

### disabledKey

- 类型: `string`
- 默认: `'disabled'`

选项禁用字段

### itemProps

- 类型: `Partial<ExtractPublicPropTypes<ReturnType<typeof emits2props<typeof elCheckboxProps, [NonNullable<typeof elCheckboxEmits>]>>>>`
- 默认: -

暴露给 `Checkbox` 或 `CheckboxButton` 的属性

## 插槽

- 插槽项请参考 [`ElCheckbox.slots`](https://element-plus.org/zh-CN/component/checkbox.html#checkbox-slots)

- 插槽实际的 `Props` 等于**插槽自带的 `Props` + `SlotProps`**

::: details 插槽示例

```tsx
defineOption({
    sex: {
        t: 'checkbox-group',
        label: '性别',
        itemSlots: {
            default: ({ option }) => h('span', `自定义-${option.label}`),
        },
        options: [
            { label: '男', value: '1' },
            { label: '女', value: '2' },
        ],
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

### 基础复选框组 + 自定义字段名 + 禁用特定字段

```tsx
defineOption({
    skills: {
        t: 'checkbox-group',
        label: '技能',
        labelKey: 'name',
        valueKey: 'id',
        options: [
            { name: 'JavaScript', id: 'js' },
            { name: 'TypeScript', id: 'ts' },
            { name: 'Vue', id: 'vue' },
            { name: 'React', id: 'react', disabled: true },
        ],
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7543910791801077806)

<Iframe src="https://code.juejin.cn/pen/7543910791801077806" />
:::

### 按钮样式 + 校验

```tsx
defineOption({
    colors: {
        t: 'checkbox-group',
        label: '颜色',
        type: 'button',
        options: [
            { label: '红色', value: 'red' },
            { label: '绿色', value: 'green' },
            { label: '蓝色', value: 'blue' },
        ],
        rules: [
            { required: true, message: '不能为空' },
            { validator(rule, value, cb) {
                if (!value) return cb([]);
                cb(value.includes('green') ? [] : ['绿色是必不可少的']);
            } },
        ],
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7543915945897050164)

<Iframe src="https://code.juejin.cn/pen/7543915945897050164" />
:::

### 远程数据

```tsx
defineOption({
    tags: {
        t: 'checkbox-group',
        label: '标签',
        async getOptions(callback) {
            const tags = await fetchTags();
            callback(tags);
        },
    },
});
```

## 注意事项

1. 支持 `ElFormItem` 组件所有的 `Props`
2. 支持 `ElCheckboxGroup` 组件所有的 `Props`
3. 选项对象需要包含 `label` 和 `value` 字段, 可通过 `labelKey` 和 `valueKey` 自定义字段名
4. 设置 `type: 'button'` 可以显示为按钮样式
5. 可以通过 `disabled` 字段禁用特定选项

::: info tips: 当 `ElFormItem` 组件与 `ElCheckboxGroup` 组件的 `Props` 冲突时

- 可通过 `formItemProps` 将属性传递给 `ElFormItem`

- 可通过 `staticProps` 将属性传递给 `ElCheckboxGroup`

:::
