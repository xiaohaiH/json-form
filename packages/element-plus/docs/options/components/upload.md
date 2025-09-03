# Upload 上传组件

`Upload` 组件是一个基于 `ElementPlus` 上传组件的封装组件, 提供了文件上传功能和增强配置.

## 基本用法

```tsx
import { defineOption } from '@xiaohaih/json-form-plus';

defineOption({
    avatar: {
        t: 'upload',
        label: '头像',
        action: '/api/upload',
        accept: 'image/*',
    },
});
```

## Props

除了 [共享 Props](../shares/share-props.md) 和 [ElUpload 自带的 Props](https://element-plus.org/zh-CN/component/upload.html#%E5%B1%9E%E6%80%A7) 外, `Upload` 组件还支持以下特定属性:

### httpRequest

- 类型: `(option: UploadRequestOptions) => Promise<unknown> | XMLHttpRequest | void`
- 默认: `-`

重声明该字段并做优化, 内部处理 success 和 promise 结果只执行一次

### beforeUpload

- 类型: `UploadHooks['beforeUpload']`
- 默认: `-`

上传前的钩子函数(做了大小限制以及重复文件处理)

### buttonText

- 类型: `string`
- 默认: `'上传图片'`

上传按钮显示的文字

### buttonAttrs

- 类型: 请参考 [`https://element-plus.org/zh-CN/component/button.html#button-attributes`](https://element-plus.org/zh-CN/component/button.html#button-attributes)
- 默认: `-`

上传按钮的属性

### fileMaxSize

- 类型: `number`
- 默认: `-`

上传文件的最大大小

### fileMaxSizeToast

- 类型: `(file: File, size: number) => void`
- 默认: ``(file: File, size: number) => ElMessage.error(`上传文件(\${file.name})大小不能超过\${~~((size / 1024 / 1024) \* 100) / 100}M\`)``

超过限制的文件大小时的提示语

### fileRepeatToast

- 类型: `(file: File) => void`
- 默认: ``(file: File) => ElMessage.error(\`不能重复上传文件(\${file.name})\`)``

上传相同文件时的提示语

### override

- 类型: `boolean`
- 默认: `-`

是否开启覆盖上传 - 当 limit 为 1 时生效

## 插槽

- 插槽项请参考 [`ElUpload.slots`](https://element-plus.org/zh-CN/component/upload.html#%E6%8F%92%E6%A7%BD)

- 插槽实际的 `Props` 等于**插槽自带的 `Props` + `SlotProps`**

::: details 插槽示例

```tsx
defineOption({
    avatar: {
        t: 'upload',
        label: '头像',
        itemSlots: {
            default: () => h('div', '点我上传'),
            tip: () => h('div', '只能上传图片啊~~~'),
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

### 基础文件上传 + 图片上传

```tsx
defineOption({
    file: {
        t: 'upload',
        label: '文件',
        action: '/api/upload',
        accept: '.pdf,.doc,.docx',
        limit: 5,
    },
    image: {
        t: 'upload',
        label: '图片',
        action: '/api/upload/image',
        accept: 'image/*',
        listType: 'picture-card',
        limit: 1,
        fileMaxSize: 2 * 1024 * 1024 // 2MB
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7545056561777868800)

<Iframe src="https://code.juejin.cn/pen/7545056561777868800" />
:::

### 自定义上传 + 拖拽上传

```tsx
defineOption({
    document: {
        t: 'upload',
        label: '文档',
        async httpRequest(options) {
            const formData = new FormData();
            formData.append('file', options.file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (result.success) {
                options.onSuccess(result.data);
            }
            else {
                options.onError(new Error(result.message));
            }
        },
    },
    files: {
        t: 'upload',
        label: '文件',
        action: '/api/upload',
        drag: true,
        multiple: true,
        buttonText: '点击或拖拽文件到此处上传',
        itemSlots: {
            default: () => h('div', { style: { margin: '0 40px', fontSize: '30px' } }, '+'),
        },
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7545059268018815014)

<Iframe src="https://code.juejin.cn/pen/7545059268018815014" />
:::

## 注意事项

1. 支持 `ElFormItem` 组件所有的 `Props`
2. 支持 `ElUpload` 组件所有的 `Props`
3. 可以通过 `fileMaxSize` 设置文件大小限制
4. 通过 `limit` 属性限制上传文件数量

::: info tips: 当 `ElFormItem` 组件与 `ElUpload` 组件的 `Props` 冲突时

- 可通过 `formItemProps` 将属性传递给 `ElFormItem`

- 可通过 `staticProps` 将属性传递给 `ElUpload`

:::
