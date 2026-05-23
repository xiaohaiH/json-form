<template>
    <HGroup v-bind="$attrs" ref="groupRef" :disabled="disabled" :config="config" :model="query" :query="query" :get-form-ref="getFormRef" :tag="VanForm" v-on="events" @submit="submitHandle">
        <template v-if="$slots.prepend" #prepend>
            <slot name="prepend" v-bind="slotProps" />
        </template>
        <template #append>
            <slot v-bind="slotProps" />
        </template>
    </HGroup>
</template>

<script lang="ts">
import { execOnCallback, useWrapper } from '@xiaohaih/json-form-core';
import type { FormInstance } from 'vant';
import { Form as VanForm } from 'vant';
import type { Ref, SlotsType } from 'vue';
import { computed, defineComponent, Fragment, markRaw, nextTick, onMounted, ref, watch } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import { pick } from '../../src/utils';
import { HGroup } from '../group/index';
import type { FormSlots } from './types';
import { formEmitsPrivate as emits, formPropsPrivate as props } from './types';

/**
 * @file 容器
 */
export default defineComponent({
    name: 'HForm',
    components: {
        HGroup,
    },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<FormSlots<any, any>>,
    setup(props, ctx) {
        const groupRef = ref<ComponentExposed<typeof HGroup>>();
        const formRef = computed(() => groupRef.value?.tagRef as FormInstance | undefined);
        // @ts-expect-error 兼容 vue2.x
        const events = computed(() => ctx.listeners || {});

        /** 覆盖 van-form 的 submit 事件 */
        function submitHandle(params: Record<any, string>) {
            ctx.emit('submit', wrapper.getQuery());
        }

        /** 验证 vant 的表单 */
        function validate(...args: Parameters<FormInstance['validate']>) {
            return formRef.value!.validate(...args);
        }
        /** 验证 vant 的表单字段 */
        function validateField(...args: Parameters<FormInstance['validate']>) {
            return formRef.value!.validate(...args);
        }
        /** 清除 vant 的表单验证 */
        function clearValidate(...args: Parameters<FormInstance['resetValidation']>) {
            return formRef.value!.resetValidation(...args);
        }
        /** 重置 vant 的表单验证 */
        function resetValidation(...args: Parameters<FormInstance['resetValidation']>) {
            return formRef.value!.resetValidation(...args);
        }
        /** 获取所有表单项当前的值 */
        function getValues(...args: Parameters<FormInstance['getValues']>) {
            return formRef.value!.getValues(...args);
        }
        /** 获取所有表单项的校验状态 */
        function getValidationStatus(...args: Parameters<FormInstance['getValidationStatus']>) {
            return formRef.value!.getValidationStatus(...args);
        }
        /** 滚动到指定表单字段 */
        function scrollToField(...args: Parameters<FormInstance['scrollToField']>) {
            return formRef.value!.scrollToField(...args);
        }
        /** 获取表单实例 */
        function getFormRef() {
            return formRef.value;
        }
        const wrapper = useWrapper(props, {
            formRef,
        });
        /** 触发提交事件 */
        function submit() {
            formRef.value?.submit();
        }
        /** 重置 */
        function reset() {
            wrapper.reset();
            setTimeout(clearValidate);
        }

        const slotProps = computed(() => ({ props, wrapper }));

        return {
            groupRef,
            VanForm: markRaw(VanForm),
            formRef: formRef as Ref<ComponentExposed<typeof VanForm>>,
            events,
            submitHandle,
            ...wrapper,
            validate,
            validateField,
            clearValidate,
            resetValidation,
            submit,
            reset,
            getValues,
            getValidationStatus,
            scrollToField,
            getFormRef,
            slotProps,
        };
    },
});
</script>

<style></style>
