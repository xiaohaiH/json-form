import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import { ElCheckbox } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, DynamicProps, FormItemProps, StaticProps } from '../share';
import { commonProps, formItemProps } from '../share';

const elCheckboxProps = ElCheckbox.props as Obj2Props<ComponentProps<typeof ElCheckbox>>;
const elCheckboxEmits = emits2obj(ElCheckbox.emits);

/** 组件传参 - 私有 */
export function checkboxPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elCheckboxProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elCheckboxEmits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<T, CheckboxSlotOption<T, Query, Option, OptionQuery>, Query, Option>,
        ...formItemProps as FormItemProps<Query, Option>,
        /** 组件静态属性(与 formItem 或内置的属性冲突时, 可通过该属性传递) */
        staticProps: { type: Object as PropType<StaticProps<_Prop>> },
        /** 组件动态属性 */
        dynamicProps: { type: Function as PropType<DynamicProps<_Prop, Query, Option>> },
        /** 按钮类型(checkbox|button), 默认 checkbox */
        type: { type: String as PropType<'checkbox' | 'button'> },
    } as const;
}
/** 插槽配置项 */
export interface CheckboxSlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    getFormItemProps: () => Partial<FormItemProps<Query, Option>>;
    getItemProps: () => Partial<ExtractPublicPropTypes<typeof elCheckboxProps>>;
    getProps: () => CheckboxProps<T, Query, Option, OptionQuery>;
    options: Option[];
    modelValue: T;
    onChange: (value: T) => void;
    checkboxType: 'ElCheckboxButton' | 'ElCheckbox';
    class: string;
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
}
/** 组件传参 - 私有 */
export const checkboxPropsPrivate = checkboxPropsGeneric();
/** 组件传参 - 外部调用 */
export const checkboxProps = emits2props({
    ...elCheckboxProps,
    ...checkboxPropsPrivate,
}, elCheckboxEmits) as typeof checkboxPropsPrivate;
export type CheckboxProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof checkboxPropsGeneric<T, Query, Option, OptionQuery>>>;

/** 组件事件 - 私有 */
export function checkboxEmitsGeneric<T>() {
    return {
        ...{} as typeof elCheckboxEmits,
    };
}
/** 组件事件 - 私有 */
export const checkboxEmitsPrivate = checkboxEmitsGeneric();
/** 组件事件 - 外部调用 */
export const checkboxEmits = {
    ...elCheckboxEmits,
    ...checkboxEmitsPrivate,
};
export type CheckboxEmits<T> = ReturnType<typeof checkboxEmitsGeneric<T>>;

export interface CheckboxSlots extends CommonSlots<Record<string, any>> {
}
