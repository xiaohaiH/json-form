<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--select-v2 json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <template v-if="slots?.before || ($slots as SelectV2Slots).before">
            <component :is="getNode(slots?.before || ($slots as SelectV2Slots).before)" v-bind="slotProps" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElSelectV2
                :model-value="checked"
                :options="(filterSource as any)"
                :filterable="filterable"
                :clearable="clearable"
                :filter-method="filterMethod && customFilterMethod"
                class="json-form-item__content"
                v-bind="contentActualProps"
                :disabled="globalReadonly || globalDisabled || contentActualProps.disabled"
                @update:model-value="change"
            >
                <template v-for="(item, slotName) of itemSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                </template>
            </ElSelectV2>
        </slot>
        <template v-if="slots?.after || ($slots as SelectV2Slots).after">
            <component :is="getNode(slots?.after || ($slots as SelectV2Slots).after)" v-bind="slotProps" />
        </template>
        <div v-if="slots?.postfix || ($slots as SelectV2Slots).postfix" class="json-form-item__postfix">
            <component :is="getNode(slots?.postfix || ($slots as SelectV2Slots).postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { ElFormItem, ElSelectV2 } from 'element-plus';
import type ElSelectV2Type from 'element-plus/es/components/select-v2/src/select.vue';
import type { SlotsType } from 'vue';
import { computed, customRef, defineComponent, ref } from 'vue';
import { pick } from '../../src/utils';
import { formItemPropKeys } from '../share';
import type { SelectV2Slots } from './types';
import { selectV2EmitsPrivate as emits, selectV2PropsPrivate as props } from './types';

/**
 * @file 虚拟列表下拉框
 */
export default defineComponent({
    name: 'HSelectV2',
    components: {
        ElFormItem,
        // fix: 修复ts4094类型报错
        ElSelectV2: ElSelectV2 as unknown as typeof ElSelectV2Type,
    },
    inheritAttrs: false,
    props,
    slots: Object as SlotsType<SelectV2Slots>,
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

        const filterValue = ref('');
        const customFilterMethod = (val: string) => {
            filterValue.value = val;
        };
        const filterSource = computed(() => {
            const val = filterValue.value;
            return val ? plain.finalOption.value.filter(props.filterMethod!.bind(null, val)) : plain.finalOption.value;
        });
        const slotProps = computed(() => ({
            getFormItemProps: () => formItemActualProps.value,
            getItemProps: () => contentActualProps.value,
            getProps: () => props,
            extraOptions: {
                modelValue: plain.checked.value,
                options: filterSource.value,
                filterValue: filterValue.value,
                filterMethod: props.filterMethod && customFilterMethod,
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
            filterValue,
            customFilterMethod,
            filterSource,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>
