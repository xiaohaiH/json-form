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
                :disabled="globalReadonly || globalDisabled || contentActualProps.disabled"
                @update:model-value="(change as () => void)"
            >
                <template v-for="item of finalOption" :key="item[valueKey]">
                    <component
                        :is="radioType"
                        v-bind="itemProps"
                        :label="(item as any)[realLabelProp]"
                        :value="(item as any)[valueKey]"
                        :disabled="(item as any)[disabledKey]"
                        @[eventName].prevent="customChange((item as any)[valueKey], checked as string)"
                    >
                        {{ (item as any)[labelKey] }}
                        <template v-for="(option, slotName) of itemSlots" :key="slotName" #[hyphenate(slotName)]="row">
                            <component :is="getNode(option)" v-bind="slotProps" v-bind.prop="row" :option="item" :labelKey="realLabelProp" :valueKey="valueKey" :disabledKey="disabledKey" />
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
import { checkVersion, getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { ElFormItem, ElRadio, ElRadioButton, ElRadioGroup, version } from 'element-plus';
import type { SlotsType } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import { pick } from '../../src/utils';
import { useCommonSetup } from '../use';
import type { RadioGroupSlots } from './types';
import { radioGroupEmitsPrivate as emits, radioGroupPropsPrivate as props } from './types';

/** 小于 2.6 版本时, label 作为 value 使用 */
const VALUE_KEY = checkVersion(version, '2.6.0', '<') ? 'valueKey' : 'labelKey';

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
        const realLabelProp = computed(() => props[VALUE_KEY]);

        const plain = usePlain(props);
        const { formItemActualProps, contentActualProps, slotProps } = useCommonSetup(props, ctx, plain);

        /**
         * 单选框选中事件
         * @param {string} newVal 最新选中值
         * @param {string} currentVal 当前值
         */
        function customChange(newVal: string, currentVal: string) {
            plain.change(newVal === currentVal ? '' : newVal);
        }

        return {
            hyphenate,
            getNode,
            ...plain,
            formItemActualProps,
            contentActualProps,
            slotProps,
            radioType,
            eventName,
            realLabelProp,
            customChange,
        };
    },
});
</script>

<style lang="css" scoped></style>
