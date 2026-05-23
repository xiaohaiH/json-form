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
                <VanPickerGroup
                    v-bind="pickerGroupProps" v-on="pickerGroupOn"
                    @confirm="pickerGroupHandle('confirm', $event)" @cancel="pickerGroupHandle('cancel', $event)"
                >
                    <VanDatePicker
                        ref="datePickerRef"
                        :model-value="checkedArr[0]"
                        v-bind="datePickerProps" v-on="datePickerOn"
                        @change="changeHandle($event, 0)"
                    >
                        <template v-for="(item, slotName) of datePickerSlots" :key="slotName" #[hyphenate(slotName)]="row">
                            <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                        </template>
                    </VanDatePicker>
                    <VanTimePicker
                        ref="timePickerRef"
                        :model-value="checkedArr[1]"
                        v-bind="timePickerProps" v-on="timePickerOn"
                        @change="changeHandle($event, 1)"
                    >
                        <template v-for="(item, slotName) of timePickerSlots" :key="slotName" #[hyphenate(slotName)]="row">
                            <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                        </template>
                    </VanTimePicker>
                    <template v-for="(item, slotName) of pickerGroupSlots" :key="slotName" #[hyphenate(slotName)]="row">
                        <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                    </template>
                </VanPickerGroup>
            </VanPopup>
        </template>
        <template v-for="(item, slotName) of slots" :key="slotName" #[hyphenate(slotName)]="row">
            <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
        </template>
    </VanField>
</template>

<script lang="ts">
import { getNode, hyphenate, isArray, usePlain } from '@xiaohaih/json-form-core';
import type { DatePickerInstance, TimePickerInstance } from 'vant';
import { DatePicker as VanDatePicker, Field as VanField, PickerGroup as VanPickerGroup, Popup as VanPopup, TimePicker as VanTimePicker } from 'vant';
import type { SlotsType, VNode } from 'vue';
import { computed, defineComponent, Fragment, markRaw, nextTick, ref, watch } from 'vue';
import type { PickerOption } from '../picker/types';
import { useCommonSetup } from '../use';
import type { DateTimePickerGroupSlots } from './types';
import { dateTimePickerGroupEmitsPrivate as emits, dateTimePickerGroupPropsPrivate as props } from './types';

/**
 * @file 日期时间组件
 */
export default defineComponent({
    name: 'HDateTimePickerGroup',
    components: { VanPickerGroup, VanField, VanPopup, VanDatePicker, VanTimePicker },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<DateTimePickerGroupSlots>,
    setup(props, ctx) {
        const plain = usePlain(props);
        const { slotProps } = useCommonSetup(props, ctx, plain);
        /** 展示在页面上的值 */
        const showText = ref('');
        /** 给日期组件的值 */
        const checkedArr = ref<any[]>([]);
        const datePickerRef = ref<DatePickerInstance>();
        const timePickerRef = ref<TimePickerInstance>();
        let tempValue: any;
        // 监听外部值的改变, 如果改变且与临时值不一致时
        // 则更新当前值, 并重置临时值
        watch(
            plain.checked,
            (val) => {
                if (val === tempValue) return tempValue = null;
                tempValue = null;
                checkedArr.value = val ? props.valueUnformat(val) : [];
                showText.value = checkedArr.value.length ? props.format(checkedArr.value) : '';
            },
            { immediate: true },
        );

        /** 点击事件 */
        function clickHandle(ev: MouseEvent) {
            if (plain.globalDisabled.value || props.disabled || plain.globalReadonly.value || props.readonly) return;
            props.onRowClick ? props.onRowClick(popupInfo.value, ev) : popupInfo.value.open();
        }
        /** 值更改事件 */
        function changeHandle(value: PickerOption, idx: number) {
            checkedArr.value[idx] = value.selectedValues;
            pickerGroupHandle('change');
        }
        /**
         * 日期更改事件
         * @param {string} type 事件类型
         * @param {PickerOption[]} [options] 确认事件会传递该选项
         */
        function pickerGroupHandle(type: string, options?: PickerOption[]) {
            if (type !== 'change' && options) checkedArr.value = options.map((o) => o.selectedValues);
            if ((props.valueTrigger === type || props.pickerGroupProps?.showToolbar === false) && checkedArr.value.length >= 2) {
                plain.change(props.valueFormat(checkedArr.value));
                showText.value = props.format(checkedArr.value);
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
            datePickerRef,
            timePickerRef,
            clickHandle,
            changeHandle,
            pickerGroupHandle,
            popupInfo,
        };
    },
});
</script>

<style lang="scss" scoped>
</style>
