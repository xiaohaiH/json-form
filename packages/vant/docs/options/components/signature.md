# Signature 手写签名

手写签名组件，基于 Vant `Signature` + `Field` 组件实现。

## 类型标识

- `t: 'signature'`

## 额外 Props

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| renderField | `boolean` | `true` | 是否渲染 VanField 组件 |
| signatureProps | `Partial<SignatureProps>` | - | VanSignature 组件的属性 |
| signatureOn | `object` | `{}` | VanSignature 组件的事件 |
| signatureSlots | `SignatureSlots` | - | VanSignature 组件的插槽 |
| submitAtEnd | `boolean` | `true` | 是否在结束签名时触发一次提交事件（需要 vant >= 4.8.6） |
| valueFormat | `(option) => any \| Promise<any>` | - | 对提交的数据进行处理 |
| format | `(option) => string` | - | 当需要作为图片回显时的处理函数 |

### SignatureSlots

| 插槽名 | 绑定值 | 描述 |
| :--- | :--- | :--- |
| tips | `CommonSlotsProps` | 自定义提示文案 |

### SubmitOption

| 参数 | 类型 | 描述 |
| :--- | :--- | :--- |
| image | `string` | base64 图片数据 |
| canvas | `string` | canvas 数据 |

## Slots

支持所有 [CommonSlots](/options/shares/share-slots) 插槽。

## 示例

### 基础用法

```typescript
const formConfig = defineOption([
    {
        field: 'signature',
        t: 'signature',
        label: '签名',
        signatureProps: {
            penColor: '#1989fa',
            backgroundColor: '#f5f5f5',
        },
    },
]);
```

### 自定义数据处理

```typescript
const formConfig = defineOption([
    {
        field: 'signature',
        t: 'signature',
        label: '签名',
        valueFormat: (option) => {
            // 将签名数据转换为 base64 字符串存储
            return option.image;
        },
        format: (option) => {
            // 回显时直接返回 base64 字符串
            if (typeof option === 'string') return option;
            return option.image;
        },
    },
]);
```

### 自定义提示

```tsx
const formConfig = defineOption([
    {
        field: 'signature',
        t: 'signature',
        label: '签名',
        signatureSlots: {
            tips: () => <div style="color:#999;font-size:12px">请在下方空白区域签名</div>,
        },
    },
]);
```
