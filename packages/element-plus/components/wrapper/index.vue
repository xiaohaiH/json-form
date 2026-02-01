<template>
    <HGroup v-bind="$attrs" ref="groupRef" :disabled="disabled" :config="config || datum" :model="query" :query="query" :get-form-ref="getFormRef" :tag="ElForm">
        <template v-if="$slots.prepend" #prepend>
            <slot name="prepend" v-bind="slotProps" />
        </template>
        <template #append>
            <slot v-bind="slotProps" />
            <!-- <slot name="btn" :search="search" :reset="reset" :resetAndSearch="resetAndSearch">
                <template v-if="renderBtn">
                    <ElButton @click="search">
                        {{ searchText }}
                    </ElButton>
                    <ElButton @click="triggerSearchAtReset ? resetAndSearch() : reset()">
                        {{ resetText }}
                    </ElButton>
                </template>
            </slot> -->
        </template>
    </HGroup>
</template>

<script lang="ts">
import { execOnCallback, useWrapper } from '@xiaohaih/json-form-core';
import { ElButton, ElForm } from 'element-plus';
import type { Ref, SlotsType } from 'vue';
import { computed, defineComponent, Fragment, markRaw, nextTick, onMounted, ref, watch } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import { pick } from '../../src/utils';
import { HGroup } from '../components';
import type { FormSlots } from './types';
import { formEmitsPrivate as emits, formPropsPrivate as props } from './types';

/**
 * @file 容器
 */
export default defineComponent({
    name: 'HForm',
    components: {
        // fix: 修复打包时ts7056类型报错(The inferred type of this node exceeds the maximum length the compiler will serialize. An explicit type annotation is needed)
        // ElForm: ElForm as typeof ElForm,
        HGroup,
    },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<FormSlots<any>>,
    setup(props, { emit }) {
        const groupRef = ref<ComponentExposed<typeof HGroup>>();
        const formRef = computed(() => groupRef.value?.tagRef as ComponentExposed<typeof ElForm> | undefined);

        /** 验证 element-plus 的表单 */
        function validate(...args: Parameters<InstanceType<typeof ElForm>['validate']>) {
            return formRef.value!.validate(...args);
        }
        /** 验证 element-plus 的表单字段 */
        function validateField(...args: Parameters<InstanceType<typeof ElForm>['validateField']>) {
            return formRef.value!.validateField(...args);
        }
        /** 清除 element-plus 的表单验证 */
        function clearValidate(...args: Parameters<InstanceType<typeof ElForm>['clearValidate']>) {
            return formRef.value!.clearValidate(...args);
        }
        /** 滚动到指定的字段 */
        function scrollToField(...args: Parameters<InstanceType<typeof ElForm>['scrollToField']>) {
            return formRef.value!.scrollToField(...args);
        }
        /** 获取字段的 context */
        function getField(...args: Parameters<InstanceType<typeof ElForm>['getField']>) {
            return formRef.value!.getField(...args);
        }
        const wrapper = useWrapper(props);
        /** 重置 */
        function reset() {
            wrapper.reset();
            setTimeout(clearValidate);
        }

        /** 获取表单实例 */
        function getFormRef() {
            return formRef.value;
        }
        const slotProps = computed(() => ({ props, wrapper }));

        return {
            groupRef,
            ElForm: markRaw(ElForm),
            // fix: 修复打包时ts7056类型报错
            formRef: formRef as Ref<ComponentExposed<typeof ElForm>>,
            ...wrapper,
            validate,
            validateField,
            clearValidate,
            scrollToField,
            getField,
            reset,
            getFormRef,
            slotProps,
        };
    },
});
</script>

<style></style>
