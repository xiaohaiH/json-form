# Mention 提及框

`Mention` 组件是一个基于 `ElementPlus` 提及框的封装组件, 支持 `@` 提及功能和自动完成.

## 基本用法

```tsx
import { defineOption } from '@xiaohaih/json-form-plus';

defineOption({
    content: {
        t: 'mention',
        label: '内容',
        placeholder: '请输入内容,使用 @ 提及用户',
        options: [{ label: '老A', value: '老A' }, { label: '老B', value: '老B' }],
    },
});
```

## Props

除了 [共享 Props](../shares/share-props.md) 和 [ElMention 等相关组件的 Props](https://element-plus.org/zh-CN/component/mention.html#%E5%B1%9E%E6%80%A7) 外, `Mention` 组件还支持以下特定属性:

### realtime

- 类型: `boolean`
- 默认: `true`

是否实时触发搜索事件

### waitTime

- 类型: `number`
- 默认: `300`

实时触发时防抖动的时间

### clearable

- 类型: `boolean`
- 默认: `true`

是否显示清除按钮

## 插槽

- 插槽项请参考 [`ElInputNumber.slots`](https://element-plus.org/zh-CN/component/mention.html#slots)

- 插槽实际的 `Props` 等于**插槽自带的 `Props` + `SlotProps`**

::: details 插槽示例

```tsx
defineOption({
    mention: {
        t: 'mention',
        label: '用户',
        itemSlots: {
            header: () => h('div', '用户名称'),
        },
        options: [{ label: '老A', value: '老A' }, { label: '老B', value: '老B' }],
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

### 基础提及框 + 自定义触发字符

```tsx
defineOption({
    comment: {
        t: 'mention',
        label: '评论',
        placeholder: '请输入评论,使用 @ 提及用户',
        options: [
            { label: '张三', value: 'zhangsan' },
            { label: '李四', value: 'lisi' },
            { label: '王五', value: 'wangwu' },
        ],
    },
    content: {
        t: 'mention',
        label: '内容',
        placeholder: '请输入内容,使用 # 提及话题',
        prefix: '#',
        options: [
            { label: 'Vue', value: 'vue' },
            { label: 'React', value: 'react' },
            { label: 'Angular', value: 'angular' },
        ],
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7544991454897438771)

<Iframe src="https://code.juejin.cn/pen/7544991454897438771" />
:::

### 远程搜索

```tsx
defineOption({
    message: {
        t: 'mention',
        label: '消息',
        placeholder: '请输入消息,使用 @ 搜索用户',
        async getOptions(callback, query) {
            const users = await searchUsers();
            callback(users);
        },
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7545000667035729959)

<Iframe src="https://code.juejin.cn/pen/7545000667035729959" />
:::

## 注意事项

1. 支持 `ElFormItem` 组件所有的 `Props`
2. 支持 `ElMention` 组件所有的 `Props`

::: info tips: 当 `ElFormItem` 组件与 `Mention` 组件的 `Props` 冲突时

- 可通过 `formItemProps` 将属性传递给 `ElFormItem`

- 可通过 `staticProps` 将属性传递给 `Mention`

:::
