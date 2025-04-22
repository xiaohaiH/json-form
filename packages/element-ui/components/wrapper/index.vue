<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child -->
    <!-- 表单容器组件，绑定属性和事件监听 -->
    <ElForm v-bind="$attrs" ref="formRef" :model="query" v-on="$listeners">
        <!-- 前置插槽 -->
        <slot name="prepend" v-bind="slotProps" />
        <!-- 循环渲染表单项组件 -->
        <template v-for="(item, key) of datum">
            <component :is="getComponent(item.t)" :key="key" v-bind="item" :field="item.as || key" :query="query" />
        </template>
        <!-- 默认插槽 -->
        <slot v-bind="slotProps" />
        <!-- 按钮插槽，提供搜索、重置等方法 -->
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
import { Button as ElButton, Form as ElForm } from 'element-ui';
import { computed, defineComponent, markRaw, onMounted, ref, version } from 'vue-demi';
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

        /**
         * 验证表单
         * 调用Element UI表单的validate方法验证整个表单
         */
        function validate(...args: Parameters<InstanceType<typeof ElForm>['validate']>) {
            return formRef.value!.validate(...args);
        }

        /**
         * 验证表单字段
         * 调用Element UI表单的validateField方法验证特定字段
         */
        function validateField(...args: Parameters<InstanceType<typeof ElForm>['validateField']>) {
            return formRef.value!.validateField(...args);
        }

        /**
         * 清除验证
         * 调用Element UI表单的clearValidate方法清除表单验证结果
         */
        function clearValidate(...args: Parameters<InstanceType<typeof ElForm>['clearValidate']>) {
            return formRef.value!.clearValidate(...args);
        }

        // 绑定事件处理函数
        const search = (emit as any).bind(null, 'search') as unknown as (typeof emits)['search'];
        const reset = (emit as any).bind(null, 'reset') as unknown as (typeof emits)['reset'];
        const fieldChange = (emit as any).bind(null, 'fieldChange') as unknown as (typeof emits)['fieldChange'];

        // 使用核心库提供的wrapper钩子
        const wrapper = useWrapper(props, { search, reset, fieldChange });

        /**
         * 重置并搜索
         * 先重置表单，然后执行搜索操作
         */
        function resetAndSearch() {
            wrapper.reset();
            wrapper.search();
        }

        // 插槽属性，提供给子组件访问props和wrapper实例
        const slotProps = { getProps: () => props, wrapper };

        // 组件挂载后触发ready事件，并根据配置执行立即搜索
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
