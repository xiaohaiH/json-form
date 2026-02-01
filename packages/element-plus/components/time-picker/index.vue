<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--time-picker json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <template v-if="slots?.before || ($slots as TimePickerSlots).before">
            <component :is="getNode(slots?.before || ($slots as TimePickerSlots).before)" v-bind="slotProps" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElTimePicker
                :model-value="(checked as string)"
                :value-format="valueFormat"
                class="json-form-item__content"
                v-bind="contentActualProps"
                :readonly="globalReadonly || contentActualProps.readonly"
                :disabled="globalDisabled || contentActualProps.disabled"
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
import { useCommonSetup } from '../use';
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
        const plain = usePlain(props);
        const { formItemActualProps, contentActualProps, slotProps } = useCommonSetup(props, ctx, plain);

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
