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
                :model-value="(checked as string)"
                class="json-form-item__content"
                v-bind="contentActualProps"
                @update:model-value="debounceChange"
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
import { computed, defineComponent, ref } from 'vue';
import { pick } from '../../src/utils';
import { formItemPropKeys } from '../share';
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
        /**
         * 节流
         * @param {string} value: 输入值
         */
        let timer = 0;
        function debounceChange(value: string) {
            const { realtime, waitTime } = props;
            timer && clearTimeout(timer);
            if (realtime) {
                plain.change(value);
            }
            else {
                plain.updateCheckedValue(value);
                if (!plain.wrapper) return;
                timer = setTimeout(plain.wrapper.insetSearch, waitTime) as unknown as number;
            }
        }
        /** 回车事件 */
        function enterHandle(ev: Event | KeyboardEvent) {
            timer && clearTimeout(timer);
            (plain.checked as any).value = (ev.target as HTMLInputElement).value;
            plain.option.updateWrapperQuery();
            plain.wrapper?.search();
        }
        const slotProps = computed(() => ({
            getFormItemProps: () => formItemActualProps.value,
            getItemProps: () => contentActualProps.value,
            getProps: () => props,
            options: plain.finalOption.value,
            modelValue: plain.checked.value,
            onChange: debounceChange,
            onEnter: enterHandle,
            class: 'json-form-item__content',
            plain,
        }));

        return {
            hyphenate,
            getNode,
            ...plain,
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
