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
            <component :is="getNode(slots.before || $slots.before, slotProps)" />
        </template>
        <!-- 自定义默认插槽内容 -->
        <template v-if="slots.default">
            <component :is="getNode(slots.default, slotProps)" />
        </template>
        <!-- 默认级联选择器渲染 -->
        <slot v-else v-bind="slotProps">
            <ElCascader
                :filterable="filterable"
                :clearable="clearable"
                :options="finalOption"
                :value="checked"
                class="json-form-item__content"
                v-bind="contentActualProps"
                v-on="$listeners"
                @input="change"
            >
                <!-- 级联选择器内部默认插槽 -->
                <template v-if="itemSlots.default" #default>
                    <component :is="getNode(itemSlots.default, slotProps)" />
                </template>
                <!-- 动态插槽支持 - 目前被注释 -->
                <!-- <template v-for="(item, slotName) of itemSlots" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item, { ...row, ...slotProps })" :key="slotName" />
                </template> -->
            </ElCascader>
        </slot>
        <!-- 表单项后置内容插槽 -->
        <template v-if="slots.after || $slots.after">
            <component :is="getNode(slots.after || $slots.after, slotProps)" />
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
import { computed, defineComponent, nextTick, reactive } from 'vue-demi';
import { getNode, pick } from '../../src/utils';
import { formItemPropKeys } from '../share';
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
        // 计算表单项静态属性
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

        // 计算插槽属性
        const slotProps = computed(() => ({
            getFormItemProps: () => formItemActualProps.value,
            getItemProps: () => contentActualProps.value,
            getProps: () => props,
            extraOptions: {
                value: plain.checked.value,
                options: plain.finalOption.value,
                onChange: insetChange,
            },
            plain,
        }));

        /**
         * 重写 change 事件
         * 防止存在默认值时, element-ui 组件清空值时
         * 内部马上重写会导致值更新了, ui 未更新
         */
        function insetChange(val: any) {
            if (!isEmptyValue(props.defaultValue) && isEmptyValue(val)) {
                (plain.checked as any).value = undefined;
                nextTick(() => plain.change(props.defaultValue));
            }
            else {
                plain.change(val);
            }
        }

        return {
            hyphenate,
            getNode,
            ...plain,
            formItemActualProps,
            contentActualProps,
            slotProps,
            insetChange,
        };
    },
});
</script>

<style lang="css" scoped></style>
