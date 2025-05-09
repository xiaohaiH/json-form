<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child -->
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--checkbox json-form-item--${field} jsonFormItem${!!slots.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <template v-if="slots.before || $slots.before">
            <component :is="getNode(slots.before || $slots.before, slotProps)" />
        </template>
        <template v-if="slots.default">
            <component :is="getNode(slots.default, slotProps)" />
        </template>
        <slot v-else v-bind="slotProps">
            <component
                :is="checkboxType"
                :value="checked"
                class="json-form-item__content"
                v-bind="contentActualProps"
                v-on="$listeners"
                @change="change"
            >
                <template v-if="itemSlots.default" #default>
                    <component :is="getNode(itemSlots.default, slotProps)" />
                </template>
                <!-- <template v-for="(item, slotName) of itemSlots" #[slotName]="row">
                    <component :is="getNode(item, { ...row, ...slotProps })" :key="slotName" />
                </template> -->
            </component>
        </slot>
        <template v-if="slots.after || $slots.after">
            <component :is="getNode(slots.after || $slots.after, slotProps)" />
        </template>
        <div v-if="slots.postfix || $slots.postfix" class="json-form-item__postfix">
            <component :is="getNode(slots.postfix || $slots.postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { Checkbox as ElCheckbox, CheckboxButton as ElCheckboxButton, FormItem as ElFormItem } from 'element-ui';
import { computed, defineComponent, ref } from 'vue-demi';
import { getNode, pick } from '../../src/utils';
import { formItemPropKeys } from '../share';
import type { CheckboxSlots } from './types';
import { checkboxEmitsPrivate as emits, checkboxPropsPrivate as props } from './types';

/**
 * @file 复选框
 */
export default defineComponent({
    name: 'HCheckbox',
    components: {
        ElFormItem,
        ElCheckboxButton,
        ElCheckbox,
    },
    inheritAttrs: false,
    props,
    setup(props, ctx) {
        const checkboxType = computed(() => (props.type === 'button' ? 'ElCheckboxButton' : 'ElCheckbox'));

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
            return dynamicProps ? { ...dynamicProps({ query }), ...contentStaticProps.value } : contentStaticProps.value;
        });
        const plain = usePlain(props);
        const slotProps = computed(() => ({
            getFormItemProps: () => formItemActualProps.value,
            getItemProps: () => contentActualProps.value,
            getProps: () => props,
            options: plain.finalOption.value,
            value: plain.checked.value,
            onChange: plain.change,
            checkboxType: checkboxType.value,
            class: 'json-form-item__content',
            plain,
        }));

        return {
            hyphenate,
            getNode,
            checkboxType,
            ...plain,
            formItemActualProps,
            contentActualProps,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>
