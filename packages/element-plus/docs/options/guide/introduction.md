# 简介

通过 `json` 对象配置表单, 基于 `ElementPlus`

## 安装

::: code-group

```bash [pnpm]
$ pnpm i -S @xiaohaih/json-form-plus
```

:::

::: details 简单示例

```vue
<template>
    <HForm
        :datum="formOption"
        :render-btn="false" :realtime="true"
        @search="log" @submit.prevent
    />
</template>

<script lang="tsx" setup>
import { defineOption, HForm } from '@xiaohaih/json-form-plus';

// 定义表单配置项
function formOption() {
    return defineOption({
        name: { t: 'input', label: '姓名', placeholder: '请输入' },
    });
}

const log = console.log.bind(null, '表单值: ');
</script>
```

:::

## 通过 `CDN` 使用

- 在浏览器中使用最新版(tips: `0.1.11` 才兼容在浏览器中使用)

```html
<script src="//unpkg.com/@xiaohaih/json-form-plus@latest"></script>

<script>
    const { version, coreVersion, HForm, defineOption } = JSONForm;

    console.log({ version, coreVersion });

    defineOption({
        age: {
            t: 'input-number',
            label: '年龄',
            placeholder: '请输入',
            debounceTime: 300,
        },
    });
</script>
```
