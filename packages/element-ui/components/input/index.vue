<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child vue/no-deprecated-v-on-native-modifier -->
    <!-- 表单项容器 -->
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--input json-form-item--${field} json-form-item--${!!slots.postfix}`"
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
        <!-- 默认输入框组件 -->
        <slot v-else v-bind="slotProps">
            <ElInput
                :clearable="clearable"
                :value="tempChecked"
                class="json-form-item__content"
                v-bind="contentActualProps"
                :readonly="globalReadonly || contentActualProps.readonly"
                :disabled="globalDisabled || contentActualProps.disabled"
                v-on="$listeners"
                @input="change"
                @keydown.native.enter="enterHandle"
            >
                <!-- 前置元素插槽 -->
                <template v-if="itemSlots.prepend" #prepend>
                    <component :is="getNode(itemSlots.prepend, slotProps)" v-bind="slotProps" />
                </template>
                <!-- 后置元素插槽 -->
                <template v-if="itemSlots.append" #append>
                    <component :is="getNode(itemSlots.append, slotProps)" v-bind="slotProps" />
                </template>
                <!-- 头部图标插槽 -->
                <template v-if="itemSlots.prefix" #prefix>
                    <component :is="getNode(itemSlots.prefix, slotProps)" v-bind="slotProps" />
                </template>
                <!-- 尾部图标插槽 -->
                <template v-if="itemSlots.suffix" #suffix>
                    <component :is="getNode(itemSlots.suffix, slotProps)" v-bind="slotProps" />
                </template>
                <!-- <template v-for="(item, slotName) of itemSlots" #[slotName]="row">
                    <component :is="getNode(item, { ...row, ...slotProps })" v-bind="slotProps" :key="slotName" />
                </template> -->
            </ElInput>
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
import { FormItem as ElFormItem, Input as ElInput } from 'element-ui';
import { computed, defineComponent, markRaw, ref, watch } from 'vue-demi';
import { getNode, pick } from '../../src/utils';
import { useCommonSetup, useTempChecked } from '../use';
import type { InputSlots } from './types';
import { inputEmitsPrivate as emits, inputPropsPrivate as props } from './types';

/**
 * 输入框组件
 *
 * 基于Element UI的Input组件进行封装，提供更丰富的功能和更灵活的配置
 * 支持表单项配置、动态属性、插槽定制等特性
 */
export default defineComponent({
    name: 'HInput',
    components: {
        ElFormItem,
        ElInput,
    },
    inheritAttrs: false,
    props,
    emits,
    // slots: Object as SlotsType<InputSlots>,
    setup(props, ctx) {
        const plain = usePlain(props);
        const { formItemActualProps, contentActualProps, slotProps } = useCommonSetup(props, ctx, plain);
        const { tempChecked, changeSync } = useTempChecked(plain.checked);
        /**
         * 输入防抖处理
         * 根据配置决定是实时更新还是延迟更新
         *
         * @param {string} value - 输入的值
         */
        let timer = 0;
        function change(value: string) {
            if (value === tempChecked.value) return;
            const { debounceTime } = props;
            timer && clearTimeout(timer);
            tempChecked.value = value;

            debounceTime
                ? timer = setTimeout(() => changeSync(tempChecked.value), debounceTime) as unknown as number
                : changeSync(value);
        }

        /**
         * 回车事件处理
         * 更新值并触发搜索
         *
         * @param {Event | KeyboardEvent} ev - 键盘事件对象
         */
        function enterHandle(ev: Event | KeyboardEvent) {
            timer && clearTimeout(timer);
            plain.checked.value !== tempChecked.value && (plain.checked.value = tempChecked.value);
            plain.wrapper?.search();
        }

        return {
            hyphenate,
            getNode,
            ...plain,
            formItemActualProps,
            contentActualProps,
            slotProps,
            tempChecked,
            change,
            enterHandle,
        };
    },
});
</script>

<style lang="css" scoped></style>
