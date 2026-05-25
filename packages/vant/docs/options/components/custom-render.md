# CustomRender 自定义渲染

自定义渲染组件，允许在表单中渲染任意自定义内容。

## 类型标识

- `t: 'custom-render'`

## 额外 Props

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| render | `(option: RenderOption) => () => VNode` | - | 渲染函数，返回一个渲染函数 |
| renderField | `boolean` | `true` | 是否渲染 VanField 组件 |

### RenderOption

| 参数 | 类型 | 描述 |
| :--- | :--- | :--- |
| props | `Record<string, any>` | 组件属性 |
| plain | `ReturnType<typeof usePlain>` | 表单状态对象 |

## 示例

### 基础用法

```tsx
const formConfig = defineOption([
    {
        field: 'customField',
        t: 'custom-render',
        render: ({ plain }) => {
            function onClick() {
                if (!plain.checked.value) return plain.checked.value = 1;
                ++plain.checked.value;
            }
            return () => {
                return (
                    <div>
                        <span>自定义内容</span>
                        <span>{plain.checked.value || 0}</span>
                        <VanButton onClick={onClick}>自增</VanButton>
                    </div>
                );
            };
        },
    },
]);
```

### 不渲染 Field 包裹

```tsx
const formConfig = defineOption([
    {
        field: 'customField',
        t: 'custom-render',
        renderField: false, // 不渲染 VanField 组件
        render: ({ plain }) => {
            return () => (
                <VanCell title="自定义内容">
                    <VanSwitch v-model={plain.checked.value} />
                </VanCell>
            );
        },
    },
]);
```

### 结合表单状态

```tsx
const formConfig = defineOption([
    {
        field: 'dynamicContent',
        t: 'custom-render',
        render: ({ plain, props }) => {
            return () => (
                <div style={{ padding: '12px 16px' }}>
                    <VanTag type={plain.checked.value ? 'success' : 'danger'}>
                        {plain.checked.value ? '已启用' : '已禁用'}
                    </VanTag>
                    <VanButton
                        size="small"
                        type={plain.checked.value ? 'danger' : 'primary'}
                        onClick={() => plain.checked.value = !plain.checked.value}
                    >
                        {plain.checked.value ? '禁用' : '启用'}
                    </VanButton>
                </div>
            );
        },
    },
]);
```
