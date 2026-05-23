<template>
    <VanField
        v-if="!hide"
        v-bind="$attrs"
        ref="fieldRef"
        :name="field"
        :disabled="globalDisabled || disabled"
        :readonly="globalDisabled || readonly"
        :clearable="clearable"
        :model-value="(tempChecked as string)"
        @update:model-value="change"
        @keydown.enter="enterHandle"
    >
        <template v-for="(item, slotName) of slots" :key="slotName" #[hyphenate(slotName)]="row">
            <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
        </template>
    </VanField>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { Field as VanField } from 'vant';
import type { SlotsType } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import { useCommonSetup, useTempChecked } from '../use';
import type { InputSlots } from './types';
import { inputEmitsPrivate as emits, inputPropsPrivate as props } from './types';

/**
 * @file 输入框
 */
export default defineComponent({
    name: 'HInput',
    components: { VanField },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<InputSlots>,
    setup(props, ctx) {
        const plain = usePlain(props);
        const { slotProps } = useCommonSetup(props, ctx, plain);
        const { tempChecked, changeSync } = useTempChecked(plain.checked);
        const fieldRef = ref<ComponentExposed<typeof VanField>>();

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
            fieldRef,
            ...plain,
            slotProps,
            tempChecked,
            change,
            enterHandle,
        };
    },
});
</script>

<style lang="scss" scoped>
</style>
