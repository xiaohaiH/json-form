<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--radio json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <template v-if="slots?.before || ($slots as RadioSlots).before">
            <component :is="getNode(slots?.before || ($slots as RadioSlots).before)" v-bind="slotProps" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
            <component
                :is="radioType"
                :model-value="(checked as boolean)"
                class="json-form-item__content"
                v-bind="contentActualProps"
                @update:model-value="(change as () => void)"
                @[eventName].prevent="customChange"
            >
                <template v-for="(item, slotName) of itemSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                </template>
            </component>
        </slot>
        <template v-if="slots?.after || ($slots as RadioSlots).after">
            <component :is="getNode(slots?.after || ($slots as RadioSlots).after)" v-bind="slotProps" />
        </template>
        <div v-if="slots?.postfix || ($slots as RadioSlots).postfix" class="json-form-item__postfix">
            <component :is="getNode(slots?.postfix || ($slots as RadioSlots).postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { ElFormItem, ElRadio, ElRadioButton, ElRadioGroup } from 'element-plus';
import type { SlotsType } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import { pick } from '../../src/utils';
import { formItemPropKeys } from '../share';
import type { RadioSlots } from './types';
import { radioEmitsPrivate as emits, radioPropsPrivate as props } from './types';

/**
 * @file 单选框
 */
export default defineComponent({
    name: 'HRadio',
    components: {
        ElFormItem,
        ElRadioButton,
        ElRadio,
    },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<RadioSlots>,
    setup(props, ctx) {
        const radioType = computed(() => (props.type === 'button' ? 'ElRadioButton' : 'ElRadio'));
        const eventName = computed(() => (props.cancelable ? 'click' : null));

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

        /** 单选框选中事件 - 处理可取消选中 */
        function customChange() {
            plain.change(plain.checked.value === formItemActualProps.value.value ? '' : formItemActualProps.value.value);
        }
        const slotProps = computed(() => ({
            getFormItemProps: () => formItemActualProps.value,
            getItemProps: () => contentActualProps.value,
            getProps: () => props,
            options: plain.finalOption.value,
            modelValue: plain.checked.value,
            onChange: plain.change,
            onCancelable: customChange,
            radioType: radioType.value,
            class: 'json-form-item__content',
            plain,
        }));

        return {
            hyphenate,
            getNode,
            ...plain,
            formItemActualProps,
            contentActualProps,
            radioType,
            eventName,
            customChange,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>
