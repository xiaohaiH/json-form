<template>
    <template v-if="renderFormItem">
        <ElFormItem
            v-if="!insetHide"
            :class="`json-form-item json-form-item--custom-render json-form-item--${field} json-form-item--${!!slots?.postfix}`"
            v-bind="formItemStaticProps"
            :prop="formItemStaticProps.prop || field"
            v-bind.prop="formItemFinalDynamicProps"
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
import { computed, defineComponent, markRaw, ref } from 'vue';
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
        const formItemFinalDynamicProps = computed(() => {
            const { query, formItemDynamicProps } = props;
            return formItemDynamicProps ? formItemDynamicProps({ query }) : undefined;
        });
        const plain = usePlain(props);
        const slotProps = computed(() => ({
            getFormItemProps: () => ({ ...formItemStaticProps.value, ...formItemFinalDynamicProps.value }),
            getProps: () => props,
            class: 'json-form-item__content',
            plain,
        }));
        const customRender = getNode(props.render);

        return {
            hyphenate,
            getNode,
            ...plain,
            formItemStaticProps,
            formItemFinalDynamicProps,
            slotProps,
            customRender,
        };
    },
});
</script>

<style lang="css" scoped></style>
