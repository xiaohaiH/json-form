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
            <component :is="getNode(slots.before || $slots.before, slotProps)" />
        </template>
        <!-- 自定义默认插槽内容 -->
        <template v-if="slots.default">
            <component :is="getNode(slots.default, slotProps)" />
        </template>
        <!-- 默认复选框组渲染 -->
        <slot v-else v-bind="slotProps">
            <ElCheckboxGroup
                :value="checked || []"
                class="json-form-item__content"
                v-bind="contentActualProps"
                v-on="$listeners"
                @input="change"
            >
                <!-- 遍历选项生成复选框 -->
                <template v-for="item of finalOption">
                    <component
                        :is="checkboxType" :key="item[valueKey]"
                        v-bind="itemProps"
                        :aria-label="item[labelKey]"
                        :label="item[labelKey]"
                        :value="item[valueKey]"
                        :disabled="item[disabledKey]"
                    >
                        {{ item[labelKey] }}
                    </component>
                </template>
            </ElCheckboxGroup>
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
import { Checkbox as ElCheckbox, CheckboxButton as ElCheckboxButton, CheckboxGroup as ElCheckboxGroup, FormItem as ElFormItem } from 'element-ui';
// import type { SlotsType } from 'vue-demi';
import type { Ref } from 'vue-demi';
import { computed, defineComponent, ref } from 'vue-demi';
import { getNode, pick } from '../../src/utils';
import { formItemPropKeys } from '../share';
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
        // 重写声明, 防止报错
        const finalOption = plain.finalOption as Ref<any[]>;

        // 计算插槽属性
        const slotProps = computed(() => ({
            getFormItemProps: () => formItemActualProps.value,
            getItemProps: () => contentActualProps.value,
            getProps: () => props,
            options: plain.finalOption.value,
            value: plain.checked.value,
            onChange: plain.change,
            checkboxType: checkboxType.value,
            class: 'json-form-item__content',
            plain,
        }));

        return {
            hyphenate,
            getNode,
            checkboxType,
            ...plain,
            finalOption,
            formItemActualProps,
            contentActualProps,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>
