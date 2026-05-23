<template>
    <VanField
        v-if="!hide"
        :name="field" :label="label"
        :disabled="globalDisabled || disabled"
        :readonly="globalReadonly || readonly"
        v-bind="$attrs"
    >
        <template #input>
            <VanCheckbox
                :name="field" :model-value="checked"
                :disabled="globalDisabled || disabled || globalReadonly || readonly"
                v-bind="checkboxProps" v-on="checkboxOn"
                @update:model-value="change"
            >
                <template v-for="(item, slotName) of checkboxSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                </template>
            </VanCheckbox>
        </template>
    </VanField>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { Checkbox as VanCheckbox, Field as VanField } from 'vant';
import type { SlotsType } from 'vue';
import { computed, defineComponent } from 'vue';
import { pick } from '../../src/utils';
import { useCommonSetup, useTempChecked } from '../use';
import type { CheckboxSlots } from './types';
import { checkboxEmitsPrivate as emits, checkboxPropsPrivate as props } from './types';

/**
 * @file 多选框
 */
export default defineComponent({
    name: 'HCheckbox',
    components: { VanCheckbox, VanField },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<CheckboxSlots>,
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
