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
import { useCommonSetup } from '../use';
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
