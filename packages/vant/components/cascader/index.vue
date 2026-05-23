<template>
    <VanField
        v-if="!hide"
        :name="field" :label="label"
        :disabled="globalDisabled || disabled"
        :readonly="true"
        :placeholder="placeholder"
        :model-value="lastCheckedValue" :is-link="isLink"
        v-bind="$attrs"
        @click="clickHandle"
    >
        <template #input>
            <HInputSlot
                :value="showText" :placeholder="placeholder"
                :disabled="globalDisabled || disabled" :readonly="globalReadonly || readonly"
                v-bind="$attrs"
            />
        </template>
        <template #extra>
            <VanPopup v-model:show="popupInfo.visible" teleport="body" round position="bottom" v-bind="popupProps" v-on="popupOn" @close="popupInfo.close">
                <VanCascader
                    :title="cascaderProps.title || label" :placeholder="cascaderProps.placeholder || placeholder"
                    :model-value="lastCheckedValue" :options="finalOption"
                    v-bind="cascaderProps" v-on="cascaderOn"
                    @change="change" @finish="finish" @close="popupInfo.close"
                >
                    <template v-for="(item, slotName) of cascaderSlots" :key="slotName" #[hyphenate(slotName)]="row">
                        <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                    </template>
                </VanCascader>
            </VanPopup>
        </template>
        <template v-for="(item, slotName) of slots" :key="slotName" #[hyphenate(slotName)]="row">
            <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
        </template>
    </VanField>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import type { CascaderOption } from 'vant';
import { Cascader as VanCascader, Field as VanField, Popup as VanPopup } from 'vant';
import type { SlotsType } from 'vue';
import { computed, defineComponent, ref, watch } from 'vue';
import { pick } from '../../src/utils';
import { HInputSlot } from '../input-slot/index';
import { useCommonSetup, useTempChecked } from '../use';
import { getChained } from '../utils';
import type { CascaderSlots } from './types';
import { cascaderEmitsPrivate as emits, cascaderPropsPrivate as props } from './types';

interface Datum {
    /** 当前选中项 */
    value: string | number;
    /** 选中项的所有值 */
    selectedOptions: CascaderOption[];
    /** 选中项下标 */
    tabIndex: number;
}

/**
 * @file 级联框
 */
export default defineComponent({
    name: 'HCascader',
    components: { VanCascader, VanField, VanPopup, HInputSlot },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<CascaderSlots>,
    setup(props, ctx) {
        const plain = usePlain(props);
        /** 选中值的最后一位 */
        const lastCheckedValue = computed(() => {
            const val = plain.checked.value;
            return (Array.isArray(val) ? val[val.length - 1] : val) as string;
        });
        /** 展示的文字 */
        const showText = computed(() => {
            const val = lastCheckedValue.value;
            const options = plain.finalOption.value;
            if (!val || !options.length) return '';
            const { labelKey, valueKey, children } = fieldInfo.value;
            const result = getChained(options, { [valueKey]: val }, children);
            if (!result.length) return '';
            return props.showAllLevels ? result.map((v) => v[labelKey]).join('/') : result[result.length - 1]![labelKey];
        });
        const { slotProps } = useCommonSetup(props, ctx, plain);
        /** 级联下拉框的字段信息 */
        const fieldInfo = computed(() => {
            const fieldNames = props.cascaderProps?.fieldNames || {};
            return {
                labelKey: fieldNames.text || 'text',
                valueKey: fieldNames.value || 'value',
                children: fieldNames.children || 'children',
            };
        });

        /** 点击事件 */
        function clickHandle(ev: MouseEvent) {
            if (plain.globalDisabled.value || props.disabled || plain.globalReadonly.value || props.readonly) return;
            props.onRowClick ? props.onRowClick(popupInfo.value, ev) : popupInfo.value.open();
        }
        /** 级联选择值更改事件 */
        function change(option: Datum) {
            props.checkStrictly && setValue(option);
        }
        /** 级联选择完成事件 */
        function finish(option: Datum) {
            props.checkStrictly || setValue(option);
        }
        /** 设置文本框显示的值 */
        function setValue(option: Datum) {
            const { valueKey } = fieldInfo.value;
            props.emitPath ? plain.change(option.selectedOptions.map((v) => v[valueKey])) : plain.change(option.value);
        }
        /** 弹窗显示状态 */
        const popupInfo = ref({
            visible: false,
            open() {
                popupInfo.value.visible = true;
            },
            close() {
                popupInfo.value.visible = false;
            },
        });

        return {
            hyphenate,
            getNode,
            ...plain,
            slotProps,
            fieldInfo,
            lastCheckedValue,
            showText,
            clickHandle,
            change,
            finish,
            setValue,
            popupInfo,
        };
    },
});
</script>

<style lang="scss" scoped></style>
