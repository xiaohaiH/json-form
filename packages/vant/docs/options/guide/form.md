# HForm 表单组件

HForm 是表单容器组件，负责解析 JSON 配置、管理表单状态、协调组件间通信、处理表单提交和校验。

## Props

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| v-model | `Record<string, any>` | - | 表单数据双向绑定 |
| config | `ReturnType<typeof defineOption>` | - | 表单配置对象 |
| label-width | `string \| number` | - | 标签宽度 |
| readonly | `boolean` | `false` | 是否只读 |
| disabled | `boolean` | `false` | 是否禁用 |
| rules | `Record<string, Rule[]>` | - | 表单级校验规则 |

此外，HForm 还继承了 Vant Form 组件的所有属性，如 `label-align`、`input-align`、`error-message-align` 等。

## Events

| 事件名 | 参数 | 描述 |
| :--- | :--- | :--- |
| search | `(data: Record<string, any>) => void` | 搜索事件 |
| submit | `(data: Record<string, any>) => void` | 提交事件（覆盖 Vant 默认 submit 事件，传递表单数据） |

此外，HForm 还继承了 Vant Form 组件的所有事件。

## Methods

| 方法名 | 参数 | 描述 |
| :--- | :--- | :--- |
| validate | `() => Promise<boolean>` | 校验表单 |
| validateField | `(fields: string \| string[]) => Promise<boolean>` | 校验指定字段 |
| clearValidate | `(fields?: string \| string[]) => void` | 清空校验 |
| resetValidation | `(fields?: string \| string[]) => void` | 重置表单验证 |
| reset | `() => void` | 重置表单 |
| submit | `() => void` | 触发提交 |
| getValues | `() => Record<string, any>` | 获取所有表单项当前的值 |
| getValidationStatus | `() => Record<string, any>` | 获取所有表单项的校验状态 |
| scrollToField | `(name: string, options?: ScrollIntoViewOptions) => void` | 滚动到指定表单字段 |

## Slots

| 插槽名 | 绑定值 | 描述 |
| :--- | :--- | :--- |
| prepend | `{ props, wrapper }` | 前置插槽 - 在表单项之前 |
| default | `{ props, wrapper }` | 默认插槽 - 在表单项之后 |

### 插槽参数

| 参数 | 类型 | 描述 |
| :--- | :--- | :--- |
| props | `ExtractPublicPropTypes<typeof formProps>` | 表单属性 |
| wrapper | `ReturnType<typeof useWrapper>` | 表单包装器实例 |

## 示例

### 基础用法

```vue
<template>
    <HForm v-model="formData" :config="formConfig" label-align="top">
        <VanButton type="primary" @click="submit">提交</VanButton>
    </HForm>
</template>

<script setup lang="ts">
import { defineOption, HForm } from '@xiaohaih/json-form-vant';
import { ref } from 'vue';

const formData = ref({ name: '', email: '' });

const formConfig = defineOption([
    {
        field: 'name',
        t: 'input',
        label: '姓名',
        placeholder: '请输入姓名',
    },
    {
        field: 'email',
        t: 'input',
        label: '邮箱',
        placeholder: '请输入邮箱',
    },
]);

function submit() {
    console.log('提交数据:', formData.value);
}
</script>
```

### 使用 prepend 插槽

```vue
<template>
    <HForm v-model="formData" :config="formConfig">
        <template #prepend="{ props, wrapper }">
            <VanCell title="用户信息" />
        </template>
        <VanButton @click="submit">提交</VanButton>
    </HForm>
</template>
```

### 调用表单方法

```vue
<template>
    <HForm ref="formRef" v-model="formData" :config="formConfig">
        <VanButton @click="handleValidate">校验</VanButton>
        <VanButton @click="handleReset">重置</VanButton>
    </HForm>
</template>

<script setup lang="ts">
import { defineOption, HForm } from '@xiaohaih/json-form-vant';
import type { HFormInstance } from '@xiaohaih/json-form-vant';
import { ref } from 'vue';

const formRef = ref<HFormInstance>();
const formData = ref({ name: '' });

const formConfig = defineOption([
    {
        field: 'name',
        t: 'input',
        label: '姓名',
        rules: [{ required: true, message: '请输入姓名' }],
    },
]);

async function handleValidate() {
    const valid = await formRef.value?.validate();
    if (valid) {
        console.log('校验通过');
    }
}

function handleReset() {
    formRef.value?.reset();
}
</script>
```
