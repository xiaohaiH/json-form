<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child -->
    <!-- 开关组件的表单项容器，当不隐藏时显示 -->
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--switch json-form-item--${field} json-form-item--${!!slots.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <!-- 前置内容插槽 -->
        <template v-if="slots.before || $slots.before">
            <component :is="getNode(slots.before || $slots.before, slotProps)" v-bind="slotProps" />
        </template>
        <!-- 默认插槽自定义内容 -->
        <template v-if="slots.default">
            <component :is="getNode(slots.default, slotProps)" v-bind="slotProps" />
        </template>
        <!-- 无默认插槽时，显示开关组件 -->
        <slot v-else v-bind="slotProps">
            <ElSwitch
                :value="checked"
                class="json-form-item__content"
                v-bind="contentActualProps"
                :disabled="globalReadonly || globalDisabled || contentActualProps.disabled"
                v-on="$listeners"
                @change="change"
            />
        </slot>
        <!-- 后置内容插槽 -->
        <template v-if="slots.after || $slots.after">
            <component :is="getNode(slots.after || $slots.after, slotProps)" v-bind="slotProps" />
        </template>
        <!-- 后缀插槽，用于展示额外信息 -->
        <div v-if="slots.postfix || $slots.postfix" class="json-form-item__postfix">
            <component :is="getNode(slots.postfix || $slots.postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { FormItem as ElFormItem, Switch as ElSwitch } from 'element-ui';
import { computed, defineComponent, ref } from 'vue-demi';
import { getNode, pick } from '../../src/utils';
import { formItemPropKeys } from '../share';
import type { SwitchSlots } from './types';
import { switchEmitsPrivate as emits, switchPropsPrivate as props } from './types';

/**
 * HSwitch 开关组件
 *
 * 该组件封装了Element UI的ElSwitch组件，提供了一个带表单项的开关控件
 * 支持所有ElSwitch的属性和事件，并扩展了一些额外功能
 */
export default defineComponent({
    name: 'HSwitch',
    // 注册使用的组件
    components: {
        ElFormItem,
        ElSwitch,
    },
    // 不继承属性到根元素
    inheritAttrs: false,
    // 组件属性定义
    props,
    // 组件事件定义
    emits,
    // slots: Object as SlotsType<SwitchSlots>,
    setup(props, ctx) {
        /**
         * 表单项的静态属性
         * 合并基础属性和formItemProps
         */
        const formItemStaticProps = computed(() => {
            const { formItemProps } = props;
            return { ...pick(props, formItemPropKeys), ...formItemProps };
        });

        /**
         * 表单项的实际属性
         * 根据是否有动态属性函数决定最终属性
         */
        const formItemActualProps = computed(() => {
            const { query, formItemDynamicProps } = props;
            return formItemDynamicProps ? { ...formItemStaticProps.value, ...formItemDynamicProps({ query }) } : formItemStaticProps.value;
        });

        /**
         * 开关内容的静态属性
         * 合并attrs和staticProps
         */
        const contentStaticProps = computed(() => ({ ...ctx.attrs, ...props.staticProps }));

        /**
         * 开关内容的实际属性
         * 根据是否有动态属性函数决定最终属性
         */
        const contentActualProps = computed(() => {
            const { query, dynamicProps } = props;
            return dynamicProps ? { ...contentStaticProps.value, ...dynamicProps({ query }) } : contentStaticProps.value;
        });

        /**
         * 使用plain辅助函数处理开关的值和状态
         */
        const plain = usePlain(props);

        /**
         * 插槽属性
         * 提供给插槽内容的上下文数据和方法
         */
        const slotProps = computed(() => ({
            /** 获取表单项属性 */
            getFormItemProps: () => formItemActualProps.value,
            /** 获取开关内容属性 */
            getItemProps: () => contentActualProps.value,
            /** 获取全部属性 */
            getProps: () => props,
            extraOptions: {
                /** 当前值 */
                value: plain.checked.value,
                /** 选项列表 */
                options: plain.finalOption.value,
                /** 值变更函数 */
                onChange: plain.change,
            },
            /** plain工具对象 */
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
