<template>
    <VanField
        v-if="!hide"
        :name="field"
        :disabled="globalDisabled || disabled"
        :readonly="globalReadonly || readonly"
        v-bind="$attrs"
    >
        <template #input>
            <VanSwitch
                :disabled="globalDisabled || disabled || globalReadonly || readonly"
                :model-value="checked"
                v-bind="switchProps" v-on="switchOn"
                @update:model-value="change"
            >
                <template v-for="(item, slotName) of switchSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                </template>
            </VanSwitch>
        </template>
        <template v-for="(item, slotName) of slots" :key="slotName" #[hyphenate(slotName)]="row">
            <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
        </template>
    </VanField>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { Field as VanField, Switch as VanSwitch } from 'vant';
import type { SlotsType } from 'vue';
import { defineComponent } from 'vue';
import { useCommonSetup } from '../use';
import type { SwitchSlots } from './types';
import { switchEmitsPrivate as emits, switchPropsPrivate as props } from './types';

/**
 * @file 开关
 */
export default defineComponent({
    name: 'HSwitch',
    components: { VanField, VanSwitch },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<SwitchSlots>,
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
