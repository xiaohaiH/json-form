import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import type { radioEmits as elRadioEmits, radioProps as elRadioProps } from 'element-plus';
import { radioGroupEmits as elRadioGroupEmits, radioGroupProps as elRadioGroupProps } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, DynamicProps, FormItemProps, StaticProps } from '../share';
import { commonProps, formItemProps } from '../share';

/** 组件传参 - 私有 */
export function radioGroupPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elRadioGroupProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elRadioGroupEmits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<T, RadioGroupSlotOption<T, Query, Option, OptionQuery>, Query, Option>,
        ...formItemProps as FormItemProps<Query, Option>,
        /** 组件静态属性(与 formItem 或内置的属性冲突时, 可通过该属性传递) */
        staticProps: { type: Object as PropType<StaticProps<_Prop>> },
        /** 组件动态属性 */
        dynamicProps: { type: Function as PropType<DynamicProps<_Prop, Query, Option>> },
        /** 展示的字段 */
        labelKey: { type: String as PropType<string>, default: 'label' },
        /** 提交的字段 */
        valueKey: { type: String as PropType<string>, default: 'value' },
        /** 按钮类型(radio|button), 默认 radio */
        type: { type: String as PropType<'radio' | 'button'> },
        /** 选中状态是否可以被取消 */
        cancelable: { type: Boolean as PropType<boolean>, default: undefined },
        /** 选项禁用字段 */
        disabledKey: { type: String as PropType<string>, default: 'disabled' },
        /** 暴露给 Radio 或 RadioButton 的属性 */
        itemProps: { type: Object as PropType<Partial<ExtractPublicPropTypes<ReturnType<typeof emits2props<typeof elRadioProps, [NonNullable<typeof elRadioEmits>]>>>>> },
    } as const;
}
/** 插槽配置项 */
export interface RadioGroupSlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    getFormItemProps: () => Partial<FormItemProps<Query, Option>>;
    getItemProps: () => Partial<ExtractPublicPropTypes<typeof elRadioGroupProps>>;
    getProps: () => RadioGroupProps<T, Query, Option, OptionQuery>;
    options: Option[];
    modelValue: T;
    onChange: (value: T) => void;
    onCancelable: (newVal: T, currentVal: T, cb: (value: T) => void) => void;
    radioType: 'ElRadioButton' | 'ElRadio';
    class: string;
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
}
/** 组件传参 - 私有 */
export const radioGroupPropsPrivate = radioGroupPropsGeneric();
/** 组件传参 - 外部调用 */

export const radioGroupProps = emits2props({
    ...elRadioGroupProps,
    ...radioGroupPropsPrivate,
}, elRadioGroupEmits) as typeof radioGroupPropsPrivate;
export type RadioGroupProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof radioGroupPropsGeneric<T, Query, Option, OptionQuery>>>;

/** 组件事件 - 私有 */
export function radioGroupEmitsGeneric<T>() {
    return {
        ...{} as typeof elRadioGroupEmits,
    };
}
/** 组件事件 - 私有 */
export const radioGroupEmitsPrivate = radioGroupEmitsGeneric();
/** 组件事件 - 外部调用 */
export const radioGroupEmits = {
    ...elRadioGroupEmits,
    ...radioGroupEmitsPrivate,
} as ReturnType<typeof radioGroupEmitsGeneric<any>>;
export type RadioGroupEmits<T> = ReturnType<typeof radioGroupEmitsGeneric<T>>;

export interface RadioGroupSlots extends CommonSlots<Record<string, any>> {
}
