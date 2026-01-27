<template>
    <ElCard class="condition-form flex-auto">
        <div>
            <ElAlert type="success" :closable="false">
                <span>当前条件:</span>
                <span>{{ conditions.query }}</span>
            </ElAlert>
            <div class="my-10px flex flex-wrap">
                <ElButton type="danger" size="small" @click="clear">
                    清空所有条件并重置
                </ElButton>
                <ElButton
                    v-if="!!conditions.setQuery"
                    type="primary"
                    size="small"
                    @click="conditions.setQuery(conditions)"
                >
                    手动设置query
                </ElButton>
            </div>
            <HForm
                ref="hFormRef"
                v-bind="conditions.formOption"
                :key="conditions.formOption.key"
                class="flex flex-wrap items-start"
                :backfill="conditions.query"
                :config="conditions.condition"
                :toast="ElMessage.info"
                @submit.prevent
                @search="querySearch"
            >
                <ElButton type="primary" @click="search">
                    搜索
                </ElButton>
                <ElButton @click="reset">
                    重置
                </ElButton>
            </HForm>
        </div>
    </ElCard>
</template>

<script lang="ts" setup>
import type { HFormInstance } from '@xiaohaih/json-form-plus';
import { HForm } from '@xiaohaih/json-form-plus';
import { conditionFactory } from '~share/condition';
import { ElMessage } from 'element-plus';
import { nextTick, onMounted, ref } from 'vue';

/** @file 作为条件显示 */
defineOptions({
    name: 'Condition',
});

const hFormRef = ref<HFormInstance>();
const conditions = ref(conditionFactory());
/** 搜索 */
function querySearch(query: Record<string, string>) {
    conditions.value.query = query;
    console.log({ ...query }, '\n句柄: ', conditions.value);
}
/** 重置 */
async function reset() {
    if (!hFormRef.value) return;
    hFormRef.value.reset();
    await search();
    nextTick(() => {
        conditions.value.query.a = '';
        nextTick(() => {
            conditions.value.query.a = '999';
            console.log('reset', `a 重置后设置为\`${999}\`了`, conditions.value.query);
        });
    });
}

onMounted(search);
async function search() {
    if (!hFormRef.value) return;
    return hFormRef.value.search();
}
function clear() {
    conditions.value.query = {};
    conditions.value.condition = {};
}
</script>

<style lang="scss" scoped></style>
