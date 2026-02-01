<template>
    <!-- 级联选择器表单项容器 -->
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child -->
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--cascader json-form-item--${field} json-form-item--${!!slots.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <!-- 表单项前置内容插槽 -->
        <template v-if="slots.before || $slots.before">
            <component :is="getNode(slots.before || $slots.before, slotProps)" v-bind="slotProps" />
        </template>
        <!-- 自定义默认插槽内容 -->
        <template v-if="slots.default">
            <component :is="getNode(slots.default, slotProps)" v-bind="slotProps" />
        </template>
        <!-- 默认级联选择器渲染 -->
        <slot v-else v-bind="slotProps">
            <ElCascader
                :filterable="filterable"
                :clearable="clearable"
                :options="finalOption"
                :value="tempChecked"
                class="json-form-item__content"
                v-bind="contentActualProps"
                :disabled="globalReadonly || globalDisabled || contentActualProps.disabled"
                v-on="$listeners"
                @input="change"
            >
                <!-- 级联选择器内部默认插槽 -->
                <template v-if="itemSlots.default" #default>
                    <component :is="getNode(itemSlots.default, slotProps)" v-bind="slotProps" />
                </template>
                <!-- 动态插槽支持 - 目前被注释 -->
                <!-- <template v-for="(item, slotName) of itemSlots" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item, { ...row, ...slotProps })" v-bind="slotProps" :key="slotName" />
                </template> -->
            </ElCascader>
        </slot>
        <!-- 表单项后置内容插槽 -->
        <template v-if="slots.after || $slots.after">
            <component :is="getNode(slots.after || $slots.after, slotProps)" v-bind="slotProps" />
        </template>
        <!-- 表单项额外后缀插槽 -->
        <div v-if="slots.postfix || $slots.postfix" class="json-form-item__postfix">
            <component :is="getNode(slots.postfix || $slots.postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { hyphenate, isEmptyValue, usePlain } from '@xiaohaih/json-form-core';
import { Cascader as ElCascader, FormItem as ElFormItem } from 'element-ui';
import type { PropType } from 'vue-demi';
import { computed, defineComponent, nextTick, reactive, ref, watch } from 'vue-demi';
import { getNode, pick } from '../../src/utils';
import { useCommonSetup, useTempChecked } from '../use';
import type { CascaderSlots } from './types';
import { cascaderEmitsPrivate as emits, cascaderPropsPrivate as props } from './types';

/**
 * @file 级联选择器组件
 *
 * 基于Element UI的级联选择器进行封装，提供与JSON表单系统集成的能力
 * 支持动态属性配置、插槽自定义、表单校验等特性
 */
export default defineComponent({
    name: 'HCascader',
    components: {
        ElFormItem,
        ElCascader,
    },
    inheritAttrs: false,
    props,
    emits,
    // slots: Object as SlotsType<CascaderSlots>,
    setup(props, ctx) {
        const plain = usePlain(props);
        const { formItemActualProps, contentActualProps, slotProps } = useCommonSetup(props, ctx, plain);
        const { tempChecked, change } = useTempChecked(plain.checked);

        return {
            hyphenate,
            getNode,
            ...plain,
            formItemActualProps,
            contentActualProps,
            slotProps,
            tempChecked,
            change,
        };
    },
});
</script>

<style lang="css" scoped></style>
