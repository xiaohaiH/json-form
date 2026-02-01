<template>
    <!-- 单选框组表单项容器 -->
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child vue/no-deprecated-v-on-native-modifier -->
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--radio-group json-form-item--${field} json-form-item--${!!slots.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <!-- 表单项前置内容插槽 -->
        <template v-if="slots.before || $slots.before">
            <component :is="getNode(slots.before || $slots.before)" v-bind="slotProps" />
        </template>
        <!-- 自定义默认插槽内容 -->
        <template v-if="slots.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <!-- 默认单选框组渲染 -->
        <slot v-else v-bind="slotProps">
            <ElRadioGroup
                :value="checked"
                class="json-form-item__content"
                v-bind="contentActualProps"
                :disabled="globalReadonly || globalDisabled || contentActualProps.disabled"
                @input="change"
                v-on="$listeners"
            >
                <!-- 遍历选项生成单选框 -->
                <template v-for="item of finalOption">
                    <component
                        :is="radioType" :key="item[valueKey]"
                        v-bind="itemProps"
                        :label="item[valueKey]"
                        :value="item[valueKey]"
                        :disabled="item[disabledKey]"
                        @[eventName].native.prevent="customChange(item[valueKey], checked)"
                    >
                        {{ item[labelKey] }}
                        <!-- <template v-for="(option, slotName) of itemSlots" :key="slotName" #[hyphenate(slotName)]="row">
                            <component :is="getNode(option)" v-bind="slotProps" v-bind.prop="row" :option="item" :labelKey="labelKey" :valueKey="valueKey" :disabledKey="disabledKey" />
                        </template> -->
                        <template v-if="itemSlots.default" #default>
                            <component :is="getNode(itemSlots.default, { ...slotProps, option: item, labelKey, valueKey })" v-bind="slotProps" :option="item" :label-key="labelKey" :value-key="valueKey" />
                        </template>
                    </component>
                </template>
            </ElRadioGroup>
        </slot>
        <!-- 表单项后置内容插槽 -->
        <template v-if="slots.after || $slots.after">
            <component :is="getNode(slots.after || $slots.after)" v-bind="slotProps" />
        </template>
        <!-- 表单项额外后缀插槽 -->
        <div v-if="slots.postfix || $slots.postfix" class="json-form-item__postfix">
            <component :is="getNode(slots.postfix || $slots.postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { FormItem as ElFormItem, Radio as ElRadio, RadioButton as ElRadioButton, RadioGroup as ElRadioGroup } from 'element-ui';
// import type { SlotsType } from 'vue-demi';
import type { Ref } from 'vue-demi';
import { computed, defineComponent, ref } from 'vue-demi';
import { getNode, pick } from '../../src/utils';
import { useCommonSetup } from '../use';
import type { RadioGroupSlots } from './types';
import { radioGroupEmitsPrivate as emits, radioGroupPropsPrivate as props } from './types';

/**
 * @file 单选框组组件
 *
 * 基于Element UI的单选框组进行封装，提供与JSON表单系统集成的能力
 * 支持动态属性配置、插槽自定义、表单校验等特性
 * 可切换普通单选框和按钮式单选框，支持可取消选择功能
 */
export default defineComponent({
    name: 'HRadioGroup',
    components: {
        ElFormItem,
        ElRadioGroup,
        ElRadioButton,
        ElRadio,
    },
    inheritAttrs: false,
    props,
    emits,
    // slots: Object as SlotsType<RadioGroupSlots>,
    setup(props, ctx) {
        // 根据type属性决定使用普通单选框还是按钮式单选框
        const radioType = computed(() => (props.type === 'button' ? 'ElRadioButton' : 'ElRadio'));
        // 根据cancelable属性决定是否监听点击事件实现可取消选择
        // 如果不可取消，则返回null（不监听事件）
        const eventName = computed(() => (props.cancelable ? 'click' : null));

        const plain = usePlain(props);
        const { formItemActualProps, contentActualProps, slotProps } = useCommonSetup(props, ctx, plain);
        // 重写声明, 防止报错
        const finalOption = plain.finalOption as Ref<any[]>;

        /**
         * 自定义单选框选中事件处理
         * 实现可取消选择功能：如果点击当前已选中的选项，则清空选择
         *
         * @param {string} newVal - 点击的选项值
         * @param {string} currentVal - 当前已选中的值
         */
        function customChange(newVal: string, currentVal: any) {
            // 如果点击的是当前已选中项，则设置为空值；否则设置为新值
            const val = newVal === currentVal ? '' : newVal;
            plain.change(val);
            val === '' && (document.activeElement as HTMLInputElement)?.blur?.();
        }

        return {
            hyphenate,
            getNode,
            ...plain,
            formItemActualProps,
            contentActualProps,
            slotProps,
            finalOption,
            radioType,
            eventName,
            customChange,
        };
    },
});
</script>

<style lang="css" scoped></style>
