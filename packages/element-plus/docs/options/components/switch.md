# Switch 开关

`Switch` 组件是一个基于 `ElementPlus` 开关的封装组件, 用于布尔值的切换.

## 基本用法

```tsx
import { defineOption } from '@xiaohaih/json-form-plus';

defineOption({
    enabled: {
        t: 'switch',
        label: '启用状态',
    },
});
```

## Props

支持 [共享 Props](../shares/share-props.md) 和 [ElSwitch 自带的 Props](https://element-plus.org/zh-CN/component/switch.html#attributes)

## 插槽

- 插槽项请参考 [`ElSwitch.slots`](https://element-plus.org/zh-CN/component/switch.html#switch-slots)

- 插槽实际的 `Props` 等于**插槽自带的 `Props` + `SlotProps`**

::: details 插槽示例

```tsx
defineOption({
    notification: {
        t: 'switch',
        label: '通知',
        activeText: '开启',
        inactiveText: '关闭',
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

### 基础开关 + 带文字说明 + 带图标

```tsx
defineOption({
    status: {
        t: 'switch',
        label: '状态',
        defaultValue: true,
    },
    notification: {
        t: 'switch',
        label: '通知',
        activeText: '开启',
        inactiveText: '关闭',
    },
    wifi: {
        t: 'switch',
        label: 'WiFi',
        activeActionIcon: View,
        inactiveActionIcon: Hide,
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7545045283970514953)

<Iframe src="https://code.juejin.cn/pen/7545045283970514953" />
:::

### 禁用状态 + 自定义颜色

```tsx
defineOption({
    feature: {
        t: 'switch',
        label: '功能',
        disabled: true
    },
    theme: {
        t: 'switch',
        label: '主题',
        activeColor: '#13ce66',
        inactiveColor: '#ff4949',
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7545047884224593974)

<Iframe src="https://code.juejin.cn/pen/7545047884224593974" />
:::

## 注意事项

1. 支持 `ElFormItem` 组件所有的 `Props`
2. 支持 `ElSwitch` 组件所有的 `Props`

::: info tips: 当 `ElFormItem` 组件与 `ElSwitch` 组件的 `Props` 冲突时

- 可通过 `formItemProps` 将属性传递给 `ElFormItem`

- 可通过 `staticProps` 将属性传递给 `ElSwitch`

:::
