<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--select-v2 json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <template v-if="slots?.before || ($slots as SelectV2Slots).before">
            <component :is="getNode(slots?.before || ($slots as SelectV2Slots).before)" v-bind="slotProps" :filter-value="filterValue" :remote-method="remoteMethod" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" :filter-value="filterValue" :remote-method="remoteMethod" />
        </template>
        <slot v-else v-bind="slotProps" :filter-value="filterValue" :remote-method="remoteMethod">
            <ElSelectV2
                :model-value="checked"
                :options="(filterSource as any)"
                :filterable="filterable"
                :clearable="clearable"
                :filter-method="filterMethod && customFilterMethod"
                :loading="loading"
                class="json-form-item__content"
                v-bind="contentActualProps"
                :remote-method="remoteMethod"
                :disabled="globalReadonly || globalDisabled || contentActualProps.disabled"
                @update:model-value="change"
            >
                <template v-for="(item, slotName) of itemSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" :filter-value="filterValue" :remote-method="remoteMethod" v-bind.prop="row" />
                </template>
            </ElSelectV2>
        </slot>
        <template v-if="slots?.after || ($slots as SelectV2Slots).after">
            <component :is="getNode(slots?.after || ($slots as SelectV2Slots).after)" v-bind="slotProps" :filter-value="filterValue" :remote-method="remoteMethod" />
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
import { useCommonSetup, useTempChecked } from '../use';
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
            const key = contentActualProps.value.props?.options || 'options';
            return (plain.finalOption.value as any[]).reduce<any[]>((p, v: any) => {
                if (v[key]) {
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
