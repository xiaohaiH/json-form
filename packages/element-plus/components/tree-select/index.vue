<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--tree-select json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemStaticProps"
        :prop="formItemStaticProps.prop || field"
        v-bind.prop="formItemFinalDynamicProps"
    >
        <template v-if="slots?.before || ($slots as TreeSelectSlots).before">
            <component :is="getNode(slots?.before || ($slots as TreeSelectSlots).before)" v-bind="slotProps" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElTreeSelect
                v-bind="contentStaticProps"
                :filterable="filterable"
                :clearable="clearable"
                :data="filterSource"
                :model-value="checked as string[]"
                :filter-method="filterMethod && customFilterMethod"
                class="json-form-item__content"
                v-bind.prop="contentDynamicProps"
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
        const formItemFinalDynamicProps = computed(() => {
            const { query, formItemDynamicProps } = props;
            return formItemDynamicProps ? formItemDynamicProps({ query }) : undefined;
        });
        const contentStaticProps = computed(() => ({ ...ctx.attrs, ...props.staticProps }));
        const contentDynamicProps = computed(() => {
            const { query, dynamicProps } = props;
            return dynamicProps ? dynamicProps({ query }) : undefined;
        });
        const plain = usePlain(props);

        const filterValue = ref('');
        const customFilterMethod = (val: string) => {
            filterValue.value = val;
        };
        const filterSource = computed(() => {
            const val = filterValue.value;
            return val ? plain.finalOption.value.filter(props.filterMethod!.bind(null, val)) : plain.finalOption.value;
        });
        const slotProps = computed(() => ({
            getFormItemProps: () => ({ ...formItemStaticProps.value, ...formItemFinalDynamicProps.value }),
            getItemProps: () => ({ ...contentStaticProps.value, ...contentDynamicProps.value }),
            getProps: () => props,
            options: filterSource.value,
            modelValue: plain.checked.value,
            onChange: plain.change,
            filterValue: filterValue.value,
            filterMethod: props.filterMethod && customFilterMethod,
            class: 'json-form-item__content',
            plain,
        }));

        return {
            hyphenate,
            ...plain,
            formItemStaticProps,
            formItemFinalDynamicProps,
            contentStaticProps,
            contentDynamicProps,
            getNode,
            filterValue,
            customFilterMethod,
            filterSource,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>
