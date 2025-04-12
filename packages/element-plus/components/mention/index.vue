<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--mention json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemStaticProps"
        :prop="formItemStaticProps.prop || field"
        v-bind.prop="formItemFinalDynamicProps"
    >
        <template v-if="slots?.before || ($slots as MentionSlots).before">
            <component :is="getNode(slots?.before || ($slots as MentionSlots).before)" v-bind="slotProps" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElMention
                v-bind="contentStaticProps"
                :clearable="clearable"
                :model-value="checked as string"
                :options="finalOption as any[]"
                class="json-form-item__content"
                v-bind.prop="contentDynamicProps"
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
        const slotProps = computed(() => ({
            getFormItemProps: () => ({ ...formItemStaticProps.value, ...formItemFinalDynamicProps.value }),
            getItemProps: () => ({ ...contentStaticProps.value, ...contentDynamicProps.value }),
            getProps: () => props,
            options: plain.finalOption.value,
            modelValue: plain.checked.value,
            onChange: debounceChange,
            onEnter: enterHandle,
            class: 'json-form-item__content',
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
            plain.checked.value = (ev.target as HTMLInputElement).value;
            plain.option.updateWrapperQuery();
            plain.wrapper?.search();
        }

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
