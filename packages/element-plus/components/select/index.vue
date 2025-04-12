<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--select json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemStaticProps"
        :prop="formItemStaticProps.prop || field"
        v-bind.prop="formItemFinalDynamicProps"
    >
        <template v-if="slots?.before || ($slots as SelectSlots).before">
            <component :is="getNode(slots?.before || ($slots as SelectSlots).before)" v-bind="slotProps" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElSelect
                v-bind="contentStaticProps"
                :filterable="filterable"
                :clearable="clearable"
                :model-value="(checked as string[])"
                :filter-method="filterMethod && customFilterMethod"
                :valueKey="valueKey"
                class="json-form-item__content"
                v-bind.prop="contentDynamicProps"
                @update:model-value="change"
            >
                <template v-for="item of filterSource" :key="(item as any)[valueKey]">
                    <template v-if="group && (item as any)[groupChildrenKey]">
                        <ElOptionGroup :label="(item as any)[labelKey]" :disabled="(item as any)[disabledKey]">
                            <template v-for="group of (item as any)[groupChildrenKey]" :key="group[valueKey]">
                                <ElOption :label="group[labelKey]" :value="valueIsWhole ? group : group[valueKey]">
                                    <template v-if="itemSlots?.option || ($slots as SelectSlots).option">
                                        <component
                                            :is="getNode(itemSlots?.option || ($slots as SelectSlots).option)"
                                            :item="group"
                                            :parent="item"
                                            :disabled="(item as any)[disabledKey] || formDisabled"
                                        />
                                    </template>
                                </ElOption>
                            </template>
                        </ElOptionGroup>
                    </template>
                    <template v-else>
                        <ElOption
                            :label="(item as any)[labelKey]"
                            :value="valueIsWhole ? item : (item as any)[valueKey]"
                            :disabled="(item as any)[disabledKey]"
                        >
                            <template v-if="itemSlots?.option || ($slots as SelectSlots).option">
                                <component
                                    :is="getNode(itemSlots?.option || ($slots as SelectSlots).option)"
                                    :item="item"
                                    :disabled="(item as any)[disabledKey] || formDisabled"
                                />
                            </template>
                        </ElOption>
                    </template>
                </template>

                <template v-for="(item, slotName) of itemSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                </template>
            </ElSelect>
        </slot>
        <template v-if="slots?.after || ($slots as SelectSlots).after">
            <component :is="getNode(slots?.after || ($slots as SelectSlots).after)" v-bind="slotProps" />
        </template>
        <div v-if="slots?.postfix || ($slots as SelectSlots).postfix" class="json-form-item__postfix">
            <component :is="getNode(slots?.postfix || ($slots as SelectSlots).postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { ElFormItem, ElOption, ElOptionGroup, ElSelect } from 'element-plus';
import type { SlotsType } from 'vue';
import { computed, customRef, defineComponent, ref } from 'vue';
import { pick } from '../../src/utils';
import { formItemPropKeys } from '../share';
import type { SelectSlots } from './types';
import { selectEmitsPrivate as emits, selectPropsPrivate as props } from './types';

/**
 * @file 下拉框
 */
export default defineComponent({
    name: 'HSelect',
    components: {
        ElFormItem,
        ElSelect,
        ElOptionGroup,
        ElOption,
    },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<SelectSlots>,
    setup(props, ctx) {
        // 兼容低版本, 不对 form 做处理
        // const formDisabled = useFormDisabled();
        const formDisabled = false;
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
            filterValue: filterValue.value,
            filterMethod: props.filterMethod && customFilterMethod,
            onChange: plain.change,
            class: 'json-form-item__content',
            plain,
        }));

        return {
            hyphenate,
            ...plain,
            formDisabled,
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
