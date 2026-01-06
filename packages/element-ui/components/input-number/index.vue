<template>
    <!-- 数字输入框表单项容器 -->
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child -->
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--input-number json-form-item--${field} json-form-item--${!!slots.postfix}`"
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
        <!-- 默认数字输入框渲染 -->
        <slot v-else v-bind="slotProps">
            <ElInputNumber
                :value="tempChecked === 0 ? 0 : tempChecked || undefined"
                class="json-form-item__content"
                v-bind="contentActualProps"
                :disabled="globalReadonly || globalDisabled || contentActualProps.disabled"
                v-on="$listeners"
                @input="debounceChange"
                @keydown.enter="enterHandle"
            >
                <!-- 动态插槽支持 - 目前被注释 -->
                <!-- <template v-for="(item, slotName) of itemSlots" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item, { ...row, ...slotProps })" :key="slotName" />
                </template> -->
            </ElInputNumber>
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
import { FormItem as ElFormItem, InputNumber as ElInputNumber } from 'element-ui';
import { computed, defineComponent, ref, watch } from 'vue-demi';
import { getNode, pick } from '../../src/utils';
import { formItemPropKeys } from '../share';
import type { InputNumberSlots } from './types';
import { inputNumberEmitsPrivate as emits, inputNumberPropsPrivate as props } from './types';

/**
 * @file 数字输入框组件
 *
 * 基于Element UI的数字输入框进行封装，提供与JSON表单系统集成的能力
 * 支持动态属性配置、插槽自定义、表单校验等特性
 * 提供防抖动和实时搜索支持
 */
export default defineComponent({
    name: 'HInputNumber',
    components: {
        ElFormItem,
        ElInputNumber,
    },
    inheritAttrs: false,
    props,
    emits,
    // slots: Object as SlotsType<InputNumberSlots>,
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
        const tempChecked = ref(plain.checked.value);
        watch(plain.checked, (value) => tempChecked.value = value);

        /**
         * 输入防抖处理函数
         * 根据realtime配置决定是立即触发变更还是延迟触发搜索
         *
         * @param {number|null|undefined} value - 输入的数字值
         */
        let timer = 0;
        function debounceChange(value: number | null | undefined) {
            if (value === tempChecked.value) return;
            const { debounceTime } = props;
            timer && clearTimeout(timer);
            tempChecked.value = value;

            debounceTime
                ? timer = setTimeout(() => changeCallback(tempChecked.value), debounceTime) as unknown as number
                : changeCallback(value);
        }
        /** 防止值改变失败时, 输入框与实际值不一致 */
        function changeCallback(value: number | null | undefined) {
            const _value = plain.checked.value;
            plain.change(value);
            // /** 当更新后的值与现有的相等时, 说明内部逻辑做特殊处理了(比如重置为默认值等操作) */
            plain.checked.value === _value && (tempChecked.value = _value);
        }

        /**
         * 回车键处理函数
         * 立即触发搜索，不等待延时
         * 注意：当前模板中此函数已被注释，不再使用
         *
         * @param {Event|KeyboardEvent} ev - 键盘事件对象
         */
        function enterHandle(ev: Event | KeyboardEvent) {
            timer && clearTimeout(timer);
            plain.checked.value !== tempChecked.value && plain.updateCheckedValue(tempChecked.value);
            plain.wrapper?.search();
        }

        // 计算插槽属性
        const slotProps = computed(() => ({
            getFormItemProps: () => formItemActualProps.value,
            getItemProps: () => contentActualProps.value,
            getProps: () => props,
            extraOptions: {
                value: tempChecked.value === 0 ? 0 : (tempChecked.value as number) || undefined,
                options: plain.finalOption.value,
                onChange: debounceChange,
            },
            plain,
        }));

        return {
            hyphenate,
            getNode,
            ...plain,
            tempChecked,
            formItemActualProps,
            contentActualProps,
            slotProps,
            debounceChange,
            enterHandle,
        };
    },
});
</script>

<style lang="css" scoped></style>
