<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child -->
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--select json-form-item--${field} json-form-item--${!!slots.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <template v-if="slots.before || $slots.before">
            <component :is="getNode(slots.before || $slots.before, slotProps)" v-bind="slotProps" :filter-value="filterValue" :remote-method="remoteMethod" />
        </template>
        <template v-if="slots.default">
            <component :is="getNode(slots.default, slotProps)" v-bind="slotProps" :filter-value="filterValue" :remote-method="remoteMethod" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElSelect
                :filterable="filterable"
                :clearable="clearable"
                :filter-method="filterMethod && customFilterMethod"
                :value-key="valueKey"
                :value="checked"
                :loading="loading"
                class="json-form-item__content"
                v-bind="contentActualProps"
                :remote-method="remoteMethod"
                :disabled="globalReadonly || globalDisabled || contentActualProps.disabled"
                v-on="$listeners"
                @input="change"
                @blur="customFilterMethod('')"
                @change="customFilterMethod('')"
            >
                <template v-for="item of filterSource">
                    <template v-if="group && item[groupChildrenKey]">
                        <ElOptionGroup :key="item[valueKey]" :label="item[labelKey]" :disabled="item[disabledKey]">
                            <template v-for="group of item[groupChildrenKey]">
                                <ElOption :key="group[valueKey]" :label="group[labelKey]" :value="valueIsWhole ? group : group[valueKey]" />
                            </template>
                        </ElOptionGroup>
                    </template>
                    <template v-else>
                        <ElOption
                            :key="item[valueKey]"
                            :label="item[labelKey]"
                            :value="valueIsWhole ? item : item[valueKey]"
                            :disabled="item[disabledKey]"
                        />
                    </template>
                </template>

                <template v-if="itemSlots.prefix" #prefix>
                    <component :is="getNode(itemSlots.prefix, slotProps)" v-bind="slotProps" :filter-value="filterValue" :remote-method="remoteMethod" />
                </template>
                <template v-if="itemSlots.empty" #empty>
                    <component :is="getNode(itemSlots.empty, slotProps)" v-bind="slotProps" :filter-value="filterValue" :remote-method="remoteMethod" />
                </template>
                <!-- <template v-for="(item, slotName) of itemSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" :filter-value="filterValue" :remote-method="remoteMethod" v-bind.prop="row" />
                </template> -->
            </ElSelect>
        </slot>
        <template v-if="slots.after || $slots.after">
            <component :is="getNode(slots.after || $slots.after, slotProps)" v-bind="slotProps" :filter-value="filterValue" :remote-method="remoteMethod" />
        </template>
        <div v-if="slots.postfix || $slots.postfix" class="json-form-item__postfix">
            <component :is="getNode(slots.postfix || $slots.postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { FormItem as ElFormItem, Option as ElOption, OptionGroup as ElOptionGroup, Select as ElSelect } from 'element-ui';
import { computed, defineComponent, ref } from 'vue-demi';
import { getNode, pick } from '../../src/utils';
import { useCommonSetup } from '../use';
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
    // slots: Object as SlotsType<SelectSlots>,
    setup(props, ctx) {
        const plain = usePlain(props);
        const { formItemActualProps, contentActualProps, slotProps } = useCommonSetup(props, ctx, plain);
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
            return (plain.finalOption.value as any[]).reduce<any[]>((p, v: any) => {
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

        return {
            hyphenate,
            getNode,
            ...plain,
            formItemActualProps,
            contentActualProps,
            slotProps,
            filterValue,
            customFilterMethod,
            remoteMethod,
            filterSource,
        };
    },
});
</script>

<style lang="css" scoped></style>
