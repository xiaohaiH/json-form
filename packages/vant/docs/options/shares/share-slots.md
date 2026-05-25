# 共享 Slots

所有表单项组件共享以下通用插槽。

## CommonSlots

通用插槽定义，所有表单项组件都支持以下插槽：

| 插槽名 | 绑定值 | 描述 |
| :--- | :--- | :--- |
| label | `CommonSlotsProps` | 自定义输入框左侧文本 |
| input | `CommonSlotsProps` | 自定义输入框，使用此插槽后，与输入框相关的属性和事件将失效 |
| leftIcon | `CommonSlotsProps` | 自定义输入框头部图标 |
| rightIcon | `CommonSlotsProps` | 自定义输入框尾部图标 |
| button | `CommonSlotsProps` | 自定义输入框尾部按钮 |
| errorMessage | `{ message: string } & CommonSlotsProps` | 自定义底部错误提示文案 |
| extra | `CommonSlotsProps` | 自定义输入框最右侧的额外内容 |

## CommonSlotsProps

插槽通用参数：

| 参数 | 类型 | 描述 |
| :--- | :--- | :--- |
| props | `Record<string, any>` | 组件属性 |
| plain | `ReturnType<typeof usePlain>` | 表单状态对象 |

## 使用示例

### 自定义 label

```tsx
const formConfig = defineOption([
    {
        field: 'password',
        t: 'input',
        label: '密码',
        slots: {
            label: () => (
                <span class="custom-label">
                    密码
                    <VanIcon name="star" />
                </span>
            ),
        },
    },
]);
```

### 自定义尾部按钮

```tsx
const formConfig = defineOption([
    {
        field: 'code',
        t: 'input',
        label: '验证码',
        placeholder: '请输入验证码',
        slots: {
            button: () => <VanButton size="small" type="primary">发送验证码</VanButton>,
        },
    },
]);
```

### 自定义额外内容

```tsx
const formConfig = defineOption([
    {
        field: 'password',
        t: 'input',
        label: '密码',
        type: 'password',
        slots: {
            extra: () => <VanButton text type="primary">生成密码</VanButton>,
        },
    },
]);
```

### 使用插槽参数

```tsx
const formConfig = defineOption([
    {
        field: 'username',
        t: 'input',
        label: '用户名',
        slots: {
            // 通过 props 和 plain 获取组件状态
            rightIcon: ({ props, plain }) => (
                plain.checked.value
                    ? <VanIcon name="success" color="green" />
                    : <VanIcon name="cross" color="red" />
            ),
        },
    },
]);
```

## 组件专属插槽

除了通用插槽外，各组件还有自己的专属插槽，详见各组件文档。
