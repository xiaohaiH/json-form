<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--select json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <template v-if="slots?.before || ($slots as SelectSlots).before">
            <component :is="getNode(slots?.before || ($slots as SelectSlots).before)" v-bind="slotProps" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElSelect
                :filterable="filterable"
                :clearable="clearable"
                :model-value="(checked as string[])"
                :filter-method="filterMethod && customFilterMethod"
                :valueKey="valueKey"
                :loading="loading"
                class="json-form-item__content"
                v-bind="contentActualProps"
                :remote-method="remoteMethod"
                :disabled="globalReadonly || globalDisabled || contentActualProps.disabled"
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
import type SelectType from 'element-plus/es/components/select/index';
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
        // fix: 修复打包时ts2742类型报错
        ElSelect: ElSelect as unknown as typeof SelectType,
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
        function remoteMethod(val: string) {
            plain.getOptions('other', { filterValue: val });
        }
        const filterSource = computed(() => {
            const val = filterValue.value;
            if (!val || contentActualProps.value.remote) return plain.finalOption.value;
            // 如果是分组数据, 只过滤实际选项
            const { groupChildrenKey: key, group } = props;
            return plain.finalOption.value.reduce<any[]>((p, v: any) => {
                if (group && v[key]) {
                    const r = v[key].filter(props.filterMethod!.bind(null, val));
                    r.length && p.push({ ...v, [key]: r });
                }
                else {
                    props.filterMethod!(val, v) && p.push(v);
                }
                return p;
            }, []);
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
                remoteMethod,
                onChange: plain.change,
            },
            plain,
        }));

        return {
            hyphenate,
            getNode,
            ...plain,
            formDisabled,
            formItemActualProps,
            contentActualProps,
            filterValue,
            customFilterMethod,
            remoteMethod,
            filterSource,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>
