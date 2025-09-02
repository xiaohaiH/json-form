# Radio 单选框

`Radio` 组件是一个基于 `ElementPlus` 单选框的封装组件, 用于单选功能.

## 基本用法

```tsx
import { defineOption } from '@xiaohaih/json-form-plus';

defineOption({
    gender: {
        t: 'radio',
        label: '性别',
        options: [
            { label: '男', value: 'male' },
            { label: '女', value: 'female' },
        ],
    },
});
```

## Props

支持 [共享 Props](../shares/share-props.md) 和 [ElRadio 自带的 Props](https://element-plus.org/zh-CN/component/radio.html#radio-attributes)

## 插槽

- 插槽项请参考 [`ElRadio.slots`](https://element-plus.org/zh-CN/component/radio.html#radio-slots)

- 插槽实际的 `Props` 等于**插槽自带的 `Props` + `SlotProps`**

::: details 插槽示例

```tsx
defineOption({
    protocol: {
        t: 'radio',
        label: '同意协议',
        initialValue: '1',
        value: '1',
        cancelable: true,
        itemSlots: {
            default: () => h('div', '我已阅读并同意《用户协议》和《隐私政策》'),
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

### 基础单选框

```tsx
defineOption({
    protocol: {
        t: 'radio',
        label: '同意协议',
        value: '1',
        staticProps: { label: '同意' },
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7545008777355870246)

<Iframe src="https://code.juejin.cn/pen/7545008777355870246" />
:::

### 初始值 + 可取消

```tsx
defineOption({
    size: {
        t: 'radio',
        label: '尺寸',
        value: true,
        initialValue: true,
        cancelable: true,
        staticProps: {
            label: '超大',
        },
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7545013447458160666)

<Iframe src="https://code.juejin.cn/pen/7545013447458160666" />
:::

## 注意事项

1. 支持 `ElFormItem` 组件所有的 `Props`
2. 支持 `ElRadio` 组件所有的 `Props`
3. `Radio` 组件必须传递 `value` 属性

::: info tips: 当 `ElFormItem` 组件与 `ElRadio` 组件的 `Props` 冲突时

- 可通过 `formItemProps` 将属性传递给 `ElFormItem`

- 可通过 `staticProps` 将属性传递给 `ElRadio`

:::
