import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import { radioEmits as elRadioEmits, radioProps as elRadioProps } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, DynamicProps, FormItemProps, StaticProps } from '../share';
import { commonProps, formItemProps } from '../share';

/** 组件传参 - 私有 */
export function radioPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elRadioProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elRadioEmits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<T, RadioSlotOption<T, Query, Option, OptionQuery>, Query, Option>,
        ...formItemProps as FormItemProps<Query, Option>,
        /** 组件静态属性(与 formItem 或内置的属性冲突时, 可通过该属性传递) */
        staticProps: { type: Object as PropType<StaticProps<_Prop>> },
        /** 组件动态属性 */
        dynamicProps: { type: Function as PropType<DynamicProps<_Prop, Query, Option>> },
        /**
         * 按钮类型(radio|button), 默认 radio
         * @deprecated element-plus 设计缺陷(单个 ElRadioButton 无法触发事件)
         */
        type: { type: String as PropType<'radio' | 'button'> },
        /** 选中状态是否可以被取消 */
        cancelable: { type: Boolean as PropType<boolean>, default: undefined },
    } as const;
}
/** 插槽配置项 */
export interface RadioSlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    getFormItemProps: () => Partial<FormItemProps<Query, Option>>;
    getItemProps: () => Partial<ExtractPublicPropTypes<typeof elRadioProps>>;
    getProps: () => RadioProps<T, Query, Option, OptionQuery>;
    options: Option[];
    modelValue: T;
    onChange: (value: T) => void;
    onCancelable: (newVal: T, currentVal: T, cb: (value: T) => void) => void;
    radioType: 'ElRadioButton' | 'ElRadio';
    class: string;
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
}
/** 组件传参 - 私有 */
export const radioPropsPrivate = radioPropsGeneric();
/** 组件传参 - 外部调用 */

export const radioProps = emits2props({
    ...elRadioProps,
    ...radioPropsPrivate,
}, elRadioEmits) as typeof radioPropsPrivate;
export type RadioProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof radioPropsGeneric<T, Query, Option, OptionQuery>>>;

/** 组件事件 - 私有 */
export function radioEmitsGeneric<T>() {
    return {
        ...{} as typeof elRadioEmits,
    };
}
/** 组件事件 - 私有 */
export const radioEmitsPrivate = radioEmitsGeneric();
/** 组件事件 - 外部调用 */
export const radioEmits = {
    ...elRadioEmits,
    ...radioEmitsPrivate,
} as ReturnType<typeof radioEmitsGeneric<any>>;
export type RadioEmits<T> = ReturnType<typeof radioEmitsGeneric<T>>;

export interface RadioSlots extends CommonSlots<Record<string, any>> {
}
