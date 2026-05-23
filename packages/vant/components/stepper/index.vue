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
            <VanStepper
                :disabled="globalDisabled || disabled || globalReadonly || readonly"
                :model-value="(checked as number)"
                v-bind="stepperProps" v-on="stepperOn"
                @update:model-value="change"
            >
                <template v-for="(item, slotName) of stepperSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                </template>
            </VanStepper>
        </template>
        <template v-for="(item, slotName) of slots" :key="slotName" #[hyphenate(slotName)]="row">
            <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
        </template>
    </VanField>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { Field as VanField, Stepper as VanStepper } from 'vant';
import type { SlotsType } from 'vue';
import { defineComponent } from 'vue';
import { useCommonSetup } from '../use';
import type { StepperSlots } from './types';
import { stepperEmitsPrivate as emits, stepperPropsPrivate as props } from './types';

/**
 * @file 步进器
 */
export default defineComponent({
    name: 'HStepper',
    components: { VanField, VanStepper },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<StepperSlots>,
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
