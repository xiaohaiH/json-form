<template>
    <VanField
        v-if="!hide"
        :name="field"
        :model-value="checked"
        :disabled="globalDisabled || disabled"
        :readonly="globalReadonly || readonly"
        v-bind="$attrs"
    >
        <template #input>
            <VanRate
                :disabled="globalDisabled || disabled"
                :readonly="globalReadonly || readonly"
                :model-value="(checked as number)"
                v-bind="rateProps" v-on="rateOn"
                @update:model-value="change"
            >
                <template v-for="(item, slotName) of rateSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                </template>
            </VanRate>
        </template>
        <template v-for="(item, slotName) of slots" :key="slotName" #[hyphenate(slotName)]="row">
            <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
        </template>
    </VanField>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { Field as VanField, Rate as VanRate } from 'vant';
import type { SlotsType } from 'vue';
import { defineComponent } from 'vue';
import { useCommonSetup } from '../use';
import type { RateSlots } from './types';
import { rateEmitsPrivate as emits, ratePropsPrivate as props } from './types';

/**
 * @file 评分
 */
export default defineComponent({
    name: 'HRate',
    components: { VanField, VanRate },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<RateSlots>,
    setup(props, ctx) {
        const plain = usePlain(props);
        const { slotProps } = useCommonSetup(props, ctx, plain);

        return {
            hyphenate,
            getNode,
            ...plain,
            slotProps,
        };
    },
});
</script>

<style lang="scss" scoped>
</style>
