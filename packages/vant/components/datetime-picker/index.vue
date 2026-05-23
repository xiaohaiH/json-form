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
                <VanDatetimePicker
                    :model-value="checked"
                    v-bind="datetimePickerProps" v-on="datetimePickerOn"
                    @change="changeHandle" @confirm="confirmHandle" @cancel="cancelHandle"
                >
                    <template v-for="(item, slotName) of datetimePickerSlots" :key="slotName" #[hyphenate(slotName)]="row">
                        <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                    </template>
                </VanDatetimePicker>
            </VanPopup>
        </template>
        <template v-for="(item, slotName) of slots" :key="slotName" #[hyphenate(slotName)]="row">
            <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
        </template>
    </VanField>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { DatetimePicker as VanDatetimePicker, Field as VanField, Popup as VanPopup } from 'vant';
import type { SlotsType } from 'vue';
import { computed, defineComponent, nextTick, ref, watch } from 'vue';
import { useCommonSetup } from '../use';
import type { DatetimePickerSlots } from './types';
import { datetimePickerEmitsPrivate as emits, datetimePickerPropsPrivate as props } from './types';

/**
 * @file 日期时间选择框 - vant@3.x版本
 */
export default defineComponent({
    name: 'HDatetimePicker',
    components: { VanDatetimePicker, VanField, VanPopup },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<DatetimePickerSlots>,
    setup(props, ctx) {
        const plain = usePlain(props);
        const { slotProps } = useCommonSetup(props, ctx, plain);
        /** 展示在页面上的值 */
        const showText = ref<string | number>();
        const datetimeValue = ref<Date>();
        let tempValue: any;
        // 监听外部值的改变, 如果改变且与临时值不一致时
        // 则更新当前值, 并重置临时值
        watch(
            plain.checked,
            (val) => {
                if (val === tempValue) return tempValue = null;
                tempValue = null;
                datetimeValue.value = val
                    ? props.valueUnformat ? props.valueUnformat(val) : val
                    : undefined;
                showText.value = datetimeValue.value ? props.format(datetimeValue.value) : '';
            },
            { immediate: true },
        );

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
        function dateEventHandle(type: string, value: Date) {
            if (props.valueTrigger === type || props.datetimePickerProps?.showToolbar === false) {
                plain.change(props.valueFormat ? props.valueFormat(value) : value);
                showText.value = props.format(value);
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
            clickHandle,
            changeHandle: dateEventHandle.bind(null, 'change'),
            confirmHandle: dateEventHandle.bind(null, 'confirm'),
            cancelHandle: dateEventHandle.bind(null, 'cancel'),
            popupInfo,
        };
    },
});
</script>

<style lang="scss" scoped>
</style>
