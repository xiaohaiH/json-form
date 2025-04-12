<template>
    <ElFormItem
        v-if="!hide"
        :class="`json-form-item json-form-item--checkbox json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemStaticProps"
        :prop="formItemStaticProps.prop || field"
        v-bind.prop="formItemFinalDynamicProps"
    >
        <template v-if="slots?.before || ($slots as CheckboxSlots).before">
            <component :is="getNode(slots?.before || ($slots as CheckboxSlots).before)" v-bind="slotProps" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
            <component
                :is="checkboxType"
                v-bind="contentStaticProps"
                :model-value="(checked as boolean)"
                class="json-form-item__content"
                v-bind.prop="contentDynamicProps"
                @update:model-value="(change as () => void)"
            />
        </slot>
        <template v-if="slots?.after || ($slots as CheckboxSlots).after">
            <component :is="getNode(slots?.after || ($slots as CheckboxSlots).after) " v-bind="slotProps" />
        </template>
        <div v-if="slots?.postfix || ($slots as CheckboxSlots).postfix" class="json-form-item__postfix">
            <component :is="getNode(slots?.postfix || ($slots as CheckboxSlots).postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { ElCheckbox, ElCheckboxButton, ElCheckboxGroup, ElFormItem } from 'element-plus';
import type { SlotsType } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import { pick } from '../../src/utils';
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
    emits,
    slots: Object as SlotsType<CheckboxSlots>,
    setup(props, ctx) {
        const checkboxType = computed(() => (props.type === 'button' ? 'ElCheckboxButton' : 'ElCheckbox'));

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
            onChange: plain.change,
            checkboxType: checkboxType.value,
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
            checkboxType,
            getNode,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>
