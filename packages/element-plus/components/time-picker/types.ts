import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import { timePickerDefaultProps as elTimePickerProps } from 'element-plus/es/components/time-picker/src/common/props';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

/** 组件传参 - 私有 */
export function timePickerPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elTimePickerProps;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<Query, OptionQuery>,
        ...commonProps as CommonProps<_Prop, TimePickerSlotOption<Query, OptionQuery>, Query, OptionQuery>,
        ...formItemProps as FormItemProps<Query, OptionQuery>,
        /** 日期格式化的类型 */
        valueFormat: { type: String as PropType<string>, default: 'HH:mm:ss' },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
        }>> },
    } as const;
}
/** 插槽配置项 */
export interface TimePickerSlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
}
/** 组件传参 - 私有 */
export const timePickerPropsPrivate = timePickerPropsGeneric();
/** 组件传参 - 外部调用 */

export const timePickerProps = emits2props({
    ...elTimePickerProps,
    ...timePickerPropsPrivate,
}) as typeof timePickerPropsPrivate;
export type TimePickerProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof timePickerPropsGeneric<Query, OptionQuery>>>;

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
