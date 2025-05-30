<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child -->
    <!-- 表单容器组件，绑定属性和事件监听 -->
    <ElForm v-bind="$attrs" ref="formRef" :model="query" v-on="$listeners">
        <!-- 前置插槽 -->
        <slot name="prepend" v-bind="slotProps" />
        <!-- 循环渲染表单项组件 -->
        <template v-for="(item, key) of options">
            <component :is="getComponent(item.t)" v-if="item" :key="key" v-bind="item" :field="item.as || key" :query="query" />
        </template>
        <!-- 默认插槽 -->
        <slot v-bind="slotProps" />
        <!-- 按钮插槽，提供搜索、重置等方法 -->
        <slot name="btn" :search="search" :reset="reset" :resetAndSearch="resetAndSearch">
            <template v-if="renderBtn">
                <ElButton :size="$attrs.size" @click="search">
                    {{ searchText }}
                </ElButton>
                <ElButton :size="$attrs.size" @click="triggerSearchAtReset ? resetAndSearch() : reset()">
                    {{ resetText }}
                </ElButton>
            </template>
        </slot>
    </ElForm>
</template>

<script lang="ts">
import { useWrapper } from '@xiaohaih/json-form-core';
import { Button as ElButton, Form as ElForm } from 'element-ui';
import { computed, defineComponent, markRaw, nextTick, onMounted, ref, watch } from 'vue-demi';
import { getNode, pick } from '../../src/utils';
import { getComponent } from './component-assist';
import type { FormSlots } from './types';
import { formEmitsPrivate as emits, formPropsPrivate as props } from './types';
// import { SortComponent } from './sortable';

/**
 * 表单容器组件
 * 用于包装和管理表单项的主组件，提供表单验证、搜索、重置等功能
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
    // slots: Object as SlotsType<FormSlots<any, any, any, any>>,
    setup(props, { emit }) {
        // 表单引用
        const formRef = ref<InstanceType<typeof ElForm>>();
        /** 格式化表单配置项(防止 template 中报错, 直接设置为 Record<string, any>) */
        const options = ref<Record<string, any>>(setOption());
        function setOption() {
            return typeof props.datum === 'function' ? props.datum() : props.datum;
        }
        watch(props.datum, setOption);

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

        // 绑定事件处理函数
        const emitSearch = (emit as any).bind(null, 'search') as unknown as (typeof emits)['search'];
        const emitReset = (emit as any).bind(null, 'reset') as unknown as (typeof emits)['reset'];
        const emitFieldChange = (emit as any).bind(null, 'fieldChange') as unknown as (typeof emits)['fieldChange'];

        // 使用核心库提供的wrapper钩子
        const wrapper = useWrapper(props, { search: emitSearch, reset: emitReset, fieldChange: emitFieldChange });

        /**
         * 重置并搜索
         * 先重置表单，然后执行搜索操作
         */
        function resetAndSearch() {
            reset();
            wrapper.search();
        }
        function reset() {
            wrapper.reset();
            setTimeout(clearValidate);
        }

        // 插槽属性，提供给子组件访问props和wrapper实例
        const slotProps = { getProps: () => props, wrapper };

        // 组件挂载后触发ready事件，并根据配置执行立即搜索
        onMounted(() => {
            emit('ready', wrapper.getQuery());
            props.immediateSearch && emitSearch(wrapper.getQuery());
        });

        return {
            ...wrapper,
            formRef,
            options,
            validate,
            validateField,
            clearValidate,
            reset,
            getComponent,
            resetAndSearch,
            slotProps,
        };
    },
});
</script>

<style></style>
