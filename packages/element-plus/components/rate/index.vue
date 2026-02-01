<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--rate json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <template v-if="slots?.before || ($slots as RateSlots).before">
            <component :is="getNode(slots?.before || ($slots as RateSlots).before)" v-bind="slotProps" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElRate
                :model-value="(checked as number)"
                class="json-form-item__content"
                v-bind="contentActualProps"
                :disabled="globalReadonly || globalDisabled || contentActualProps.disabled"
                @change="change"
            >
                <template v-for="(item, slotName) of itemSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                </template>
            </ElRate>
        </slot>
        <template v-if="slots?.after || ($slots as RateSlots).after">
            <component :is="getNode(slots?.after || ($slots as RateSlots).after)" v-bind="slotProps" />
        </template>
        <div v-if="slots?.postfix || ($slots as RateSlots).postfix" class="json-form-item__postfix">
            <component :is="getNode(slots?.postfix || ($slots as RateSlots).postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { ElFormItem, ElRate } from 'element-plus';
import type { SlotsType } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import { pick } from '../../src/utils';
import { useCommonSetup } from '../use';
import type { RateSlots } from './types';
import { rateEmitsPrivate as emits, ratePropsPrivate as props } from './types';

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
    slots: Object as SlotsType<RateSlots>,
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
