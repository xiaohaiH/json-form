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
                v-bind="conditions.formOption"
                :key="conditions.formOption.key"
                class="flex flex-wrap items-start"
                :backfill="conditions.query"
                :datum="conditions.condition"
                :immediate-search="true"
                @ready="querySearch($event, 'ready')"
                @search="querySearch($event, 'search')"
            />
            <!-- @reset="reset($event)" -->
        </div>
    </ElCard>
</template>

<script lang="ts" setup>
import { HForm } from '@xiaohaih/json-form-plus';
import { conditionFactory } from '~share/condition';
import { ElMessage as toast } from 'element-plus';
import { nextTick, onMounted, ref } from 'vue';

/** @file 作为条件显示 */
defineOptions({
    name: 'Condition',
});

const conditions = ref(conditionFactory());
/** 搜索 */
function querySearch(query: Record<string, string>, source?: string) {
    conditions.value.query = query;
    console.log(`${source}-搜索事件: `, { ...query }, '\n句柄: ', conditions.value);
}
/** 重置 */
function reset(query: Record<string, any>) {
    // query.a = '999';
    // console.log('reset', `a 重置后设置为\`${999}\`了`, query);
    // return;
    conditions.value.query.a = '';
    nextTick(() => {
        conditions.value.query.a = '999';
        console.log('reset', `a 重置后设置为\`${999}\`了`, conditions.value.query);
    });
}

function clear() {
    conditions.value.query = {};
    // @ts-expect-error 允许重置为空对象
    conditions.value.condition = {};
}
</script>

<style lang="scss" scoped></style>
