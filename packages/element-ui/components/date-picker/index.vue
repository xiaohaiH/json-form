<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child -->
    <!-- 表单项容器 -->
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--datepicker json-form-item--${field} json-form-item--${!!slots.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <!-- 前置内容插槽 -->
        <template v-if="slots.before || $slots.before">
            <component :is="getNode(slots.before || $slots.before, slotProps)" />
        </template>
        <!-- 自定义内容插槽 -->
        <template v-if="slots.default">
            <component :is="getNode(slots.default, slotProps)" />
        </template>
        <!-- 默认日期选择器组件 -->
        <slot v-else v-bind="slotProps">
            <ElDatePicker
                :value="checked"
                :valueFormat="valueFormat"
                class="json-form-item__content"
                v-bind="contentActualProps"
                :readonly="globalReadonly || contentActualProps.readonly"
                :disabled="globalDisabled || contentActualProps.disabled"
                v-on="$listeners"
                @input="change"
            />
        </slot>
        <!-- 后置内容插槽 -->
        <template v-if="slots.after || $slots.after">
            <component :is="getNode(slots.after || $slots.after, slotProps)" />
        </template>
        <!-- 尾缀插槽 -->
        <div v-if="slots.postfix || $slots.postfix" class="json-form-item__postfix">
            <component :is="getNode(slots.postfix || $slots.postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { DatePicker as ElDatePicker, FormItem as ElFormItem } from 'element-ui';
import { computed, defineComponent, reactive } from 'vue-demi';
import { getNode, pick } from '../../src/utils';
import { formItemPropKeys } from '../share';
import type { DatePickerSlots } from './types';
import { datePickerEmitsPrivate as emits, datePickerPropsPrivate as props } from './types';

/**
 * 判断是否为日期范围选择器
 * 通过检查type属性是否以range结尾来确定
 *
 * @param {string | undefined} str - 日期选择器类型
 * @returns {boolean} 是否为范围选择器
 */
const reg = /range$/;
function isRange(str: string | undefined) {
    return str ? reg.test(str) : false;
}

/**
 * 日期选择器组件
 *
 * 基于Element UI的DatePicker组件进行封装，提供更丰富的功能和更灵活的配置
 * 支持表单项配置、动态属性、插槽定制等特性
 */
export default defineComponent({
    name: 'HDatepicker',
    components: {
        ElFormItem,
        ElDatePicker,
    },
    inheritAttrs: false,
    props,
    emits,
    // slots: Object as SlotsType<DatePickerSlots>,
    setup(props, ctx) {
        /**
         * 表单项静态属性
         * 合并从props中提取的表单项属性和formItemProps属性
         */
        const formItemStaticProps = computed(() => {
            const { formItemProps } = props;
            return { ...pick(props, formItemPropKeys), ...formItemProps };
        });

        /**
         * 表单项实际属性
         * 合并静态属性和动态属性
         */
        const formItemActualProps = computed(() => {
            const { query, formItemDynamicProps } = props;
            return formItemDynamicProps ? { ...formItemStaticProps.value, ...formItemDynamicProps({ query }) } : formItemStaticProps.value;
        });

        /**
         * 日期选择器静态属性
         * 合并从attrs中提取的属性和staticProps属性
         */
        const contentStaticProps = computed(() => ({ ...ctx.attrs, ...props.staticProps }));

        /**
         * 日期选择器实际属性
         * 合并静态属性和动态属性
         */
        const contentActualProps = computed(() => {
            const { query, dynamicProps } = props;
            return dynamicProps ? { ...contentStaticProps.value, ...dynamicProps({ query }) } : contentStaticProps.value;
        });

        // 使用核心库的usePlain钩子初始化数据和方法
        const plain = usePlain(props);

        /**
         * 插槽属性
         * 提供给插槽内容的数据和方法
         */
        const slotProps = computed(() => ({
            getFormItemProps: () => formItemActualProps.value,
            getItemProps: () => contentActualProps.value,
            getProps: () => props,
            extraOptions: {
                value: plain.checked.value,
                options: plain.finalOption.value,
                onChange: plain.change,
            },
            plain,
        }));

        return {
            hyphenate,
            getNode,
            ...plain,
            formItemActualProps,
            contentActualProps,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>
