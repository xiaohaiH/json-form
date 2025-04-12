<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--input-number json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemStaticProps"
        :prop="formItemStaticProps.prop || field"
        v-bind.prop="formItemFinalDynamicProps"
    >
        <template v-if="slots?.before || ($slots as InputNumberSlots).before">
            <component :is="getNode(slots?.before || ($slots as InputNumberSlots).before)" v-bind="slotProps" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
            <!-- 不监听回车事件, 防止实际值与组件内部的值(会根据提供的精度等配置项而主动改变)不匹配 -->
            <!-- @keydown.enter="enterHandle" -->
            <!-- :model-value="((checked ? Number(checked) : null) as number)" -->
            <ElInputNumber
                v-bind="contentStaticProps"
                :model-value="checked === 0 ? 0 : (checked as number) || undefined"
                class="json-form-item__content"
                v-bind.prop="contentDynamicProps"
                @update:model-value="debounceChange"
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
import { computed, defineComponent, ref } from 'vue';
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
        const formItemFinalDynamicProps = computed(() => {
            const { query, formItemDynamicProps } = props;
            return formItemDynamicProps ? formItemDynamicProps({ query }) : undefined;
        });
        const contentStaticProps = computed(() => ({ ...ctx.attrs, ...props.staticProps }));
        const contentDynamicProps = computed(() => {
            const { query, dynamicProps } = props;
            return dynamicProps ? dynamicProps({ query }) : undefined;
        });
        const plain = usePlain(props);
        /**
         * 节流
         * @param {number} value: 输入值
         */
        let timer = 0;
        function debounceChange(value: number | null | undefined) {
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
            plain.checked.value = (ev.target as HTMLInputElement).value;
            plain.option.updateWrapperQuery();
            plain.wrapper?.search();
        }
        const slotProps = computed(() => ({
            getFormItemProps: () => ({ ...formItemStaticProps.value, ...formItemFinalDynamicProps.value }),
            getItemProps: () => ({ ...contentStaticProps.value, ...contentDynamicProps.value }),
            getProps: () => props,
            options: plain.finalOption.value,
            modelValue: plain.checked.value === 0 ? 0 : (plain.checked.value as number) || undefined,
            onChange: debounceChange,
            class: 'json-form-item__content',
            plain,
        }));

        return {
            hyphenate,
            ...plain,
            formItemStaticProps,
            formItemFinalDynamicProps,
            contentStaticProps,
            contentDynamicProps,
            debounceChange,
            enterHandle,
            getNode,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>
