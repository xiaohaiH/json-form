<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--color-picker json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <template v-if="slots?.before || ($slots as ColorPickerSlots).before">
            <component :is="getNode(slots?.before || ($slots as ColorPickerSlots).before)" v-bind="slotProps" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElColorPicker
                :model-value="(checked as string)"
                class="json-form-item__content"
                v-bind="contentActualProps"
                :disabled="globalReadonly || globalDisabled || contentActualProps.disabled"
                @[changeName]="(change as () => void)"
            >
                <template v-for="(item, slotName) of itemSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                </template>
            </ElColorPicker>
        </slot>
        <template v-if="slots?.after || ($slots as ColorPickerSlots).after">
            <component :is="getNode(slots?.after || ($slots as ColorPickerSlots).after)" v-bind="slotProps" />
        </template>
        <div v-if="slots?.postfix || ($slots as ColorPickerSlots).postfix" class="json-form-item__postfix">
            <component :is="getNode(slots?.postfix || ($slots as ColorPickerSlots).postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { ElColorPicker, ElFormItem } from 'element-plus';
import type ElColorPickerType from 'element-plus/es/components/color-picker/src/color-picker.vue';
import type { SlotsType } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import { pick } from '../../src/utils';
import { useCommonSetup } from '../use';
import type { ColorPickerSlots } from './types';
import { colorPickerEmitsPrivate as emits, colorPickerPropsPrivate as props } from './types';

/**
 * @file 颜色选择器
 */
export default defineComponent({
    name: 'HColorPicker',
    components: {
        ElFormItem,
        // fix: 修复ts4094类型报错
        ElColorPicker: ElColorPicker as unknown as typeof ElColorPickerType,
    },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<ColorPickerSlots>,
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
