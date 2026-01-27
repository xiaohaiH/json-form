<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--input-number json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <template v-if="slots?.before || ($slots as InputNumberSlots).before">
            <component :is="getNode(slots?.before || ($slots as InputNumberSlots).before)" v-bind="slotProps" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
            <!-- :model-value="((tempChecked ? Number(tempChecked) : null) as number)" -->
            <ElInputNumber
                :model-value="tempChecked === 0 ? 0 : (tempChecked as number) || undefined"
                class="json-form-item__content"
                v-bind="contentActualProps"
                :readonly="globalReadonly || contentActualProps.readonly"
                :disabled="globalDisabled || contentActualProps.disabled"
                @update:model-value="debounceChange"
                @keydown.enter="enterHandle"
            >
                <template v-for="(item, slotName) of itemSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                </template>
            </ElInputNumber>
        </slot>
        <template v-if="slots?.after || ($slots as InputNumberSlots).after">
            <component :is="getNode(slots?.after || ($slots as InputNumberSlots).after)" v-bind="slotProps" />
        </template>
        <div v-if="slots?.postfix || ($slots as InputNumberSlots).postfix" class="json-form-item__postfix">
            <component :is="getNode(slots?.postfix || ($slots as InputNumberSlots).postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { ElFormItem, ElInputNumber } from 'element-plus';
import type { SlotsType } from 'vue';
import { computed, defineComponent, ref, watch } from 'vue';
import { pick } from '../../src/utils';
import { formItemPropKeys } from '../share';
import type { InputNumberSlots } from './types';
import { inputNumberEmitsPrivate as emits, inputNumberPropsPrivate as props } from './types';

/**
 * @file 数字输入框
 */
export default defineComponent({
    name: 'HInputNumber',
    components: {
        ElFormItem,
        ElInputNumber,
    },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<InputNumberSlots>,
    setup(props, ctx) {
        const formItemStaticProps = computed(() => {
            const { formItemProps } = props;
            return { ...pick(props, formItemPropKeys), ...formItemProps };
        });
        const formItemActualProps = computed(() => {
            const { query, formItemDynamicProps } = props;
            return formItemDynamicProps ? { ...formItemStaticProps.value, ...formItemDynamicProps({ query }) } : formItemStaticProps.value;
        });
        const contentStaticProps = computed(() => ({ ...ctx.attrs, ...props.staticProps }));
        const contentActualProps = computed(() => {
            const { query, dynamicProps } = props;
            return dynamicProps ? { ...contentStaticProps.value, ...dynamicProps({ query }) } : contentStaticProps.value;
        });
        const plain = usePlain(props);
        const tempChecked = ref(plain.checked.value);
        watch(plain.checked, (value) => tempChecked.value = value);

        /**
         * 节流
         * @param {number} value: 输入值
         */
        let timer = 0;
        function debounceChange(value: number | null | undefined) {
            if (value === tempChecked.value) return;
            const { debounceTime } = props;
            timer && clearTimeout(timer);
            tempChecked.value = value;

            debounceTime
                ? timer = setTimeout(() => changeCallback(tempChecked.value), debounceTime) as unknown as number
                : changeCallback(value);
        }
        /** 防止值改变失败时, 输入框与实际值不一致 */
        function changeCallback(value: number | null | undefined) {
            const _value = plain.checked.value;
            plain.change(value);
            // /** 当更新后的值与现有的相等时, 说明内部逻辑做特殊处理了(比如重置为默认值等操作) */
            plain.checked.value === _value && (tempChecked.value = _value);
        }
        /** 回车事件 */
        function enterHandle(ev: Event | KeyboardEvent) {
            timer && clearTimeout(timer);
            plain.checked.value !== tempChecked.value && (plain.checked.value = tempChecked.value);
            plain.wrapper?.search();
        }
        const slotProps = computed(() => ({
            getFormItemProps: () => formItemActualProps.value,
            getItemProps: () => contentActualProps.value,
            getProps: () => props,
            extraOptions: {
                modelValue: tempChecked.value === 0 ? 0 : (tempChecked.value as number) || undefined,
                options: plain.finalOption.value,
                onChange: debounceChange,
            },
            plain,
        }));

        return {
            hyphenate,
            getNode,
            ...plain,
            tempChecked,
            formItemActualProps,
            contentActualProps,
            debounceChange,
            enterHandle,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>
