<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--time-picker json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemStaticProps"
        :prop="formItemStaticProps.prop || field"
        v-bind.prop="formItemFinalDynamicProps"
    >
        <template v-if="slots?.before || ($slots as TimePickerSlots).before">
            <component :is="getNode(slots?.before || ($slots as TimePickerSlots).before)" v-bind="slotProps" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElTimePicker
                v-bind="contentStaticProps"
                :model-value="checked as string"
                :value-format="valueFormat"
                class="json-form-item__content"
                v-bind.prop="contentDynamicProps"
                @update:model-value="change"
            >
                <template v-for="(item, slotName) of itemSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                </template>
            </ElTimePicker>
        </slot>
        <template v-if="slots?.after || ($slots as TimePickerSlots).after">
            <component :is="getNode(slots?.after || ($slots as TimePickerSlots).after)" v-bind="slotProps" />
        </template>
        <div v-if="slots?.postfix || ($slots as TimePickerSlots).postfix" class="json-form-item__postfix">
            <component :is="getNode(slots?.postfix || ($slots as TimePickerSlots).postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { ElFormItem, ElTimePicker } from 'element-plus';
import type { SlotsType } from 'vue';
import { computed, defineComponent, reactive, toRefs } from 'vue';
import { pick } from '../../src/utils';
import { formItemPropKeys } from '../share';
import type { TimePickerSlots } from './types';
import { timePickerEmitsPrivate as emits, timePickerPropsPrivate as props } from './types';

/**
 * @file 时间选择器
 */
export default defineComponent({
    name: 'HTimePicker',
    components: {
        ElFormItem,
        ElTimePicker,
    },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<TimePickerSlots>,
    setup(props, ctx) {
        const formItemStaticProps = computed(() => {
            const { formItemProps } = props;
            return { ...pick(props, formItemPropKeys), ...formItemProps };
        });
        const formItemFinalDynamicProps = computed(() => {
            const { query, formItemDynamicProps } = props;
            return formItemDynamicProps ? formItemDynamicProps({ query }) : undefined;
        });
        const contentStaticProps = computed(() => ({ ...ctx.attrs, ...props.staticProps }));
        const contentDynamicProps = computed(() => {
            const { query, dynamicProps } = props;
            return dynamicProps ? dynamicProps({ query }) : undefined;
        });
        const plain = usePlain(props);
        const slotProps = computed(() => ({
            getFormItemProps: () => ({ ...formItemStaticProps.value, ...formItemFinalDynamicProps.value }),
            getItemProps: () => ({ ...contentStaticProps.value, ...contentDynamicProps.value }),
            getProps: () => props,
            options: plain.finalOption.value,
            modelValue: plain.checked.value,
            onChange: plain.change,
            class: 'json-form-item__content',
            plain,
        }));

        return {
            hyphenate,
            ...plain,
            formItemStaticProps,
            formItemFinalDynamicProps,
            contentStaticProps,
            contentDynamicProps,
            getNode,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>
