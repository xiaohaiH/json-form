<template>
    <ElFormItem
        v-if="!hide"
        :class="`json-form-item json-form-item--checkbox-group json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <template v-if="slots?.before || ($slots as CheckboxGroupSlots).before">
            <component :is="getNode(slots?.before || ($slots as CheckboxGroupSlots).before)" v-bind="slotProps" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElCheckboxGroup
                :model-value="(checked as string[])"
                class="json-form-item__content"
                v-bind="contentActualProps"
                @update:model-value="(change as () => void)"
            >
                <template v-for="item of finalOption" :key="item[valueKey]">
                    <component
                        :is="checkboxType"
                        v-bind="itemProps"
                        :label="(item as any)[realLabelProp]"
                        :value="(item as any)[valueKey]"
                        :disabled="(item as any)[disabledKey]"
                    >
                        {{ (item as any)[labelKey] }}
                        <template v-for="(option, slotName) of itemSlots" :key="slotName" #[hyphenate(slotName)]="row">
                            <component :is="getNode(option)" v-bind="slotProps" v-bind.prop="row" :option="item" :labelKey="labelKey" :valueKey="valueKey" :disabledKey="disabledKey" />
                        </template>
                    </component>
                </template>
            </ElCheckboxGroup>
        </slot>
        <template v-if="slots?.after || ($slots as CheckboxGroupSlots).after">
            <component :is="getNode(slots?.after || ($slots as CheckboxGroupSlots).after)" v-bind="slotProps" />
        </template>
        <div v-if="slots?.postfix || ($slots as CheckboxGroupSlots).postfix" class="json-form-item__postfix">
            <component :is="getNode(slots?.postfix || ($slots as CheckboxGroupSlots).postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { checkVersion, getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { ElCheckbox, ElCheckboxButton, ElCheckboxGroup, ElFormItem, version } from 'element-plus';
import type { SlotsType } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import { pick } from '../../src/utils';
import { formItemPropKeys } from '../share';
import type { CheckboxGroupSlots } from './types';
import { checkboxGroupEmitsPrivate as emits, checkboxGroupPropsPrivate as props } from './types';

/** 小于 2.6 版本时, label 作为 value 使用 */
const VALUE_KEY = checkVersion(version, '2.6.0', '<') ? 'valueKey' : 'labelKey';

/**
 * @file 复选框组
 */
export default defineComponent({
    name: 'HCheckboxGroup',
    components: {
        ElFormItem,
        ElCheckboxGroup,
        ElCheckboxButton,
        ElCheckbox,
    },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<CheckboxGroupSlots>,
    setup(props, ctx) {
        const checkboxType = computed(() => (props.type === 'button' ? 'ElCheckboxButton' : 'ElCheckbox'));
        const realLabelProp = computed(() => props[VALUE_KEY]);

        const formItemStaticProps = computed(() => {
            const { formItemProps } = props;
            return { ...pick(props, formItemPropKeys), ...formItemProps };
        });
        // 计算表单项实际属性（合并静态和动态属性）
        const formItemActualProps = computed(() => {
            const { query, formItemDynamicProps } = props;
            return formItemDynamicProps ? { ...formItemStaticProps.value, ...formItemDynamicProps({ query }) } : formItemStaticProps.value;
        });
        // 计算内容静态属性
        const contentStaticProps = computed(() => ({ ...ctx.attrs, ...props.staticProps }));
        // 计算内容实际属性（合并静态和动态属性）
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
                onChange: plain.change,
                checkboxType: checkboxType.value,
            },
            plain,
        }));

        return {
            hyphenate,
            getNode,
            ...plain,
            formItemActualProps,
            contentActualProps,
            checkboxType,
            realLabelProp,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>
