<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--segmented json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <template v-if="slots?.before || ($slots as SegmentedSlots).before">
            <component :is="getNode(slots?.before || ($slots as SegmentedSlots).before)" v-bind="slotProps" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElSegmented
                :model-value="(checked as string)"
                :options="(finalOption as any[])"
                class="json-form-item__content"
                v-bind="contentActualProps"
                @update:model-value="change"
            >
                <template v-for="(item, slotName) of itemSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                </template>
            </ElSegmented>
        </slot>
        <template v-if="slots?.after || ($slots as SegmentedSlots).after">
            <component :is="getNode(slots?.after || ($slots as SegmentedSlots).after)" v-bind="slotProps" />
        </template>
        <div v-if="slots?.postfix || ($slots as SegmentedSlots).postfix" class="json-form-item__postfix">
            <component :is="getNode(slots?.postfix || ($slots as SegmentedSlots).postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { ElFormItem, ElSegmented } from 'element-plus';
import type { SlotsType } from 'vue';
import { computed, defineComponent, nextTick, ref } from 'vue';
import { pick } from '../../src/utils';
import { formItemPropKeys } from '../share';
import type { SegmentedSlots } from './types';
import { segmentedEmitsPrivate as emits, segmentedPropsPrivate as props } from './types';

/**
 * @file 分段控制器
 */
export default defineComponent({
    name: 'HSegmented',
    components: {
        ElFormItem,
        ElSegmented,
    },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<SegmentedSlots>,
    setup(props, ctx) {
        const formItemStaticProps = computed(() => {
            const { formItemProps } = props;
            return { ...pick(props, formItemPropKeys), ...formItemProps };
        });
        const formItemActualProps = computed(() => {
            const { query, formItemDynamicProps } = props;
            return formItemDynamicProps ? { ...formItemStaticProps.value, ...formItemDynamicProps({ query }) } : formItemStaticProps.value;
        });
        const contentStaticProps = computed(() => ({ ...ctx.attrs, ...props.staticProps }));
        const contentActualProps = computed(() => {
            const { query, dynamicProps } = props;
            return dynamicProps ? { ...contentStaticProps.value, ...dynamicProps({ query }) } : contentStaticProps.value;
        });
        const plain = usePlain(props);

        const slotProps = computed(() => ({
            getFormItemProps: () => formItemActualProps.value,
            getItemProps: () => contentActualProps.value,
            getProps: () => props,
            extraOptions: {
                modelValue: plain.checked.value,
                options: plain.finalOption.value,
                onChange: plain.change,
            },
            plain,
        }));

        return {
            hyphenate,
            getNode,
            ...plain,
            formItemActualProps,
            contentActualProps,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>
