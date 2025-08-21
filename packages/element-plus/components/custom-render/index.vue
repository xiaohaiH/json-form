<template>
    <template v-if="renderFormItem">
        <ElFormItem
            v-if="!insetHide"
            :class="`json-form-item json-form-item--custom-render json-form-item--${field} json-form-item--${!!slots?.postfix}`"
            v-bind="formItemActualProps"
            :prop="formItemActualProps.prop || field"
        >
            <component :is="customRender" v-bind="slotProps" />
        </ElFormItem>
    </template>
    <template v-else>
        <component :is="customRender" v-bind="slotProps" />
    </template>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { ElFormItem } from 'element-plus';
import { computed, defineComponent, markRaw, ref, watch } from 'vue';
import { pick } from '../../src/utils';
import { formItemPropKeys } from '../share';
import { customRenderEmitsPrivate as emits, customRenderPropsPrivate as props } from './types';

/**
 * @file 自定义渲染
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
        const formItemStaticProps = computed(() => {
            const { formItemProps } = props;
            return { ...pick(props, formItemPropKeys), ...formItemProps };
        });
        const formItemActualProps = computed(() => {
            const { query, formItemDynamicProps } = props;
            return formItemDynamicProps ? { ...formItemStaticProps.value, ...formItemDynamicProps({ query }) } : formItemStaticProps.value;
        });
        const plain = usePlain(props);
        const slotProps = {
            getFormItemProps: () => formItemActualProps.value,
            getProps: () => props,
            plain,
        };
        // 主动监听 checked 变量, 在发生改变后自动触发搜索事件(如果是实时搜索时), 便于外部开发
        // 不需要监听深层, 因为深层是引用类型
        watch(plain.checked, plain.change);
        const customRender = getNode(props.render(slotProps));

        return {
            hyphenate,
            getNode,
            ...plain,
            formItemActualProps,
            slotProps,
            customRender,
        };
    },
});
</script>

<style lang="css" scoped></style>
