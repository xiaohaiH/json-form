<template>
    <ElFormItem
        v-if="!hide"
        :class="`json-form-item json-form-item--input json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemActualProps"
        :prop="prop || field"
    >
        <template v-if="slots?.before || ($slots as InputOtpSlots).before">
            <component :is="getNode(slots?.before || ($slots as InputOtpSlots).before)" v-bind="slotProps" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElInputOtp
                :model-value="(checked as string)"
                class="json-form-item__content"
                v-bind="contentActualProps"
                :readonly="globalReadonly || contentActualProps.readonly"
                :disabled="globalDisabled || contentActualProps.disabled"
                @update:model-value="change('update:modelValue', $event)" @change="change('change', $event)" @finish="change('finish', $event)"
            >
                <template v-for="(item, slotName) of itemSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                </template>
            </ElInputOtp>
        </slot>
        <template v-if="slots?.after || ($slots as InputOtpSlots).after">
            <component :is="getNode(slots?.after || ($slots as InputOtpSlots).after)" v-bind="slotProps" />
        </template>
        <div v-if="slots?.postfix || ($slots as InputOtpSlots).postfix" class="json-form-item__postfix">
            <component :is="getNode(slots?.postfix || ($slots as InputOtpSlots).postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { ElFormItem, ElInputOtp } from 'element-plus';
import type { SlotsType } from 'vue';
import { computed, defineComponent, ref, watch } from 'vue';
import { pick } from '../../src/utils';
import { useCommonSetup, useTempChecked } from '../use';
import type { InputOtpSlots } from './types';
import { inputOtpEmitsPrivate as emits, inputOtpPropsPrivate as props } from './types';

/**
 * @file 一次性密码输入框
 */
export default defineComponent({
    name: 'HInputOtp',
    components: {
        ElFormItem,
        ElInputOtp,
    },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<InputOtpSlots>,
    setup(props, ctx) {
        const plain = usePlain(props);
        const { formItemActualProps, contentActualProps, slotProps } = useCommonSetup(props, ctx, plain);

        /**
         * 值更改事件
         * @param {string} type 值更改的类型
         * @param {string} value 更改的值
         */
        function change(type: string, value: string) {
            type === props.valueTrigger && plain.change(value);
        }

        return {
            hyphenate,
            getNode,
            ...plain,
            formItemActualProps,
            contentActualProps,
            slotProps,
            change,
        };
    },
});
</script>

<style lang="css" scoped></style>
