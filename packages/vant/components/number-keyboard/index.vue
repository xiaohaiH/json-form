<template>
    <VanField
        v-if="!hide"
        :name="field"
        :model-value="(checked as string)"
        :disabled="globalDisabled || disabled"
        :readonly="true" :is-link="isLink"
        v-bind="$attrs"
        @click.stop="clickHandle"
    >
        <template #extra>
            <VanNumberKeyboard
                :model-value="(checked as string)"
                :show="popupInfo.visible"
                v-bind="numberKeyboardProps" v-on="numberKeyboardOn"
                @update:model-value="change" @blur="popupInfo.close"
            >
                <template v-for="(item, slotName) of numberKeyboardSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                </template>
            </VanNumberKeyboard>
        </template>
        <template v-for="(item, slotName) of slots" :key="slotName" #[hyphenate(slotName)]="row">
            <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
        </template>
    </VanField>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { Field as VanField, NumberKeyboard as VanNumberKeyboard } from 'vant';
import type { SlotsType } from 'vue';
import { defineComponent, ref } from 'vue';
import { useCommonSetup } from '../use';
import type { NumberKeyboardSlots } from './types';
import { numberKeyboardEmitsPrivate as emits, numberKeyboardPropsPrivate as props } from './types';

/**
 * @file 数字键盘
 */
export default defineComponent({
    name: 'HNumberKeyboard',
    components: { VanField, VanNumberKeyboard },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<NumberKeyboardSlots>,
    setup(props, ctx) {
        const plain = usePlain(props);
        const { slotProps } = useCommonSetup(props, ctx, plain);

        /** 点击事件 */
        function clickHandle(ev: MouseEvent) {
            if (plain.globalDisabled.value || props.disabled || plain.globalReadonly.value || props.readonly) return;
            props.onRowClick ? props.onRowClick(popupInfo.value, ev) : popupInfo.value.open();
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
            clickHandle,
            popupInfo,
        };
    },
});
</script>

<style lang="scss" scoped>
</style>
