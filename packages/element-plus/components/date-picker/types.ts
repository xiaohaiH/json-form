import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import { ElDatePicker } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, DynamicProps, FormItemProps, StaticProps } from '../share';
import { commonProps, formItemProps } from '../share';

const elDatePickerProps = ElDatePicker.props as Obj2Props<ComponentProps<typeof ElDatePicker>>;
const elDatePickerEmits = emits2obj(ElDatePicker.emits);

/** 组件传参 - 私有 */
export function datePickerPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elDatePickerProps;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<T, DatePickerSlotOption<T, Query, Option, OptionQuery>, Query, Option>,
        ...formItemProps as FormItemProps<Query, Option>,
        /** 组件静态属性(与 formItem 或内置的属性冲突时, 可通过该属性传递) */
        staticProps: { type: Object as PropType<StaticProps<_Prop>> },
        /** 组件动态属性 */
        dynamicProps: { type: Function as PropType<DynamicProps<_Prop, Query, Option>> },
        /** 日期格式化的类型 */
        valueFormat: { type: String as PropType<string>, default: 'YYYY-MM-DD' },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            default: ((props: DatePickerSlotOption<T, Query, Option, OptionQuery>) => any);
            rangeSeparator: ((props: DatePickerSlotOption<T, Query, Option, OptionQuery>) => any);
            prevMonth: ((props: DatePickerSlotOption<T, Query, Option, OptionQuery>) => any);
            nextMonth: ((props: DatePickerSlotOption<T, Query, Option, OptionQuery>) => any);
            prevYear: ((props: DatePickerSlotOption<T, Query, Option, OptionQuery>) => any);
            nextYear: ((props: DatePickerSlotOption<T, Query, Option, OptionQuery>) => any);
        }>> },
    } as const;
}
/** 插槽配置项 */
export interface DatePickerSlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    getFormItemProps: () => Partial<FormItemProps<Query, Option>>;
    getItemProps: () => Partial<ExtractPublicPropTypes<typeof elDatePickerProps>>;
    getProps: () => DatePickerProps<T, Query, Option, OptionQuery>;
    options: Option[];
    modelValue: T;
    onChange: (value: T) => void;
    class: string;
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
}
/** 组件传参 - 私有 */
export const datePickerPropsPrivate = datePickerPropsGeneric();
/** 组件传参 - 外部调用 */

export const datePickerProps = emits2props({
    ...elDatePickerProps,
    ...datePickerPropsPrivate,
}) as typeof datePickerPropsPrivate;
export type DatePickerProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof datePickerPropsGeneric<T, Query, Option, OptionQuery>>>;

/** 组件事件 - 私有 */
export function datePickerEmitsGeneric<T>() {
    return {
        // ...{} as typeof elDatePickerEmits,
    };
}
/** 组件事件 - 私有 */
export const datePickerEmitsPrivate = datePickerEmitsGeneric();
/** 组件事件 - 外部调用 */
export const datePickerEmits = {
    change: (val: null | string | string[] | Date | Date[]) => true,
    blur: (ev: FocusEvent) => true,
    focus: (ev: FocusEvent) => true,
    clear: () => true,
    calendarChange: (val: [Date, null | Date]) => true,
    panelChange: (date: Date | [Date, Date], mode: 'month' | 'year', view?: string) => true,
    visibleChange: (visibility: boolean) => true,
    ...datePickerEmitsPrivate,
} as ReturnType<typeof datePickerEmitsGeneric<any>>;
export type DatePickerEmits<T> = ReturnType<typeof datePickerEmitsGeneric<T>>;

export interface DatePickerSlots extends CommonSlots<Record<string, any>> {
}
