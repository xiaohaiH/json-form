<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child -->
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--rate json-form-item--${field} json-form-item--${!!slots.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <template v-if="slots.before || $slots.before">
            <component :is="getNode(slots.before || $slots.before, slotProps)" />
        </template>
        <template v-if="slots.default">
            <component :is="getNode(slots.default, slotProps)" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElRate
                :value="checked" class="json-form-item__content" v-bind="contentActualProps"
                :disabled="globalReadonly || globalDisabled || contentActualProps.disabled"
                v-on="$listeners" @input="change"
            />
        </slot>
        <template v-if="slots.after || $slots.after">
            <component :is="getNode(slots.after || $slots.after, slotProps)" />
        </template>
        <div v-if="slots.postfix || $slots.postfix" class="json-form-item__postfix">
            <component :is="getNode(slots.postfix || $slots.postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { FormItem as ElFormItem, Rate as ElRate } from 'element-ui';
import { computed, defineComponent, ref } from 'vue-demi';
import { getNode, pick } from '../../src/utils';
import { formItemPropKeys } from '../share';
import type { RateSlots } from './types';
import { rateEmitsPrivate as emits, ratePropsPrivate as props } from './types';

// @ts-expect-error UI.props报错
const contentPropsKeys = Object.keys(ElRate.props);

/**
 * @file 评分
 */
export default defineComponent({
    name: 'HRate',
    components: {
        ElFormItem,
        ElRate,
    },
    inheritAttrs: false,
    props,
    emits,
    // slots: Object as SlotsType<RateSlots>,
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
                value: plain.checked.value,
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
