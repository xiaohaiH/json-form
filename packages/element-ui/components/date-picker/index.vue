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
            <component :is="getNode(slots.before || $slots.before, slotProps)" v-bind="slotProps" />
        </template>
        <!-- 自定义内容插槽 -->
        <template v-if="slots.default">
            <component :is="getNode(slots.default, slotProps)" v-bind="slotProps" />
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
                @[changeName]="change"
            />
        </slot>
        <!-- 后置内容插槽 -->
        <template v-if="slots.after || $slots.after">
            <component :is="getNode(slots.after || $slots.after, slotProps)" v-bind="slotProps" />
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
import { useCommonSetup } from '../use';
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
        const plain = usePlain(props);
        const { formItemActualProps, contentActualProps, slotProps } = useCommonSetup(props, ctx, plain);

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
