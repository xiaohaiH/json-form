<template>
    <div class="size-full flex flex-col overflow-auto p-10px">
        <ElAlert class="flex-none mb-10px" type="warning" :closable="false">
            vue 版本: {{ version }} - 表单校验
        </ElAlert>
        <ExampleForm />
        <ElAlert class="flex-none my-10px" type="error" :closable="false">
            vue 版本: {{ version }} - 条件
        </ElAlert>
        <Condition />
    </div>
</template>

<script lang="ts" setup>
import { version } from 'vue';
import Condition from './components/condition.vue';
import ExampleForm from './components/example-form.vue';

defineOptions({
    name: 'App',
});
</script>

<style scoped></style>
