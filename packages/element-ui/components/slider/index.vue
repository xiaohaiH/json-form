<template>
    <!--
      滑块表单项容器
      禁用Vue ESLint规则以避免检查废弃API的使用，保持与Vue2兼容
    -->
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child -->
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--slider json-form-item--${field} json-form-item--${!!slots.postfix}`"
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
        <!-- 默认滑块渲染 -->
        <slot v-else v-bind="slotProps">
            <ElSlider
                :value="checked"
                class="json-form-item__content"
                v-bind="contentActualProps"
                v-on="$listeners"
                @input="change"
            />
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
import { hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { FormItem as ElFormItem, Slider as ElSlider } from 'element-ui';
import { computed, defineComponent, reactive, ref } from 'vue-demi';
import { getNode, pick } from '../../src/utils';
import { formItemPropKeys } from '../share';
import type { SliderSlots } from './types';
import { sliderEmitsPrivate as emits, sliderPropsPrivate as props } from './types';

/**
 * @file 滑块组件
 *
 * 基于Element UI的滑块组件进行封装，提供与JSON表单系统集成的能力
 * 支持动态属性配置、插槽自定义、表单校验等特性
 */
export default defineComponent({
    name: 'HSlider',
    components: {
        ElFormItem,
        ElSlider,
    },
    inheritAttrs: false,
    props,
    emits,
    // slots: Object as SlotsType<SliderSlots>,
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

        // 使用核心库的usePlain钩子处理组件状态和逻辑
        const plain = usePlain(props);

        // 计算插槽属性，用于传递给插槽组件
        const slotProps = computed(() => ({
            getFormItemProps: () => formItemActualProps.value,
            getItemProps: () => contentActualProps.value,
            getProps: () => props,
            options: plain.finalOption.value,
            value: plain.checked.value,
            onChange: plain.change,
            class: 'json-form-item__content',
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
