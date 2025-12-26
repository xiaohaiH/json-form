<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--tree-select json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <template v-if="slots?.before || ($slots as TreeSelectSlots).before">
            <component :is="getNode(slots?.before || ($slots as TreeSelectSlots).before)" v-bind="slotProps" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
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
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                </template>
            </ElTreeSelect>
        </slot>
        <template v-if="slots?.after || ($slots as TreeSelectSlots).after">
            <component :is="getNode(slots?.after || ($slots as TreeSelectSlots).after)" v-bind="slotProps" />
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
import { formItemPropKeys } from '../share';
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
        const formItemStaticProps = computed(() => {
            const { formItemProps } = props;
            return { ...pick(props, formItemPropKeys), ...formItemProps };
        });
        const formItemActualProps = computed(() => {
            const { query, formItemDynamicProps } = props;
            return formItemDynamicProps ? { ...formItemStaticProps.value, ...formItemDynamicProps({ query }) } : formItemStaticProps.value;
        });
        const contentStaticProps = computed(() => ({ ...ctx.attrs, ...props.staticProps }));
        const contentActualProps = computed(() => {
            const { query, dynamicProps } = props;
            return dynamicProps ? { ...contentStaticProps.value, ...dynamicProps({ query }) } : contentStaticProps.value;
        });
        const plain = usePlain(props);

        function remoteMethod(val: string) {
            plain.getOptions('other', { filterValue: val });
        }
        const slotProps = computed(() => ({
            getFormItemProps: () => formItemActualProps.value,
            getItemProps: () => contentActualProps.value,
            getProps: () => props,
            extraOptions: {
                modelValue: plain.checked.value,
                options: plain.finalOption.value,
                onChange: plain.change,
            },
            plain,
        }));

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
