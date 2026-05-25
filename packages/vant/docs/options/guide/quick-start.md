# 快速上手

## 安装

```bash
# 使用 pnpm
pnpm add @xiaohaih/json-form-vant

# 或使用 npm
npm install @xiaohaih/json-form-vant

# 或使用 yarn
yarn add @xiaohaih/json-form-vant
```

## 基础用法

```vue
<template>
    <HForm v-model="formData" :config="formConfig">
        <VanButton @click="submit">
            提交
        </VanButton>
    </HForm>
</template>

<script setup lang="ts">
import { defineOption, HForm } from '@xiaohaih/json-form-vant';
import { ref } from 'vue';

const formData = ref({
    username: '',
    email: '',
    password: '',
});

/** 数组形式定义 */
const formConfig = defineOption([
    {
        field: 'username',
        t: 'input',
        label: '用户名',
        placeholder: '请输入用户名',
        rules: [
            { required: true, message: '请输入用户名' },
        ],
    },
    {
        field: 'email',
        t: 'input',
        label: '邮箱',
        placeholder: '请输入邮箱',
    },
    {
        field: 'password',
        t: 'input',
        label: '密码',
        type: 'password',
        placeholder: '请输入密码',
        showPassword: true,
    },
]);

function submit() {
    console.log('提交数据:', formData.value);
}
</script>
```

## defineOption

`defineOption` 用于创建响应式表单配置的函数。

### 数组形式（推荐）

推荐用数组形式，能推断出子级 `config` 下的字段，且通过函数返回配置值时，不主动声明泛型参数时，TypeScript 也不会报错。

```typescript
const formConfig = defineOption([
    {
        field: 'username',
        t: 'input',
        label: '用户名',
    },
    {
        field: 'email',
        t: 'input',
        label: '邮箱',
    },
]);
```

### 对象形式

```typescript
const formConfig = defineOption({
    username: {
        t: 'input',
        label: '用户名',
    },
    email: {
        t: 'input',
        label: '邮箱',
    },
});
```

### 函数形式

通过函数返回配置，可以获取到表单的 model 对象、表单实例等参数。

```typescript
const formConfig = defineOption(({ query, wrapper, formRef }) => [
    {
        field: 'username',
        t: 'input',
        label: '用户名',
        // 动态属性，根据表单其他字段的值动态设置
        disabled: !query.email,
    },
    {
        field: 'email',
        t: 'input',
        label: '邮箱',
    },
]);
```

### 函数参数

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| query | `Record<string, any>` | 表单的 model 对象 |
| wrapper | `ReturnType<typeof useWrapper>` | 表单级的共用属性 |
| formRef | `FormInstance` | Vant 表单实例 |

## 依赖关系

```typescript
const formConfig = defineOption({
    province: {
        t: 'picker',
        label: '省份',
        options: [
            { label: '北京市', value: 'beijing' },
            { label: '上海市', value: 'shanghai' },
        ],
    },
    city: {
        t: 'picker',
        label: '城市',
        depend: true,
        dependFields: 'province',
        async getOptions(cb, query) {
            const cities = await fetchCities(query.province);
            cb(cities);
        },
    },
});
```

## 表单校验

```typescript
const formConfig = defineOption([
    {
        field: 'password',
        t: 'input',
        label: '密码',
        rules: [
            { required: true, message: '密码不能为空' },
            { min: 6, message: '密码不能少于6位' },
            {
                validator: async (rule, value, callback) => {
                    const response = await checkPasswordStrength(value);
                    if (!response.strong) {
                        callback(new Error('密码强度不够'));
                    }
                    else {
                        callback();
                    }
                },
            },
        ],
    },
]);
```
