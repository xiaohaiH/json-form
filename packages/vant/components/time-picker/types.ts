import type { emits2obj, PlainProps } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import type { Popup as VanPopup } from 'vant';
import { Field as VanField, TimePicker as VanTimePicker } from 'vant';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentEmit, ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { PickerOption } from '../picker/types';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType } from '../share';
import { commonProps } from '../share';

/** 组件传参 - 私有 */
export function timePickerPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    return {
        ...commonProps as CommonProps<Query, OptionQuery>,
        ...plainProps as PlainProps<Query, OptionQuery>,
        /** VanTimePicker 组件的属性 */
        timePickerProps: { type: Object as PropType<Partial<ComponentProps<typeof VanTimePicker>>> },
        /** VanTimePicker 组件的事件 - 兼容 vue2 版本 */
        timePickerOn: { type: Object as PropType<Partial<ReturnType<typeof emits2obj<NonNullable<typeof VanTimePicker.emits>>>>>, default: () => ({}) },
        /** VanTimePicker 组件的插槽 */
        timePickerSlots: { type: Object as PropType<{
            /** 自定义整个顶部栏的内容 */
            toolbar?: ComponentType<CommonSlotsProps<any, any>>;
            /** 自定义标题内容 */
            title?: ComponentType<CommonSlotsProps<any, any>>;
            /** 自定义确认按钮内容 */
            confirm?: ComponentType<CommonSlotsProps<any, any>>;
            /** 自定义取消按钮内容 */
            cancel?: ComponentType<CommonSlotsProps<any, any>>;
            /** 自定义选项内容 */
            option?: ComponentType<{ option: PickerOption; index: number } & CommonSlotsProps<any, any>>;
            /** 自定义选项上方内容 */
            columnsTop?: ComponentType<CommonSlotsProps<any, any>>;
            /** 自定义选项下方内容 */
            columnsBottom?: ComponentType<CommonSlotsProps<any, any>>;
        }> },
        /** 是否展示右侧箭头并开启点击反馈 - Field 字段, 调整默认值 */
        isLink: { type: Boolean, default: true },
        /** 点击事件, 当传递了此事件时, 会忽略内部打开弹窗操作 */
        onRowClick: { type: Function as PropType<(option: { open: () => void; close: () => void }, ev: MouseEvent) => void> },
        /** 日期分隔符 @default : */
        separator: { type: String, default: ':' },
        /** 对值进行格式化 - 显示在页面上的值 */
        format: { type: Function as PropType<(option: string[], separator: string) => any>, default: valueFormatDefault },
        /** 对值进行格式化 - 提交值 */
        valueFormat: { type: Function as PropType<(option: string[], separator: string) => any>, default: valueFormatDefault },
        /** 取消值的格式化 - 给 VanDatePicker 的值 */
        valueUnformat: { type: Function as PropType<(option: any, separator: string) => string[]>, default: valueUnformatDefault },
        /** 值触发方式 @default confirm */
        valueTrigger: { type: String as PropType<'change' | 'confirm' | 'cancel'>, default: 'confirm' },
        /** 弹窗组件的属性 */
        popupProps: { type: Object as PropType<Partial<ComponentExposed<typeof VanPopup>>> },
        /** 弹窗组件的事件 - 兼容 vue2 版本 */
        popupOn: { type: Object as PropType<Partial<ReturnType<typeof emits2obj<NonNullable<typeof VanPopup.emits>>>>>, default: () => ({}) },
    } as const;
}
/** 组件传参 - 私有 */
export const timePickerPropsPrivate = timePickerPropsGeneric();
/** 组件传参 - 外部调用 */
export const timePickerProps = {
    ...VanField.props as unknown as {},
    ...timePickerPropsPrivate,
};
export type TimePickerProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof timePickerPropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function timePickerEmitsGeneric<T>() {
    return {};
}
/** 组件事件 - 私有 */
export const timePickerEmitsPrivate = timePickerEmitsGeneric();
/** 组件事件 - 外部调用 */
export const timePickerEmits = {
    ...VanField.emits,
    ...timePickerEmitsPrivate,
};

export type TimePickerEmits<T> = ReturnType<typeof timePickerEmitsGeneric<T>>;

export interface TimePickerSlots extends CommonSlots<any> {
}

/** 默认的合并函数 */
function valueFormatDefault(option: string[], separator: string) {
    return option.join(separator);
}
/** 默认的取消格式化函数 */
function valueUnformatDefault(val: string, separator: string) {
    if (!val) return [];
    return Array.isArray(val) ? val : val.split(separator);
}
