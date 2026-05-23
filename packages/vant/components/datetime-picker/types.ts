import type { emits2obj, PlainProps } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import type { Popup as VanPopup } from 'vant';
import { DatetimePicker as VanDatetimePicker, Field as VanField } from 'vant';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentEmit, ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType } from '../share';
import { commonProps } from '../share';

/** 组件传参 - 私有 */
export function datetimePickerPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    return {
        ...commonProps as CommonProps<Query, OptionQuery>,
        ...plainProps as PlainProps<Query, OptionQuery>,
        /** VanDatetimePicker 组件的属性 */
        datetimePickerProps: { type: Object as PropType<Partial<ComponentProps<typeof VanDatetimePicker>>> },
        /** VanDatetimePicker 组件的事件 - 兼容 vue2 版本 */
        datetimePickerOn: { type: Object as PropType<Partial<ReturnType<typeof emits2obj<NonNullable<typeof VanDatetimePicker.emits>>>>>, default: () => ({}) },
        /** VanDatetimePicker 组件的插槽 */
        datetimePickerSlots: { type: Object as PropType<{
            /** 自定义整个顶部栏的内容 */
            default?: ComponentType<CommonSlotsProps<any, any>>;
            /** 自定义标题内容 */
            title?: ComponentType<CommonSlotsProps<any, any>>;
            /** 自定义确认按钮内容 */
            confirm?: ComponentType<CommonSlotsProps<any, any>>;
            /** 自定义取消按钮内容 */
            cancel?: ComponentType<CommonSlotsProps<any, any>>;
            /** 自定义选项内容 */
            option?: ComponentType<{ option: string | Record<string, any> } & CommonSlotsProps<any, any>>;
            /** 自定义选项上方内容 */
            columnsTop?: ComponentType<CommonSlotsProps<any, any>>;
            /** 自定义选项下方内容 */
            columnsBottom?: ComponentType<CommonSlotsProps<any, any>>;
        }> },
        /** 是否展示右侧箭头并开启点击反馈 - Field 字段, 调整默认值 */
        isLink: { type: Boolean, default: true },
        /** 点击事件, 当传递了此事件时, 会忽略内部打开弹窗操作 */
        onRowClick: { type: Function as PropType<(option: { open: () => void; close: () => void }, ev: MouseEvent) => void> },
        /** 对值进行格式化 - 显示在页面上的值 */
        format: { type: Function as PropType<(value: Date) => string | number>, required: true },
        /** 对值进行格式化 - 提交值 */
        valueFormat: { type: Function as PropType<(value: Date) => any> },
        /** 取消值的格式化 - 给 VanDatetimePicker 的值 */
        valueUnformat: { type: Function as PropType<(value: any) => Date> },
        /** 值触发方式 @default confirm */
        valueTrigger: { type: String as PropType<'change' | 'confirm' | 'cancel'>, default: 'confirm' },
        /** 弹窗组件的属性 */
        popupProps: { type: Object as PropType<Partial<ComponentExposed<typeof VanPopup>>> },
        /** 弹窗组件的事件 - 兼容 vue2 版本 */
        popupOn: { type: Object as PropType<Partial<ReturnType<typeof emits2obj<NonNullable<typeof VanPopup.emits>>>>>, default: () => ({}) },
    } as const;
}
/** 组件传参 - 私有 */
export const datetimePickerPropsPrivate = datetimePickerPropsGeneric();
/** 组件传参 - 外部调用 */
export const datetimePickerProps = {
    ...VanField.props as unknown as {},
    ...datetimePickerPropsPrivate,
};
export type DatetimePickerProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof datetimePickerPropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function datetimePickerEmitsGeneric<T>() {
    return {};
}
/** 组件事件 - 私有 */
export const datetimePickerEmitsPrivate = datetimePickerEmitsGeneric();
/** 组件事件 - 外部调用 */
export const datetimePickerEmits = {
    ...VanField.emits,
    ...datetimePickerEmitsPrivate,
};

export type DatetimePickerEmits<T> = ReturnType<typeof datetimePickerEmitsGeneric<T>>;

export interface DatetimePickerSlots extends CommonSlots<any> {
}
