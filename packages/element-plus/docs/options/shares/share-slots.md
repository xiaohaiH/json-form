# 共享 slots

所有组件都可定义的 `slots`

## 插槽

### default

- 类型: `(props: T) => any`
- 默认: `-`

::: details 点我查看类型 `T` 的声明

<<< ../declaration.ts#slotProps

---

<<< ../declaration.ts#plain

:::

默认插槽, 取代当前渲染的组件(一般不建议使用), 自定义程度高可使用 [`custom-render`](../components/custom-render.md) 组件

### before

- 类型: `(props: T) => any`
- 默认: `-`

在组件前渲染

### after

- 类型: `(props: T) => any`
- 默认: `-`

在组件后渲染

### postfix

- 类型: `() => any`
- 默认: `-`

在最后渲染, 与 `after` 的区别在于, `postfix` 是渲染到指定 `div.json-form-item__postfix` 中的
可用于多个 `input` 的之间用 `-` 相连的场景

## 示例

```tsx
defineOption({
    ageStart: {
        t: 'input',
        label: '年龄',
        placeholder: '起始值',
        slots: { postfix: '-' },
    },
    ageEnd: {
        t: 'input',
        placeholder: '结束值',
    },
});

defineOption({
    ageStart: {
        t: 'input',
        label: '年龄',
        placeholder: '起始值',
        slots: {
            before: ({ plain }) => (
                <div>
                    当前值为:
                    {plain.checked.value}
                </div>
            ),
        },
    },
});
```
