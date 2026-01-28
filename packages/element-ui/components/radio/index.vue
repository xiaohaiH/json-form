<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child -->
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--radio json-form-item--${field} json-form-item--${!!slots.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <template v-if="slots.before || $slots.before">
            <component :is="getNode(slots.before || $slots.before, slotProps)" v-bind="slotProps" />
        </template>
        <template v-if="slots.default">
            <component :is="getNode(slots.default, slotProps)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
            <component
                :is="radioType"
                :value="checked"
                class="json-form-item__content"
                v-bind="contentActualProps"
                :label="contentActualProps.value"
                :disabled="globalReadonly || globalDisabled || contentActualProps.disabled"
                v-on="$listeners"
                @input="change"
                @[eventName].native.prevent="customChange"
            >
                {{ contentActualProps.label }}
                <template v-if="itemSlots.default" #default>
                    <component :is="getNode(itemSlots.default, slotProps)" v-bind="slotProps" />
                </template>
                <!-- <template v-for="(item, slotName) of itemSlots" #[slotName]="row">
                    <component :is="getNode(item, { ...row, ...slotProps })" v-bind="slotProps" :key="slotName" />
                </template> -->
            </component>
        </slot>
        <template v-if="slots.after || $slots.after">
            <component :is="getNode(slots.after || $slots.after, slotProps)" v-bind="slotProps" />
        </template>
        <div v-if="slots.postfix || $slots.postfix" class="json-form-item__postfix">
            <component :is="getNode(slots.postfix || $slots.postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { FormItem as ElFormItem, Radio as ElRadio, RadioButton as ElRadioButton, RadioGroup as ElRadioGroup } from 'element-ui';
import { computed, defineComponent, ref } from 'vue-demi';
import { getNode, pick } from '../../src/utils';
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
        ElRadioGroup,
        ElRadioButton,
        ElRadio,
    },
    inheritAttrs: false,
    props,
    emits,
    // slots: Object as SlotsType<RadioSlots>,
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
            const val = plain.checked.value === contentActualProps.value.value ? '' : contentActualProps.value.value;
            plain.change(val);
            val === '' && (document.activeElement as HTMLInputElement)?.blur?.();
        }
        const slotProps = computed(() => ({
            getFormItemProps: () => formItemActualProps.value,
            getItemProps: () => contentActualProps.value,
            getProps: () => props,
            extraOptions: {
                value: plain.checked.value,
                options: plain.finalOption.value,
                onChange: plain.change,
                radioType: radioType.value,
            },
            plain,
        }));

        return {
            hyphenate,
            getNode,
            ...plain,
            radioType,
            eventName,
            formItemActualProps,
            contentActualProps,
            customChange,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>
