<template>
    <VanField
        v-if="!hide"
        :name="field" :label="label"
        :model-value="(checked as string)"
        :disabled="globalDisabled || disabled"
        :readonly="globalReadonly || readonly"
        v-bind="$attrs"
    >
        <template #input>
            <VanRadioGroup
                :name="field" :model-value="checked"
                :disabled="globalDisabled || disabled || globalReadonly || readonly"
                v-bind="radioGroupProps" v-on="radioGroupOn"
                @update:model-value="change"
            >
                <template v-for="item of finalOption" :key="item[valueKey]">
                    <VanRadio :name="item[valueKey]" v-bind="radioProps" v-on="radioOn">
                        {{ item[labelKey] }}
                        <template v-for="(radioItem, slotName) of radioSlots" :key="slotName" #[hyphenate(slotName)]="row">
                            <component :is="getNode(radioItem)" v-bind="slotProps" :item="item" v-bind.prop="row" />
                        </template>
                    </VanRadio>
                </template>
            </VanRadioGroup>
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
import type { RadioGroupSlots } from './types';
import { radioGroupEmitsPrivate as emits, radioGroupPropsPrivate as props } from './types';

/**
 * @file 单选框组
 */
export default defineComponent({
    name: 'HRadioGroup',
    components: { VanField, VanRadio, VanRadioGroup },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<RadioGroupSlots>,
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
