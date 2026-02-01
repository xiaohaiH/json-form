<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--tree-select json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <template v-if="slots?.before || ($slots as TreeSelectSlots).before">
            <component :is="getNode(slots?.before || ($slots as TreeSelectSlots).before)" v-bind="slotProps" :remote-method="remoteMethod" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" :remote-method="remoteMethod" />
        </template>
        <slot v-else v-bind="slotProps" :remote-method="remoteMethod">
            <ElTreeSelect
                :filterable="filterable"
                :clearable="clearable"
                :data="(finalOption as any[])"
                :model-value="(checked as string[])"
                :loading="loading"
                class="json-form-item__content"
                v-bind="contentActualProps"
                :remote-method="contentActualProps.remote ? remoteMethod : undefined"
                :disabled="globalReadonly || globalDisabled || contentActualProps.disabled"
                @update:model-value="change"
            >
                <template v-for="(item, slotName) of itemSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" :remote-method="remoteMethod" v-bind.prop="row" />
                </template>
            </ElTreeSelect>
        </slot>
        <template v-if="slots?.after || ($slots as TreeSelectSlots).after">
            <component :is="getNode(slots?.after || ($slots as TreeSelectSlots).after)" v-bind="slotProps" :remote-method="remoteMethod" />
        </template>
        <div v-if="slots?.postfix || ($slots as TreeSelectSlots).postfix" class="json-form-item__postfix">
            <component :is="getNode(slots?.postfix || ($slots as TreeSelectSlots).postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { ElFormItem, ElTreeSelect } from 'element-plus';
import type { SlotsType } from 'vue';
import { computed, customRef, defineComponent, ref } from 'vue';
import { pick } from '../../src/utils';
import { useCommonSetup } from '../use';
import type { TreeSelectSlots } from './types';
import { treeSelectEmitsPrivate as emits, treeSelectPropsPrivate as props } from './types';

/**
 * @file 树形下拉框
 */
export default defineComponent({
    name: 'HTreeSelect',
    components: {
        ElFormItem,
        ElTreeSelect,
    },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<TreeSelectSlots>,
    setup(props, ctx) {
        const plain = usePlain(props);
        const { formItemActualProps, contentActualProps, slotProps } = useCommonSetup(props, ctx, plain);

        function remoteMethod(val: string) {
            plain.getOptions('other', { filterValue: val });
        }

        return {
            hyphenate,
            getNode,
            ...plain,
            formItemActualProps,
            contentActualProps,
            remoteMethod,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>
