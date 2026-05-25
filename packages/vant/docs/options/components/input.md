# Input 文本输入框

基础文本输入组件，基于 Vant `Field` 组件实现。

## 类型标识

- `t: 'input'`

## 额外 Props

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| clearable | `boolean` | `true` | 是否显示清除按钮 |
| debounceTime | `number` | `300` | 实时触发时防抖动的时间（毫秒） |

此外还继承了 Vant `Field` 组件的所有属性，如 `type`、`maxlength`、`showWordLimit`、`autosize` 等。

## Slots

支持所有 [CommonSlots](/options/shares/share-slots) 插槽。

## 示例

### 基础用法

```typescript
const formConfig = defineOption([
    {
        field: 'username',
        t: 'input',
        label: '用户名',
        placeholder: '请输入用户名',
        clearable: true,
        maxlength: 20,
        showWordLimit: true,
        rules: [
            { required: true, message: '请输入用户名' },
        ],
    },
]);
```

### 密码输入

```typescript
const formConfig = defineOption([
    {
        field: 'password',
        t: 'input',
        label: '密码',
        type: 'password',
        placeholder: '请输入密码',
        showPassword: true,
    },
]);
```

### 文本域

```typescript
const formConfig = defineOption([
    {
        field: 'description',
        t: 'input',
        label: '描述',
        type: 'textarea',
        placeholder: '请输入描述',
        rows: 3,
        autosize: { maxHeight: 200, minHeight: 50 },
        showWordLimit: true,
        maxlength: 200,
    },
]);
```

### 防抖输入

```typescript
const formConfig = defineOption([
    {
        field: 'keyword',
        t: 'input',
        label: '搜索',
        placeholder: '输入关键词搜索',
        debounceTime: 500, // 500ms 防抖
    },
]);
```

### 自定义插槽

```tsx
const formConfig = defineOption([
    {
        field: 'code',
        t: 'input',
        label: '验证码',
        placeholder: '请输入验证码',
        maxlength: 6,
        slots: {
            button: () => <VanButton size="small" type="primary">发送验证码</VanButton>,
            rightIcon: ({ plain }) => (
                plain.checked.value
                    ? <VanIcon name="success" color="green" />
                    : null
            ),
        },
    },
]);
```
