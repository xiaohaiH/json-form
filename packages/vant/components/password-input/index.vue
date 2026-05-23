<template>
    <VanField
        v-if="!hide"
        :name="field" :label="label"
        :model-value="(checked as string)"
        :disabled="globalDisabled || disabled"
        :readonly="globalReadonly || readonly"
        v-bind="$attrs"
        @click.stop="clickHandle"
    >
        <template #input>
            <VanPasswordInput
                style="width: 100%"
                :value="(checked as string)"
                :focused="popupInfo.visible"
                v-bind="passwordInputProps" v-on="passwordInputOn"
                @focus="clickHandle"
            >
                <template v-for="(item, slotName) of passwordInputSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                </template>
            </VanPasswordInput>
        </template>
        <template #extra>
            <VanNumberKeyboard
                :model-value="(checked as string)"
                :show="popupInfo.visible"
                v-bind="numberKeyboardProps"
                v-on="numberKeyboardOn"
                @update:model-value="customChange"
                @blur="popupInfo.close"
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
import { Field as VanField, NumberKeyboard as VanNumberKeyboard, PasswordInput as VanPasswordInput } from 'vant';
import type { SlotsType } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import { useCommonSetup } from '../use';
import type { PasswordInputSlots } from './types';
import { passwordInputEmitsPrivate as emits, passwordInputPropsPrivate as props } from './types';

/**
 * @file 密码输入框
 */
export default defineComponent({
    name: 'HPasswordInput',
    components: { VanField, VanNumberKeyboard, VanPasswordInput },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<PasswordInputSlots>,
    setup(props, ctx) {
        const plain = usePlain(props);
        const { slotProps } = useCommonSetup(props, ctx, plain);

        /** 点击事件 */
        function clickHandle(ev: MouseEvent) {
            if (plain.globalDisabled.value || props.disabled || plain.globalReadonly.value || props.readonly) return;
            props.onRowClick ? props.onRowClick(popupInfo.value, ev) : popupInfo.value.open();
        }
        /** 重写 change 事件 */
        function customChange(value: string) {
            const len = Number(props.passwordInputProps?.length) || 6;
            if (value.length === len) popupInfo.value.close();
            plain.change(value);
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
            customChange,
            popupInfo,
        };
    },
});
</script>

<style lang="scss" scoped>
</style>
