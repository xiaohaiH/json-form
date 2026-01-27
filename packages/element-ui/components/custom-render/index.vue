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
import { formItemPropKeys } from '../share';
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
        // 计算表单项静态属性
        const formItemStaticProps = computed(() => {
            const { formItemProps } = props;
            return { ...pick(props, formItemPropKeys), ...formItemProps };
        });

        // 计算表单项实际属性（合并静态和动态属性）
        const formItemActualProps = computed(() => {
            const { query, formItemDynamicProps } = props;
            return formItemDynamicProps ? { ...formItemStaticProps.value, ...formItemDynamicProps({ query }) } : formItemStaticProps.value;
        });

        // 使用核心平台提供的状态管理
        const plain = usePlain(props);

        // 准备传递给自定义渲染函数的参数
        const slotProps = {
            getFormItemProps: () => formItemActualProps.value,
            getProps: () => props,
            plain,
        };

        // 主动监听 checked 变量, 在发生改变后自动触发搜索事件(如果是实时搜索时), 便于外部开发
        // 不需要监听深层, 因为深层是引用类型
        watch(plain.checked, plain.change);
        // 调用自定义渲染函数获取渲染内容
        const customRender = getNode(props.render, slotProps);

        return {
            hyphenate,
            getNode,
            ...plain,
            trigger: noop,
            formItemStaticProps,
            formItemActualProps,
            slotProps,
            customRender,
        };
    },
});
</script>

<style lang="css" scoped></style>
