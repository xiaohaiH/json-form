<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--input json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <template v-if="slots?.before || ($slots as InputSlots).before">
            <component :is="getNode(slots?.before || ($slots as InputSlots).before)" v-bind="slotProps" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElInput
                :clearable="clearable"
                :model-value="(tempChecked as string)"
                class="json-form-item__content"
                v-bind="contentActualProps"
                :readonly="globalReadonly || contentActualProps.readonly"
                :disabled="globalDisabled || contentActualProps.disabled"
                @update:model-value="change"
                @keydown.enter="enterHandle"
            >
                <template v-for="(item, slotName) of itemSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                </template>
            </ElInput>
        </slot>
        <template v-if="slots?.after || ($slots as InputSlots).after">
            <component :is="getNode(slots?.after || ($slots as InputSlots).after)" v-bind="slotProps" />
        </template>
        <div v-if="slots?.postfix || ($slots as InputSlots).postfix" class="json-form-item__postfix">
            <component :is="getNode(slots?.postfix || ($slots as InputSlots).postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { ElFormItem, ElInput } from 'element-plus';
import type { SlotsType } from 'vue';
import { computed, defineComponent, ref, watch } from 'vue';
import { pick } from '../../src/utils';
import { useCommonSetup, useTempChecked } from '../use';
import type { InputSlots } from './types';
import { inputEmitsPrivate as emits, inputPropsPrivate as props } from './types';

/**
 * @file 输入框
 */
export default defineComponent({
    name: 'HInput',
    components: {
        ElFormItem,
        ElInput,
    },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<InputSlots>,
    setup(props, ctx) {
        const plain = usePlain(props);
        const { formItemActualProps, contentActualProps, slotProps } = useCommonSetup(props, ctx, plain);
        const { tempChecked, changeSync } = useTempChecked(plain.checked);

        /**
         * 节流
         * @param {string} value: 输入值
         */
        let timer = 0;
        function change(value: string) {
            if (value === tempChecked.value) return;
            const { debounceTime } = props;
            timer && clearTimeout(timer);
            tempChecked.value = value;

            debounceTime
                ? timer = setTimeout(() => changeSync(tempChecked.value), debounceTime) as unknown as number
                : changeSync(value);
        }
        /** 回车事件 */
        function enterHandle(ev: Event | KeyboardEvent) {
            timer && clearTimeout(timer);
            plain.checked.value !== tempChecked.value && (plain.checked.value = tempChecked.value);
            plain.wrapper?.search();
        }

        return {
            hyphenate,
            getNode,
            ...plain,
            formItemActualProps,
            contentActualProps,
            slotProps,
            tempChecked,
            change,
            enterHandle,
        };
    },
});
</script>

<style lang="css" scoped></style>
