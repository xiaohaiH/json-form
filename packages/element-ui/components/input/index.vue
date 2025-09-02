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
            <component :is="getNode(slots.before || $slots.before, slotProps)" />
        </template>
        <!-- 自定义内容插槽 -->
        <template v-if="slots.default">
            <component :is="getNode(slots.default, slotProps)" />
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
                @input="debounceChange"
                @keydown.native.enter="enterHandle"
            >
                <!-- 前置元素插槽 -->
                <template v-if="itemSlots.prepend" #prepend>
                    <component :is="getNode(itemSlots.prepend, slotProps)" />
                </template>
                <!-- 后置元素插槽 -->
                <template v-if="itemSlots.append" #append>
                    <component :is="getNode(itemSlots.append, slotProps)" />
                </template>
                <!-- 头部图标插槽 -->
                <template v-if="itemSlots.prefix" #prefix>
                    <component :is="getNode(itemSlots.prefix, slotProps)" />
                </template>
                <!-- 尾部图标插槽 -->
                <template v-if="itemSlots.suffix" #suffix>
                    <component :is="getNode(itemSlots.suffix, slotProps)" />
                </template>
                <!-- <template v-for="(item, slotName) of itemSlots" #[slotName]="row">
                    <component :is="getNode(item, { ...row, ...slotProps })" :key="slotName" />
                </template> -->
            </ElInput>
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
import { FormItem as ElFormItem, Input as ElInput } from 'element-ui';
import { computed, defineComponent, markRaw, ref, watch } from 'vue-demi';
import { getNode, pick } from '../../src/utils';
import { formItemPropKeys } from '../share';
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
         * 输入框静态属性
         * 合并从attrs中提取的属性和staticProps属性
         */
        const contentStaticProps = computed(() => ({ ...ctx.attrs, ...props.staticProps }));

        /**
         * 输入框实际属性
         * 合并静态属性和动态属性
         */
        const contentActualProps = computed(() => {
            const { query, dynamicProps } = props;
            return dynamicProps ? { ...contentStaticProps.value, ...dynamicProps({ query }) } : contentStaticProps.value;
        });

        // 使用核心库的usePlain钩子初始化数据和方法
        const plain = usePlain(props);
        const tempChecked = ref(plain.checked.value);
        watch(plain.checked, (value) => tempChecked.value = value);

        /**
         * 输入防抖处理
         * 根据配置决定是实时更新还是延迟更新
         *
         * @param {string} value - 输入的值
         */
        let timer = 0;
        function debounceChange(value: string) {
            if (value === tempChecked.value) return;
            const { debounceTime } = props;
            timer && clearTimeout(timer);
            tempChecked.value = value;

            debounceTime
                ? timer = setTimeout(() => plain.change(tempChecked.value), debounceTime) as unknown as number
                : plain.change(value);
        }

        /**
         * 回车事件处理
         * 更新值并触发搜索
         *
         * @param {Event | KeyboardEvent} ev - 键盘事件对象
         */
        function enterHandle(ev: Event | KeyboardEvent) {
            timer && clearTimeout(timer);
            plain.checked.value !== tempChecked.value && plain.updateCheckedValue(tempChecked.value);
            plain.wrapper?.search();
        }

        /**
         * 插槽属性
         * 提供给插槽内容的数据和方法
         */
        const slotProps = computed(() => ({
            getFormItemProps: () => formItemActualProps.value,
            getItemProps: () => contentActualProps.value,
            getProps: () => props,
            extraOptions: {
                value: tempChecked.value,
                options: plain.finalOption.value,
                onChange: debounceChange,
                onEnter: enterHandle,
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
