<template>
    <VanField
        v-if="!hide"
        :name="field"
        :disabled="globalDisabled || disabled"
        :readonly="true"
        :is-link="isLink"
        :model-value="showText"
        v-bind="$attrs"
        @click="clickHandle"
    >
        <template #extra>
            <VanPopup v-model:show="popupInfo.visible" teleport="body" round position="bottom" v-bind="popupProps" v-on="popupOn" @close="popupInfo.close">
                <VanPicker
                    :model-value="checked"
                    :columns="finalOption"
                    v-bind="pickerProps" v-on="pickerOn"
                    @change="pickerHandle('change', $event)" @confirm="pickerHandle('confirm', $event)" @cancel="pickerHandle('cancel', $event)"
                >
                    <template v-for="(item, slotName) of pickerSlots" :key="slotName" #[hyphenate(slotName)]="row">
                        <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                    </template>
                </VanPicker>
            </VanPopup>
        </template>
        <template v-for="(item, slotName) of slots" :key="slotName" #[hyphenate(slotName)]="row">
            <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
        </template>
    </VanField>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { Field as VanField, Picker as VanPicker, Popup as VanPopup } from 'vant';
import type { SlotsType } from 'vue';
import { computed, defineComponent, ref, watch } from 'vue';
import { useCommonSetup } from '../use';
import type { PickerOption, PickerSlots } from './types';
import { pickerEmitsPrivate as emits, pickerPropsPrivate as props } from './types';

/**
 * @file 选择框
 */
export default defineComponent({
    name: 'HPicker',
    components: { VanPicker, VanField, VanPopup },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<PickerSlots>,
    setup(props, ctx) {
        const plain = usePlain(props);
        const { slotProps } = useCommonSetup(props, ctx, plain);
        /** 展示在页面上的值 */
        const showText = computed(() => {
            const value = plain.checked.value as string[];
            if (!value || !value.length) return '';
            const { format, showAllLevels, separator } = props;
            const source = (props.pickerProps?.columns || plain.finalOption.value) as Record<string, any>[];
            const _columnsFieldNames = (props.pickerProps || {}).columnsFieldNames || {};
            const columnsFieldNames = { text: _columnsFieldNames.text || 'text', value: _columnsFieldNames.value || 'value', children: _columnsFieldNames.children || 'children' };
            if (format) return format({ source, value, columnsFieldNames, showAllLevels, separator });

            // 判断是否为扁平多列结构（source 中的元素是数组）
            const isMultiColumnFlat = source.length > 0 && Array.isArray(source[0]);

            if (isMultiColumnFlat) {
                // 1. 扁平的多列：每列独立查找
                return value.map((val, i) => {
                    const column = source[i] || [];
                    const item = column.find((opt: Record<string, any>) => opt[columnsFieldNames.value] === val);
                    return item ? item[columnsFieldNames.text] : '';
                }).filter(Boolean).join(separator);
            }
            // 2. 树形级联或单列：逐级查找
            const texts: string[] = [];
            let currentOptions = source;
            for (const val of value) {
                const item = currentOptions.find((opt: Record<string, any>) => opt[columnsFieldNames.value] === val);
                if (!item) break;
                texts.push(item[columnsFieldNames.text]);
                currentOptions = item[columnsFieldNames.children] || [];
            }
            return showAllLevels ? texts.join(separator) : texts[texts.length - 1];
        });

        /** 点击事件 */
        function clickHandle(ev: MouseEvent) {
            if (plain.globalDisabled.value || props.disabled || plain.globalReadonly.value || props.readonly) return;
            props.onRowClick ? props.onRowClick(popupInfo.value, ev) : popupInfo.value.open();
        }
        /**
         * 日期更改事件
         * @param {string} type 事件类型
         * @param {string} value 日期值
         */
        function pickerHandle(type: string, value: PickerOption) {
            (props.valueTrigger === type || props.pickerProps?.showToolbar === false) && plain.change(value.selectedValues);
            switch (type) {
                case 'confirm':
                case 'cancel':
                {
                    popupInfo.value.close();
                    break;
                }
                default: break;
            }
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
            showText,
            clickHandle,
            pickerHandle,
            popupInfo,
        };
    },
});
</script>

<style lang="scss" scoped>
</style>
