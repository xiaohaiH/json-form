<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child -->
    <!-- 表单容器组件，绑定属性和事件监听 -->
    <HGroup v-bind="$attrs" ref="groupRef" :disabled="disabled" :config="config || datum" :model="query" :query="query" :get-form-ref="getFormRef" :tag="ElForm" v-on="$listeners">
        <template v-if="$slots.prepend" #prepend>
            <slot name="prepend" v-bind="slotProps" />
        </template>
        <template #append>
            <slot v-bind="slotProps" />
            <!-- <slot name="btn" :search="search" :reset="reset" :resetAndSearch="resetAndSearch">
                <template v-if="renderBtn">
                    <ElButton :size="$attrs.size" @click="search">
                        {{ searchText }}
                    </ElButton>
                    <ElButton :size="$attrs.size" @click="triggerSearchAtReset ? resetAndSearch() : reset()">
                        {{ resetText }}
                    </ElButton>
                </template>
            </slot> -->
        </template>
    </HGroup>
</template>

<script lang="ts">
import { execOnCallback, useWrapper } from '@xiaohaih/json-form-core';
import { Button as ElButton, Form as ElForm } from 'element-ui';
import type { ComponentExposed } from 'vue-component-type-helpers';
import { computed, defineComponent, markRaw, nextTick, onMounted, ref, watch } from 'vue-demi';
import { getNode, pick } from '../../src/utils';
import { HGroup } from '../components';
import type { FormSlots } from './types';
import { formEmitsPrivate as emits, formPropsPrivate as props } from './types';

/**
 * 表单容器组件
 * 用于包装和管理表单项的主组件，提供表单验证、搜索、重置等功能
 */
export default defineComponent({
    name: 'HForm',
    components: {
        HGroup,
    },
    inheritAttrs: false,
    props,
    emits,
    // slots: Object as SlotsType<FormSlots<any, any, any, any>>,
    setup(props, { emit, listeners }) {
        const groupRef = ref<ComponentExposed<typeof HGroup>>();
        // 表单引用
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

        // 使用核心库提供的wrapper钩子
        const wrapper = useWrapper(props, {
            // modelField: 'model',
            onBackfillChange(...args) {
                listeners.backfillChange && execOnCallback(listeners.backfillChange as any, ...args);
                props.onBackfillChange && execOnCallback(props.onBackfillChange, ...args);
            },
            onSearch(...args) {
                listeners.search && execOnCallback(listeners.search as any, ...args);
                props.onSearch && execOnCallback(props.onSearch, ...args);
            },
        });

        /** 重置 */
        function reset() {
            wrapper.reset();
            setTimeout(clearValidate);
        }

        /** 获取表单实例 */
        function getFormRef() {
            return formRef.value;
        }
        // 插槽属性，提供给子组件访问props和wrapper实例
        const slotProps = computed(() => ({ props, wrapper }));

        return {
            groupRef,
            ElForm: markRaw(ElForm) as any,
            formRef,
            ...wrapper,
            validate,
            validateField,
            clearValidate,
            reset,
            getFormRef,
            slotProps,
        };
    },
});
</script>

<style></style>
