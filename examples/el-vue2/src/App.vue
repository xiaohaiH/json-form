<template>
    <div class="size-full flex flex-col overflow-hidden p-10px">
        <ElAlert class="flex-none" type="success" :closable="false">
            <span>vue 版本: {{ version }}</span>
            <span class="mx-10px">json-form 版本: {{ JSONFormVersion }}</span>
            <span class="mx-10px">json-form-core 版本: {{ coreVersion }}</span>
        </ElAlert>
        <ElAlert class="flex-none my-10px" type="error" :closable="false">
            表单校验
        </ElAlert>
        <ExampleForm class="h-65%" />
        <ElAlert class="flex-none my-10px" type="error" :closable="false">
            vue 版本: {{ version }} - 条件
        </ElAlert>
        <Condition class="h-35%" />
    </div>
</template>

<script lang="ts">
import { coreVersion, version as JSONFormVersion } from '@xiaohaih/json-form-el';
import { defineComponent, version } from 'vue';
import Condition from './components/condition.vue';
import ExampleForm from './components/example-form.vue';

export default defineComponent({
    name: 'App',
    components: { Condition, ExampleForm },
    setup() {
        return { version, coreVersion, JSONFormVersion };
    },
});
</script>

<style scoped></style>
