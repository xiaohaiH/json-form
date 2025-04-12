import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import { timePickerDefaultProps as elTimePickerProps } from 'element-plus/es/components/time-picker/src/common/props';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, DynamicProps, FormItemProps, StaticProps } from '../share';
import { commonProps, formItemProps } from '../share';

/** 组件传参 - 私有 */
export function timePickerPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elTimePickerProps;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<T, TimePickerSlotOption<T, Query, Option, OptionQuery>, Query, Option>,
        ...formItemProps as FormItemProps<Query, Option>,
        /** 组件静态属性(与 formItem 或内置的属性冲突时, 可通过该属性传递) */
        staticProps: { type: Object as PropType<StaticProps<_Prop>> },
        /** 组件动态属性 */
        dynamicProps: { type: Function as PropType<DynamicProps<_Prop, Query, Option>> },
        /** 日期格式化的类型 */
        valueFormat: { type: String as PropType<string>, default: 'HH:mm:ss' },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
        }>> },
    } as const;
}
/** 插槽配置项 */
export interface TimePickerSlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    getFormItemProps: () => Partial<FormItemProps<Query, Option>>;
    getItemProps: () => Partial<ExtractPublicPropTypes<typeof elTimePickerProps>>;
    getProps: () => TimePickerProps<T, Query, Option, OptionQuery>;
    options: Option[];
    modelValue: T;
    onChange: (value: T) => void;
    class: string;
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
}
/** 组件传参 - 私有 */
export const timePickerPropsPrivate = timePickerPropsGeneric();
/** 组件传参 - 外部调用 */

export const timePickerProps = emits2props({
    ...elTimePickerProps,
    ...timePickerPropsPrivate,
}) as typeof timePickerPropsPrivate;
export type TimePickerProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof timePickerPropsGeneric<T, Query, Option, OptionQuery>>>;

/** 组件事件 - 私有 */
export function timePickerEmitsGeneric<T>() {
    return {
        // ...{} as typeof elTimePickerEmits,
    };
}
/** 组件事件 - 私有 */
export const timePickerEmitsPrivate = timePickerEmitsGeneric();
/** 组件事件 - 外部调用 */
export const timePickerEmits = {
    change: (val: number | string | Date | [number, number] | [string, string] | [Date, Date]) => true,
    blur: (ev: FocusEvent) => true,
    focus: (ev: FocusEvent) => true,
    clear: () => true,
    visibleChange: (visibility: boolean) => true,
    ...timePickerEmitsPrivate,
} as ReturnType<typeof timePickerEmitsGeneric<any>>;
export type TimePickerEmits<T> = ReturnType<typeof timePickerEmitsGeneric<T>>;

export interface TimePickerSlots extends CommonSlots<Record<string, any>> {
}
