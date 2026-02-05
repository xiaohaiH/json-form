import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import { ElDatePicker } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

const elDatePickerProps = ElDatePicker.props as Obj2Props<ComponentProps<typeof ElDatePicker>>;
const elDatePickerEmits = emits2obj(ElDatePicker.emits);

/** 组件传参 - 私有 */
export function datePickerPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elDatePickerProps;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<Query, OptionQuery>,
        ...commonProps as CommonProps<_Prop, DatePickerSlotOption<Query, OptionQuery>, Query, OptionQuery>,
        ...formItemProps as FormItemProps<Query, OptionQuery>,
        /** 监听触发值改变的事件 @default update:modelValue */
        changeName: { type: String, default: 'update:modelValue' },
        /** 日期格式化的类型 */
        valueFormat: { type: String as PropType<string>, default: 'YYYY-MM-DD' },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            default: ComponentType<DatePickerSlotOption<Query, OptionQuery>>;
            rangeSeparator: ComponentType<DatePickerSlotOption<Query, OptionQuery>>;
            prevMonth: ComponentType<DatePickerSlotOption<Query, OptionQuery>>;
            nextMonth: ComponentType<DatePickerSlotOption<Query, OptionQuery>>;
            prevYear: ComponentType<DatePickerSlotOption<Query, OptionQuery>>;
            nextYear: ComponentType<DatePickerSlotOption<Query, OptionQuery>>;
        }>> },
    } as const;
}
/** 插槽配置项 */
export interface DatePickerSlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
}
/** 组件传参 - 私有 */
export const datePickerPropsPrivate = datePickerPropsGeneric();
/** 组件传参 - 外部调用 */

export const datePickerProps = emits2props({
    ...elDatePickerProps,
    ...datePickerPropsPrivate,
}) as typeof datePickerPropsPrivate;
export type DatePickerProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof datePickerPropsGeneric<Query, OptionQuery>>>;

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
