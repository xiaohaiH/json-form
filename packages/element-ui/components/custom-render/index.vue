<template>
    <!-- 自定义渲染组件 -->
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child -->

    <!-- 当需要包装在表单项中时渲染 -->
    <ElFormItem
        v-if="renderFormItem && !insetHide"
        :class="`json-form-item json-form-item--custom-render json-form-item--${field} json-form-item--${!!slots.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <!-- 渲染自定义内容 -->
        <component :is="customRender" v-bind="slotProps" />
    </ElFormItem>

    <!-- 当不需要包装在表单项中时直接渲染自定义内容 -->
    <component :is="customRender" v-else-if="!renderFormItem" v-bind="slotProps" />
</template>

<script lang="ts">
import { hyphenate, noop, usePlain } from '@xiaohaih/json-form-core';
import { FormItem as ElFormItem } from 'element-ui';
import { computed, defineComponent, markRaw, reactive, ref, watch } from 'vue-demi';
import { getNode, pick } from '../../src/utils';
import { useFormItemProps } from '../use';
import { customRenderEmitsPrivate as emits, customRenderPropsPrivate as props } from './types';

/**
 * @file 自定义渲染组件
 *
 * 提供灵活的自定义渲染能力，允许开发者完全控制内容的渲染
 * 可以选择是否包装在表单项容器中
 * 通过render函数接收完全自定义的内容
 */
export default defineComponent({
    name: 'HCustomRender',
    components: {
        ElFormItem,
    },
    inheritAttrs: false,
    props,
    emits,
    setup(props, ctx) {
        const plain = usePlain(props);
        const { formItemActualProps } = useFormItemProps(props, ctx);
        const slotProps = computed(() => ({
            formItemProps: formItemActualProps.value,
            props,
            plain,
        }));
        const customRender = computed(() => {
            return getNode(props.render, slotProps);
        });

        return {
            hyphenate,
            getNode,
            ...plain,
            formItemActualProps,
            slotProps,
            customRender,
            /** @deprecated 兼容低版本暴露给外部的函数 */
            trigger: noop,
        };
    },
});
</script>

<style lang="css" scoped></style>
