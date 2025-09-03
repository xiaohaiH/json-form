# 快速上手

## 基本用法

- [查看单文件示例](https://code.juejin.cn/pen/7543887055760130086)
- [查看项目中使用示例](https://stackblitz.com/edit/vitejs-vite-yjwbpxsp?file=src%2FApp.vue)

::: details 查看示例 {open}

```vue
<template>
    <HForm
        ref="hFormRef"
        :datum="formOption" :backfill="query"
        :render-btn="false" :realtime="true"
        size="small" label-position="right" label-width="120px"
        @search="search" @ready="search" @submit.prevent
    >
        <ElFormItem>
            <ElButton size="small" @click="reset">
                重置
            </ElButton>
            <ElButton size="small" type="primary" @click="submit">
                提交
            </ElButton>
        </ElFormItem>
    </HForm>
</template>

<script lang="tsx" setup>
import { defineOption, HForm } from '@xiaohaih/json-form-plus';
import { ElAlert, ElButton, ElFormItem } from 'element-plus';
import { useTemplateRef } from 'vue';

const hFormRef = useTemplateRef('hFormRef');

// 定义表单配置项
function formOption() {
    return defineOption({
        name: { t: 'input', label: '姓名', placeholder: '请输入' },
    });
}

const query = ref<Record<string, any>>({});
function search(params: Record<string, any>) {
    query.value = params;
}
function reset() {
    hFormRef.value.reset();
}
async function submit() {
    try {
        await hFormRef.value.formRef.validate();
        ElNotification.success(`当前值为: ${JSON.stringify(query.value)}`);
    }
    catch (error) {
        ElMessage.warning(error.message || '校验失败');
        console.log(error);
    }
}
</script>
```

:::
