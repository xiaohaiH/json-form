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
                <VanArea
                    :model-value="checked"
                    :area-list="finalOption"
                    v-bind="areaProps" v-on="areaOn"
                    @change="changeHandle" @confirm="confirmHandle" @cancel="cancelHandle"
                >
                    <template v-for="(item, slotName) of areaSlots" :key="slotName" #[hyphenate(slotName)]="row">
                        <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                    </template>
                </VanArea>
            </VanPopup>
        </template>
        <template v-for="(item, slotName) of slots" :key="slotName" #[hyphenate(slotName)]="row">
            <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
        </template>
    </VanField>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { Area as VanArea, Field as VanField, Popup as VanPopup } from 'vant';
import type { SlotsType } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import type { PickerOption } from '../picker/types';
import { useCommonSetup } from '../use';
import type { AreaSlots } from './types';
import { areaEmitsPrivate as emits, areaPropsPrivate as props } from './types';

/**
 * @file 区域选择框
 */
export default defineComponent({
    name: 'HArea',
    components: { VanArea, VanField, VanPopup },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<AreaSlots>,
    setup(props, ctx) {
        const plain = usePlain(props);
        const { slotProps } = useCommonSetup(props, ctx, plain);
        /** 展示在页面上的值 */
        const showText = computed(() => {
            const value = plain.checked.value as string;
            if (!value) return '';
            const { format, showAllLevels, separator } = props;
            const source = (props.areaProps?.areaList || plain.finalOption.value) as Record<string, any>;
            if (format) return format({ source, value, showAllLevels, separator });
            const result: string[] = [];
            source.province_list && result.push(source.province_list[`${value.slice(0, 2)}0000`]);
            value.length >= 4 && source.city_list && result.push(source.city_list[`${value.slice(0, 4)}00`]);
            value.length >= 6 && source.county_list && result.push(source.county_list[value]);
            return result.filter(Boolean).join(separator);
        });
        /** 点击事件 */
        function clickHandle(ev: MouseEvent) {
            if (plain.globalDisabled.value || props.disabled || plain.globalReadonly.value || props.readonly) return;
            props.onRowClick ? props.onRowClick(popupInfo.value, ev) : popupInfo.value.open();
        }
        /**
         * 更改事件
         * @param {string} type 事件类型
         * @param {string} value 日期值
         */
        function dateEventHandle(type: string, value: PickerOption) {
            // @ts-expect-error 忽视 showToolbar 声明报错
            (props.valueTrigger === type || props.areaProps?.showToolbar === false) && plain.change(value.selectedValues.slice(-1)[0]);
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
