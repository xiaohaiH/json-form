<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--radio-group json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <template v-if="slots?.before || ($slots as RadioGroupSlots).before">
            <component :is="getNode(slots?.before || ($slots as RadioGroupSlots).before)" v-bind="slotProps" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElRadioGroup
                :model-value="(checked as any)"
                class="json-form-item__content"
                v-bind="contentActualProps"
                @update:model-value="(change as () => void)"
            >
                <template v-for="item of finalOption" :key="item[valueKey]">
                    <component
                        :is="radioType"
                        v-bind="itemProps"
                        :label="(item as any)[labelKey]"
                        :value="(item as any)[valueKey]"
                        :disabled="(item as any)[disabledKey]"
                        @[eventName].prevent="customChange((item as any)[valueKey], checked as string)"
                    >
                        <template v-for="(option, slotName) of itemSlots" :key="slotName" #[hyphenate(slotName)]="row">
                            <component :is="getNode(option)" v-bind="slotProps" v-bind.prop="row" :option="item" :labelKey="labelKey" :valueKey="valueKey" :disabledKey="disabledKey" />
                        </template>
                    </component>
                </template>
            </ElRadioGroup>
        </slot>
        <template v-if="slots?.after || ($slots as RadioGroupSlots).after">
            <component :is="getNode(slots?.after || ($slots as RadioGroupSlots).after)" v-bind="slotProps" />
        </template>
        <div v-if="slots?.postfix || ($slots as RadioGroupSlots).postfix" class="json-form-item__postfix">
            <component :is="getNode(slots?.postfix || ($slots as RadioGroupSlots).postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { ElFormItem, ElRadio, ElRadioButton, ElRadioGroup } from 'element-plus';
import type { SlotsType } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import { pick } from '../../src/utils';
import { formItemPropKeys } from '../share';
import type { RadioGroupSlots } from './types';
import { radioGroupEmitsPrivate as emits, radioGroupPropsPrivate as props } from './types';

/**
 * @file 单选框组
 */
export default defineComponent({
    name: 'HRadioGroup',
    components: {
        ElFormItem,
        ElRadioGroup,
        ElRadioButton,
        ElRadio,
    },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<RadioGroupSlots>,
    setup(props, ctx) {
        const radioType = computed(() => (props.type === 'button' ? 'ElRadioButton' : 'ElRadio'));
        const eventName = computed(() => (props.cancelable ? 'click' : null));

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

        /**
         * 单选框选中事件
         * @param {string} newVal 最新选中值
         * @param {string} currentVal 当前值
         */
        function customChange(newVal: string, currentVal: string) {
            plain.change(newVal === currentVal ? '' : newVal);
        }
        const slotProps = computed(() => ({
            getFormItemProps: () => formItemActualProps.value,
            getItemProps: () => contentActualProps.value,
            getProps: () => props,
            options: plain.finalOption.value,
            modelValue: plain.checked.value,
            onChange: plain.change,
            onCancelable: customChange,
            radioType: radioType.value,
            class: 'json-form-item__content',
            plain,
        }));

        return {
            hyphenate,
            getNode,
            ...plain,
            formItemActualProps,
            contentActualProps,
            radioType,
            eventName,
            customChange,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>
