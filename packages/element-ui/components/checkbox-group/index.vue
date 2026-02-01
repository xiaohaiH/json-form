<template>
    <!-- 复选框组表单项容器 -->
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child -->
    <ElFormItem
        v-if="!hide"
        :class="`json-form-item json-form-item--checkbox-group json-form-item--${field} json-form-item--${!!slots.postfix}`"
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
        <!-- 默认复选框组渲染 -->
        <slot v-else v-bind="slotProps">
            <ElCheckboxGroup
                :value="checked || []"
                class="json-form-item__content"
                v-bind="contentActualProps"
                :disabled="globalReadonly || globalDisabled || contentActualProps.disabled"
                v-on="$listeners"
                @input="change"
            >
                <!-- 遍历选项生成复选框 -->
                <template v-for="item of finalOption">
                    <component
                        :is="checkboxType" :key="item[valueKey]"
                        v-bind="itemProps"
                        :aria-label="item[labelKey]"
                        :label="item[valueKey]"
                        :value="item[valueKey]"
                        :disabled="item[disabledKey]"
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
            </ElCheckboxGroup>
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
import { hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { Checkbox as ElCheckbox, CheckboxButton as ElCheckboxButton, CheckboxGroup as ElCheckboxGroup, FormItem as ElFormItem } from 'element-ui';
// import type { SlotsType } from 'vue-demi';
import type { Ref } from 'vue-demi';
import { computed, defineComponent, ref } from 'vue-demi';
import { getNode, pick } from '../../src/utils';
import { useCommonSetup } from '../use';
import type { CheckboxGroupSlots } from './types';
import { checkboxGroupEmitsPrivate as emits, checkboxGroupPropsPrivate as props } from './types';

/**
 * @file 复选框组组件
 *
 * 基于Element UI的复选框组进行封装，提供与JSON表单系统集成的能力
 * 支持动态属性配置、插槽自定义、表单校验等特性
 * 可切换普通复选框和按钮式复选框
 */
export default defineComponent({
    name: 'HCheckboxGroup',
    components: {
        ElFormItem,
        ElCheckboxGroup,
        ElCheckboxButton,
        ElCheckbox,
    },
    inheritAttrs: false,
    props,
    emits,
    // slots: Object as SlotsType<CheckboxGroupSlots>,
    setup(props, ctx) {
        // 根据type属性决定使用普通复选框还是按钮式复选框
        const checkboxType = computed(() => (props.type === 'button' ? 'ElCheckboxButton' : 'ElCheckbox'));

        const plain = usePlain(props);
        const { formItemActualProps, contentActualProps, slotProps } = useCommonSetup(props, ctx, plain);
        // 重写声明, 防止报错
        const finalOption = plain.finalOption as Ref<any[]>;

        return {
            hyphenate,
            getNode,
            checkboxType,
            ...plain,
            formItemActualProps,
            contentActualProps,
            slotProps,
            finalOption,
        };
    },
});
</script>

<style lang="css" scoped></style>
