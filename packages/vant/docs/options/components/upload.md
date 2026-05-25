# Upload 文件上传

文件上传组件，基于 Vant `Uploader` + `Field` 组件实现。

## 类型标识

- `t: 'upload'`

## 额外 Props

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| uploadProps | `Partial<UploaderProps>` | - | VanUploader 组件的属性 |
| uploadOn | `object` | `{}` | VanUploader 组件的事件 |
| uploadSlots | `UploadSlots` | - | VanUploader 组件的插槽 |
| afterRead | `(file, detail, option) => void` | - | 文件读取完毕后执行的回调 |
| uploadRequest | `(option) => Promise<any> \| void` | - | 文件上传方法 |
| uploadingMessage | `string \| Function` | `'上传中'` | 上传中的提示 |
| failedMessage | `string \| Function` | - | 失败的提示 |

### UploadSlots

| 插槽名 | 绑定值 | 描述 |
| :--- | :--- | :--- |
| default | `CommonSlotsProps` | 自定义上传区域 |
| previewDelete | `CommonSlotsProps` | 自定义删除按钮 |
| previewCover | `{ item } & CommonSlotsProps` | 自定义覆盖在预览区域上方的内容 |

### UploadOption

| 参数 | 类型 | 描述 |
| :--- | :--- | :--- |
| file | `FileInfo` | 当前选中的第一个文件 |
| files | `FileInfo[]` | 多选时所有文件 |
| success | `(file, res) => void` | 成功回调 |
| fail | `(file, res) => void` | 失败回调 |

## Slots

支持所有 [CommonSlots](/options/shares/share-slots) 插槽。

## 示例

### 基础用法

```typescript
const formConfig = defineOption([
    {
        field: 'files',
        t: 'upload',
        label: '附件',
        uploadProps: {
            multiple: true,
            maxCount: 5,
            accept: '.jpg,.jpeg,.png,.gif',
        },
    },
]);
```

### 自定义上传请求

```typescript
const formConfig = defineOption([
    {
        field: 'files',
        t: 'upload',
        label: '附件',
        uploadRequest: ({ file, files, success, fail }) => {
            const formData = new FormData();
            formData.append('file', file.file as Blob);
            fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })
                .then(res => res.json())
                .then(res => {
                    file.url = res.url;
                    success(file, res);
                })
                .catch(err => fail(file, err));
        },
    },
]);
```

### 图片预览模式

```typescript
const formConfig = defineOption([
    {
        field: 'images',
        t: 'upload',
        label: '图片',
        uploadProps: {
            multiple: true,
            maxCount: 9,
            uploadIcon: 'photograph',
        },
        afterRead: (file, detail, option) => {
            console.log('文件已读取:', file);
        },
    },
]);
```

### 自定义上传区域

```tsx
const formConfig = defineOption([
    {
        field: 'files',
        t: 'upload',
        label: '附件',
        uploadSlots: {
            default: () => (
                <VanButton icon="plus" type="primary">
                    上传文件
                </VanButton>
            ),
        },
    },
]);
```
