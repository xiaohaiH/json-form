<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--cascader json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <template v-if="slots?.before || ($slots as CascaderSlots).before">
            <component :is="getNode(slots?.before || ($slots as CascaderSlots).before)" v-bind="slotProps" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElCascader
                :filterable="filterable"
                :clearable="clearable"
                :options="(finalOption as any[])"
                :model-value="tempChecked"
                class="json-form-item__content"
                v-bind="contentActualProps"
                :disabled="globalReadonly || globalDisabled || contentActualProps.disabled"
                @update:model-value="change"
            >
                <template v-for="(item, slotName) of itemSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                </template>
            </ElCascader>
        </slot>
        <template v-if="slots?.after || ($slots as CascaderSlots).after">
            <component :is="getNode(slots?.after || ($slots as CascaderSlots).after) " v-bind="slotProps" />
        </template>
        <div v-if="slots?.postfix || ($slots as CascaderSlots).postfix" class="json-form-item__postfix">
            <component :is="getNode(slots?.postfix || ($slots as CascaderSlots).postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { getNode, hyphenate, isEmptyValue, usePlain } from '@xiaohaih/json-form-core';
import { ElCascader, ElFormItem } from 'element-plus';
import type { SlotsType } from 'vue';
import { computed, defineComponent, nextTick, reactive, ref, toRefs, watch } from 'vue';
import { pick } from '../../src/utils';
import { useCommonSetup, useTempChecked } from '../use';
import type { CascaderSlots } from './types';
import { cascaderEmitsPrivate as emits, cascaderPropsPrivate as props } from './types';

/**
 * @file 级联选择
 */
export default defineComponent({
    name: 'HCascader',
    components: {
        ElFormItem,
        ElCascader,
    },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<CascaderSlots>,
    setup(props, ctx) {
        const plain = usePlain(props);
        const { formItemActualProps, contentActualProps, slotProps } = useCommonSetup(props, ctx, plain);
        const { tempChecked, change } = useTempChecked(plain.checked);

        return {
            hyphenate,
            getNode,
            ...plain,
            formItemActualProps,
            contentActualProps,
            slotProps,
            tempChecked,
            change,
        };
    },
});
</script>

<style lang="css" scoped></style>
