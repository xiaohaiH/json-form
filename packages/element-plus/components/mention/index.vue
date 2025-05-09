<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--mention json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <template v-if="slots?.before || ($slots as MentionSlots).before">
            <component :is="getNode(slots?.before || ($slots as MentionSlots).before)" v-bind="slotProps" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElMention
                :clearable="clearable"
                :model-value="(checked as string)"
                :options="(finalOption as any[])"
                class="json-form-item__content"
                v-bind="contentActualProps"
                @update:model-value="debounceChange"
                @keydown.enter="enterHandle"
            >
                <template v-for="(item, slotName) of itemSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                </template>
            </ElMention>
        </slot>
        <template v-if="slots?.after || ($slots as MentionSlots).after">
            <component :is="getNode(slots?.after || ($slots as MentionSlots).after)" v-bind="slotProps" />
        </template>
        <div v-if="slots?.postfix || ($slots as MentionSlots).postfix" class="json-form-item__postfix">
            <component :is="getNode(slots?.postfix || ($slots as MentionSlots).postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { ElFormItem, ElMention } from 'element-plus';
import type { SlotsType } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import { pick } from '../../src/utils';
import { formItemPropKeys } from '../share';
import type { MentionSlots } from './types';
import { mentionEmitsPrivate as emits, mentionPropsPrivate as props } from './types';

/**
 * @file 提及框
 */
export default defineComponent({
    name: 'HMention',
    components: {
        ElFormItem,
        ElMention,
    },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<MentionSlots>,
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
        const slotProps = computed(() => ({
            getFormItemProps: () => formItemActualProps.value,
            getItemProps: () => contentActualProps.value,
            getProps: () => props,
            extraOptions: {
                modelValue: plain.checked.value,
                options: plain.finalOption.value,
                onChange: debounceChange,
                onEnter: enterHandle,
            },
            plain,
        }));

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
