<template>
    <ElForm v-bind="$attrs" ref="formRef" :model="query">
        <slot name="prepend" v-bind="slotProps" />
        <template v-for="(item, key) of datum" :key="key">
            <component :is="getComponent(item.t)!" v-bind="item" :field="item.as || key" :query="query" />
        </template>
        <slot v-bind="slotProps" />
        <slot name="btn" :search="search" :reset="reset" :resetAndSearch="resetAndSearch">
            <template v-if="renderBtn">
                <ElButton @click="search">
                    {{ searchText }}
                </ElButton>
                <ElButton @click="triggerSearchAtReset ? resetAndSearch() : reset()">
                    {{ resetText }}
                </ElButton>
            </template>
        </slot>
    </ElForm>
</template>

<script lang="ts">
import { useWrapper } from '@xiaohaih/json-form-core';
import { ElButton, ElForm } from 'element-plus';
import type { SlotsType } from 'vue';
import { computed, defineComponent, markRaw, onMounted, ref } from 'vue';
import { pick } from '../../src/utils';
import { getComponent } from './component-assist';
import type { FormSlots } from './types';
import { formEmitsPrivate as emits, formPropsPrivate as props } from './types';
// import { SortComponent } from './sortable';

/**
 * @file 容器
 */
export default defineComponent({
    name: 'HForm',
    components: {
        // SortComponent,
        ElForm,
        ElButton,
    },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<FormSlots<any, any, any, any>>,
    setup(props, { emit }) {
        const formRef = ref<InstanceType<typeof ElForm>>();
        function validate(...args: Parameters<InstanceType<typeof ElForm>['validate']>) {
            return formRef.value!.validate(...args);
        }
        function validateField(...args: Parameters<InstanceType<typeof ElForm>['validateField']>) {
            return formRef.value!.validateField(...args);
        }
        function clearValidate(...args: Parameters<InstanceType<typeof ElForm>['clearValidate']>) {
            return formRef.value!.clearValidate(...args);
        }
        const search = (emit as any).bind(null, 'search') as unknown as (typeof emits)['search'];
        const reset = (emit as any).bind(null, 'reset') as unknown as (typeof emits)['reset'];
        const fieldChange = (emit as any).bind(null, 'fieldChange') as unknown as (typeof emits)['fieldChange'];
        const wrapper = useWrapper(props, { search, reset, fieldChange });
        function resetAndSearch() {
            wrapper.reset();
            wrapper.search();
        }

        const slotProps = { getProps: () => props, wrapper };

        onMounted(() => {
            emit('ready', wrapper.getQuery());
            props.immediateSearch && search(wrapper.getQuery());
        });

        return {
            ...wrapper,
            formRef,
            validate,
            validateField,
            clearValidate,
            getComponent,
            resetAndSearch,
            slotProps,
        };
    },
});
</script>

<style></style>
