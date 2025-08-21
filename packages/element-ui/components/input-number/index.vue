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
            <!-- 不监听回车事件, 防止实际值与组件内部的值(会根据提供的精度等配置项而主动改变)不匹配 -->
            <!-- @keydown.enter="enterHandle" -->
            <ElInputNumber
                :value="checked === 0 ? 0 : checked || undefined"
                class="json-form-item__content"
                v-bind="contentActualProps"
                :disabled="globalReadonly || globalDisabled || contentActualProps.disabled"
                v-on="$listeners"
                @input="debounceChange"
            >
                <!-- 动态插槽支持 - 目前被注释 -->
                <!-- <template v-for="(item, slotName) of itemSlots" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item, { ...row, ...slotProps })" :key="slotName" />
                </template> -->
            </ElInputNumber>
        </slot>
        <!-- a表单项后置内容插槽 -->
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
import { computed, defineComponent, ref } from 'vue-demi';
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

        /**
         * 输入防抖处理函数
         * 根据realtime配置决定是立即触发变更还是延迟触发搜索
         *
         * @param {number|null|undefined} value - 输入的数字值
         */
        let timer = 0;
        function debounceChange(value: number | null | undefined) {
            const { realtime, waitTime } = props;
            // 清除现有计时器
            timer && clearTimeout(timer);

            if (realtime) {
                // 实时模式：立即触发值变更
                plain.change(value);
            }
            else {
                // 非实时模式：更新值但延迟触发搜索
                plain.updateCheckedValue(value);
                if (!plain.wrapper) return;
                // 设置延时搜索
                timer = setTimeout(plain.wrapper.insetSearch, waitTime) as unknown as number;
            }
        }

        /**
         * 回车键处理函数
         * 立即触发搜索，不等待延时
         * 注意：当前模板中此函数已被注释，不再使用
         *
         * @param {Event|KeyboardEvent} ev - 键盘事件对象
         */
        function enterHandle(ev: Event | KeyboardEvent) {
            // 清除现有计时器
            timer && clearTimeout(timer);
            // 直接从事件目标获取值并更新
            (plain.checked as any).value = (ev.target as HTMLInputElement).value;
            // 更新查询参数并触发搜索
            plain.option.updateWrapperQuery();
            plain.wrapper?.search();
        }

        // 计算插槽属性
        const slotProps = computed(() => ({
            getFormItemProps: () => formItemActualProps.value,
            getItemProps: () => contentActualProps.value,
            getProps: () => props,
            extraOptions: {
                value: plain.checked.value === 0 ? 0 : (plain.checked.value as number) || undefined,
                options: plain.finalOption.value,
                onChange: debounceChange,
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
            debounceChange,
            enterHandle,
        };
    },
});
</script>

<style lang="css" scoped></style>
