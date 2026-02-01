<template>
    <ElFormItem
        v-if="!hide"
        :class="`json-form-item json-form-item--checkbox json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <template v-if="slots?.before || ($slots as CheckboxSlots).before">
            <component :is="getNode(slots?.before || ($slots as CheckboxSlots).before)" v-bind="slotProps" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
            <component
                :is="checkboxType"
                :model-value="(checked as boolean)"
                class="json-form-item__content"
                v-bind="contentActualProps"
                :disabled="globalReadonly || globalDisabled || contentActualProps.disabled"
                @update:model-value="(change as () => void)"
            >
                <template v-for="(item, slotName) of itemSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                </template>
            </component>
        </slot>
        <template v-if="slots?.after || ($slots as CheckboxSlots).after">
            <component :is="getNode(slots?.after || ($slots as CheckboxSlots).after) " v-bind="slotProps" />
        </template>
        <div v-if="slots?.postfix || ($slots as CheckboxSlots).postfix" class="json-form-item__postfix">
            <component :is="getNode(slots?.postfix || ($slots as CheckboxSlots).postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { ElCheckbox, ElCheckboxButton, ElCheckboxGroup, ElFormItem } from 'element-plus';
import type { SlotsType } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import { pick } from '../../src/utils';
import { useCommonSetup } from '../use';
import type { CheckboxSlots } from './types';
import { checkboxEmitsPrivate as emits, checkboxPropsPrivate as props } from './types';

/**
 * @file 复选框
 */
export default defineComponent({
    name: 'HCheckbox',
    components: {
        ElFormItem,
        ElCheckboxButton,
        ElCheckbox,
    },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<CheckboxSlots>,
    setup(props, ctx) {
        const checkboxType = computed(() => (props.type === 'button' ? 'ElCheckboxButton' : 'ElCheckbox'));

        const plain = usePlain(props);
        const { formItemActualProps, contentActualProps, slotProps } = useCommonSetup(props, ctx, plain);

        return {
            hyphenate,
            getNode,
            ...plain,
            formItemActualProps,
            contentActualProps,
            slotProps,
            checkboxType,
        };
    },
});
</script>

<style lang="css" scoped></style>
