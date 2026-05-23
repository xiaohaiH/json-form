<template>
    <VanField
        v-if="!hide"
        :name="field"
        :model-value="(checked as number)"
        :disabled="globalDisabled || disabled"
        :readonly="globalReadonly || readonly"
        v-bind="$attrs"
    >
        <template #input>
            <VanSlider
                :disabled="globalDisabled || disabled"
                :readonly="globalReadonly || readonly"
                :model-value="(checked as number)"
                v-bind="sliderProps" v-on="sliderOn"
                @update:model-value="change"
            >
                <template v-for="(item, slotName) of sliderSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                </template>
            </VanSlider>
        </template>
        <template v-for="(item, slotName) of slots" :key="slotName" #[hyphenate(slotName)]="row">
            <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
        </template>
    </VanField>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { Field as VanField, Slider as VanSlider } from 'vant';
import type { SlotsType } from 'vue';
import { defineComponent } from 'vue';
import { useCommonSetup } from '../use';
import type { SliderSlots } from './types';
import { sliderEmitsPrivate as emits, sliderPropsPrivate as props } from './types';

/**
 * @file 滑块
 */
export default defineComponent({
    name: 'HSlider',
    components: { VanField, VanSlider },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<SliderSlots>,
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
