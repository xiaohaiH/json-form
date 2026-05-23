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
                <VanTimePicker
                    :model-value="checkedArr"
                    v-bind="timePickerProps" v-on="timePickerOn"
                    @change="changeHandle" @confirm="confirmHandle" @cancel="cancelHandle"
                >
                    <template v-for="(item, slotName) of timePickerSlots" :key="slotName" #[hyphenate(slotName)]="row">
                        <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                    </template>
                </VanTimePicker>
            </VanPopup>
        </template>
        <template v-for="(item, slotName) of slots" :key="slotName" #[hyphenate(slotName)]="row">
            <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
        </template>
    </VanField>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { Field as VanField, Popup as VanPopup, TimePicker as VanTimePicker } from 'vant';
import type { SlotsType } from 'vue';
import { computed, defineComponent, nextTick, ref, watch } from 'vue';
import type { PickerOption } from '../picker/types';
import { useCommonSetup } from '../use';
import type { TimePickerSlots } from './types';
import { timePickerEmitsPrivate as emits, timePickerPropsPrivate as props } from './types';

/**
 * @file 时间选择框
 */
export default defineComponent({
    name: 'HTimePicker',
    components: { VanField, VanPopup, VanTimePicker },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<TimePickerSlots>,
    setup(props, ctx) {
        const plain = usePlain(props);
        const { slotProps } = useCommonSetup(props, ctx, plain);
        /** 展示在页面上的值 */
        const showText = ref('');
        /** 给时间组件的值 */
        const checkedArr = ref<string[]>([]);
        let tempValue: any;
        // 监听外部值的改变, 如果改变且与临时值不一致时
        // 则更新当前值, 并重置临时值
        watch(
            plain.checked,
            (val) => {
                if (val === tempValue) return tempValue = null;
                tempValue = null;
                checkedArr.value = val ? props.valueUnformat(val, props.separator) : [];
                showText.value = checkedArr.value.length ? props.format(checkedArr.value, props.separator) : '';
            },
            { immediate: true },
        );

        /** 点击事件 */
        function clickHandle(ev: MouseEvent) {
            if (plain.globalDisabled.value || props.disabled || plain.globalReadonly.value || props.readonly) return;
            props.onRowClick ? props.onRowClick(popupInfo.value, ev) : popupInfo.value.open();
        }
        /**
         * 时间更改事件
         * @param {string} type 事件类型
         * @param {string} value 日期值
         */
        function timeEventHandle(type: string, value: PickerOption) {
            if (props.valueTrigger === type || props.timePickerProps?.showToolbar === false) {
                checkedArr.value = value.selectedValues;
                plain.change(props.valueFormat(value.selectedValues, props.separator));
                showText.value = props.format(value.selectedValues, props.separator);
                tempValue = plain.checked.value;
                nextTick(() => tempValue = null);
            }
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
            checkedArr,
            clickHandle,
            changeHandle: timeEventHandle.bind(null, 'change'),
            confirmHandle: timeEventHandle.bind(null, 'confirm'),
            cancelHandle: timeEventHandle.bind(null, 'cancel'),
            popupInfo,
        };
    },
});
</script>

<style lang="scss" scoped>
</style>
