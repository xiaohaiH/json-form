<template>
    <VanField
        v-if="!hide"
        :name="field" :label="label"
        :disabled="globalDisabled || disabled"
        :readonly="globalReadonly || readonly"
        v-bind="$attrs"
    >
        <template #input>
            <VanCheckboxGroup
                :name="field" :model-value="checked"
                :disabled="globalDisabled || disabled || globalReadonly || readonly"
                v-bind="checkboxGroupProps" v-on="checkboxGroupOn"
                @update:model-value="change"
            >
                <template v-for="item of finalOption" :key="item[valueKey]">
                    <VanCheckbox :name="item[valueKey]" v-bind="checkboxProps" v-on="checkboxOn">
                        {{ item[labelKey] }}
                        <template v-for="(checkBoxItem, slotName) of checkboxSlots" :key="slotName" #[hyphenate(slotName)]="row">
                            <component :is="getNode(checkBoxItem)" v-bind="slotProps" :item="item" v-bind.prop="row" />
                        </template>
                    </VanCheckbox>
                </template>
            </VanCheckboxGroup>
        </template>
        <template v-for="(item, slotName) of slots" :key="slotName" #[hyphenate(slotName)]="row">
            <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
        </template>
    </VanField>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { Checkbox as VanCheckbox, CheckboxGroup as VanCheckboxGroup, Field as VanField } from 'vant';
import type { SlotsType } from 'vue';
import { computed, defineComponent } from 'vue';
import { pick } from '../../src/utils';
import { useCommonSetup, useTempChecked } from '../use';
import type { CheckboxGroupSlots } from './types';
import { checkboxGroupEmitsPrivate as emits, checkboxGroupPropsPrivate as props } from './types';

/**
 * @file 多选框组
 */
export default defineComponent({
    name: 'HCheckboxGroup',
    components: { VanCheckbox, VanCheckboxGroup, VanField },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<CheckboxGroupSlots>,
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
