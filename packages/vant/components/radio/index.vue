<template>
    <VanField
        v-if="!hide"
        :name="field" :label="label"
        :disabled="globalDisabled || disabled"
        :readonly="globalReadonly || readonly"
        v-bind="$attrs"
    >
        <template #input>
            <VanRadio
                :name="field" :model-value="checked"
                :disabled="globalDisabled || disabled || globalReadonly || readonly"
                v-bind="radioProps" v-on="radioOn"
                @update:model-value="change"
            >
                <template v-for="(item, slotName) of radioSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                </template>
            </VanRadio>
        </template>
        <template v-for="(item, slotName) of slots" :key="slotName" #[hyphenate(slotName)]="row">
            <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
        </template>
    </VanField>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { Field as VanField, Radio as VanRadio, RadioGroup as VanRadioGroup } from 'vant';
import type { SlotsType } from 'vue';
import { computed, defineComponent } from 'vue';
import { pick } from '../../src/utils';
import { useCommonSetup, useTempChecked } from '../use';
import type { RadioSlots } from './types';
import { radioEmitsPrivate as emits, radioPropsPrivate as props } from './types';

/**
 * @file 单选框
 */
export default defineComponent({
    name: 'HRadio',
    components: { VanField, VanRadio, VanRadioGroup },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<RadioSlots>,
    setup(props, ctx) {
        const plain = usePlain(props);
        const { slotProps } = useCommonSetup(props, ctx, plain);

        /** 重写 change 事件 */
        function change(value: string) {
            props.cancelable ? plain.change(plain.checked.value === value ? undefined : value) : plain.change(value);
        }

        return {
            hyphenate,
            getNode,
            ...plain,
            slotProps,
            change,
        };
    },
});
</script>

<style lang="scss" scoped>
</style>
