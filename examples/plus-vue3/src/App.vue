<template>
    <div class="size-full flex flex-col overflow-auto p-10px">
        <ElAlert class="flex-none" type="success" :closable="false">
            <span class="not-first:ml-10px">vue 版本: {{ version }}</span>
            <span class="not-first:ml-10px">element-plus 版本: {{ plusVersion }}</span>
            <span class="not-first:ml-10px">json-form 版本: {{ JSONFormVersion }}</span>
            <span class="not-first:ml-10px">json-form-core 版本: {{ coreVersion }}</span>
        </ElAlert>
        <ElAlert class="flex-none my-10px" type="error" :closable="false">
            表单校验
        </ElAlert>
        <ExampleForm class="h-65%" />
        <ElAlert class="flex-none my-10px" type="error" :closable="false">
            条件
        </ElAlert>
        <Condition class="h-35%" />
    </div>
</template>

<script lang="ts" setup>
import { coreVersion, version as JSONFormVersion } from '@xiaohaih/json-form-plus';
import { version as plusVersion } from 'element-plus';
import { version } from 'vue';
import Condition from './components/condition.vue';
import ExampleForm from './components/example-form.vue';

defineOptions({
    name: 'App',
});
</script>

<style scoped></style>
