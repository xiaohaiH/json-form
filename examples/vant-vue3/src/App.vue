<template>
    <div class="size-full flex flex-col overflow-auto p-10px">
        <VanConfigProvider theme="light">
            <VanNoticeBar class="flex-none" type="success" :closable="false">
                <span class="not-first:ml-10px">vue 版本: {{ version }}</span>
                <span class="not-first:ml-10px">vant 版本: {{ vanVersion }}</span>
                <span class="not-first:ml-10px">json-form 版本: {{ JSONFormVersion }}</span>
                <span class="not-first:ml-10px">json-form-core 版本: {{ coreVersion }}</span>
            </VanNoticeBar>
            <VanCollapse v-model="activeNames">
                <VanCollapseItem title="表单校验" name="1">
                    <ExampleForm />
                </VanCollapseItem>
                <VanCollapseItem title="条件" name="2">
                    <Condition />
                </VanCollapseItem>
            </VanCollapse>
        </VanConfigProvider>
    </div>
</template>

<script lang="ts" setup>
import { coreVersion, version as JSONFormVersion } from '@xiaohaih/json-form-vant';
import { Cell as VanCell, CellGroup as VanCellGroup, Collapse as VanCollapse, CollapseItem as VanCollapseItem, ConfigProvider as VanConfigProvider, Field as VanField, NoticeBar as VanNoticeBar, version as vanVersion } from 'vant';
import { ref, version } from 'vue';
import Condition from './components/condition.vue';
import ExampleForm from './components/example-form.vue';

defineOptions({
    name: 'App',
});

const activeNames = ref(['1']);
</script>

<style scoped></style>
