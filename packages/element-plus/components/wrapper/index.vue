<template>
    <ElForm v-bind="$attrs" ref="formRef" :disabled="disabled" :model="query">
        <slot name="prepend" v-bind="slotProps" />
        <template v-for="(item, key) of options" :key="key">
            <component :is="getComponent(item.t)!" v-if="item" v-bind="item" :field="item.as || key" :query="query" />
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
import { execOnCallback, useWrapper } from '@xiaohaih/json-form-core';
import { ElButton, ElForm } from 'element-plus';
import type { Ref, SlotsType } from 'vue';
import { computed, defineComponent, markRaw, nextTick, onMounted, ref, watch } from 'vue';
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
        // fix: 修复打包时ts7056类型报错(The inferred type of this node exceeds the maximum length the compiler will serialize. An explicit type annotation is needed)
        ElForm: ElForm as typeof ElForm,
        ElButton,
    },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<FormSlots<any>>,
    setup(props, { emit }) {
        const formRef = ref<InstanceType<typeof ElForm>>();
        const options = ref<any>();
        function setOption() {
            options.value = typeof props.datum === 'function' ? props.datum() : props.datum;
        }
        watch(() => props.datum, setOption, { immediate: true });

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
        /** 重置并搜索 */
        function resetAndSearch() {
            reset();
            wrapper.search();
        }
        function reset() {
            wrapper.reset();
            setTimeout(clearValidate);
        }

        const slotProps = { getProps: () => props, wrapper };

        onMounted(() => {
            props.onReady && execOnCallback(props.onReady, wrapper.getQuery());
            props.immediateSearch && props.onSearch && execOnCallback(props.onSearch, wrapper.getQuery());
        });

        return {
            ...wrapper,
            // fix: 修复打包时ts7056类型报错
            formRef: formRef as Ref<InstanceType<typeof ElForm>>,
            options,
            validate,
            validateField,
            clearValidate,
            scrollToField,
            getField,
            reset,
            getComponent,
            resetAndSearch,
            slotProps,
        };
    },
});
</script>

<style></style>
