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
import { getNode, hyphenate, noop, usePlain } from '@xiaohaih/json-form-core';
import { ElFormItem } from 'element-plus';
import { computed, defineComponent, markRaw, ref, watch } from 'vue';
import { pick } from '../../src/utils';
import { useFormItemProps } from '../use';
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
        const plain = usePlain(props);
        const { formItemActualProps } = useFormItemProps(props, ctx);
        const slotProps = computed(() => ({
            formItemProps: formItemActualProps.value,
            props,
            plain,
        }));
        const customRender = computed(() => {
            return typeof props.render === 'function'
                ? getNode(props.render(slotProps.value))
                : props.render;
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
