import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import type { checkboxEmits as elCheckboxEmits, checkboxProps as elCheckboxProps } from 'element-plus';
import { ElCheckboxGroup } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, DynamicProps, FormItemProps, StaticProps } from '../share';
import { commonProps, formItemProps } from '../share';

const elCheckboxGroupProps = ElCheckboxGroup.props as Obj2Props<ComponentProps<typeof ElCheckboxGroup>>;
const elCheckboxGroupEmits = emits2obj(ElCheckboxGroup.emits);

/** 组件传参 - 私有 */
export function checkboxGroupPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elCheckboxGroupProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elCheckboxGroupEmits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<T, CheckboxGroupSlotOption<T, Query, Option, OptionQuery>, Query, Option>,
        ...formItemProps as FormItemProps<Query, Option>,
        /** 组件静态属性(与 formItem 或内置的属性冲突时, 可通过该属性传递) */
        staticProps: { type: Object as PropType<StaticProps<_Prop>> },
        /** 组件动态属性 */
        dynamicProps: { type: Function as PropType<DynamicProps<_Prop, Query, Option>> },
        /** 展示的字段 */
        labelKey: { type: String as PropType<string>, default: 'label' },
        /** 提交的字段 */
        valueKey: { type: String as PropType<string>, default: 'value' },
        /** 按钮类型(checkbox|button), 默认 checkbox */
        type: { type: String as PropType<'checkbox' | 'button'> },
        /** 选项禁用字段 */
        disabledKey: { type: String as PropType<string>, default: 'disabled' },
        /** 暴露给 Checkbox 或 CheckboxButton 的属性 */
        itemProps: { type: Object as PropType<Partial<ExtractPublicPropTypes<ReturnType<typeof emits2props<typeof elCheckboxProps, [NonNullable<typeof elCheckboxEmits>]>>>>> },
    } as const;
}
/** 插槽配置项 */
export interface CheckboxGroupSlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    getFormItemProps: () => Partial<FormItemProps<Query, Option>>;
    getItemProps: () => Partial<ExtractPublicPropTypes<typeof elCheckboxGroupProps>>;
    getProps: () => CheckboxGroupProps<T, Query, Option, OptionQuery>;
    options: Option[];
    modelValue: T;
    onChange: (value: T) => void;
    checkboxType: 'ElCheckboxButton' | 'ElCheckbox';
    class: string;
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
}
/** 组件传参 - 私有 */
export const checkboxGroupPropsPrivate = checkboxGroupPropsGeneric();
/** 组件传参 - 外部调用 */
export const checkboxGroupProps = emits2props({
    ...elCheckboxGroupProps,
    ...checkboxGroupPropsPrivate,
}, elCheckboxGroupEmits) as typeof checkboxGroupPropsPrivate;
export type CheckboxGroupProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof checkboxGroupPropsGeneric<T, Query, Option, OptionQuery>>>;

/** 组件事件 - 私有 */
export function checkboxGroupEmitsGeneric<T>() {
    return {
        ...{} as typeof elCheckboxGroupEmits,
    };
}
/** 组件事件 - 私有 */
export const checkboxGroupEmitsPrivate = checkboxGroupEmitsGeneric();
/** 组件事件 - 外部调用 */
export const checkboxGroupEmits = {
    ...elCheckboxGroupEmits,
    ...checkboxGroupEmitsPrivate,
} as ReturnType<typeof checkboxGroupEmitsGeneric<any>>;
export type CheckboxGroupEmits<T> = ReturnType<typeof checkboxGroupEmitsGeneric<T>>;

export interface CheckboxGroupSlots extends CommonSlots<Record<string, any>> {
}
