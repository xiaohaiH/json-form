import type { emits2obj, PlainProps } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import type { Picker as VanPicker, Popup as VanPopup } from 'vant';
import { Field as VanField } from 'vant';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentEmit, ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType } from '../share';
import { commonProps } from '../share';

/** 组件传参 - 私有 */
export function pickerPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    return {
        ...commonProps as CommonProps<Query, OptionQuery>,
        ...plainProps as PlainProps<Query, OptionQuery>,
        /** VanPicker 组件的属性 */
        pickerProps: { type: Object as PropType<Partial<ComponentProps<typeof VanPicker>>> },
        /** VanPicker 组件的事件 - 兼容 vue2 版本 */
        pickerOn: { type: Object as PropType<Partial<ReturnType<typeof emits2obj<NonNullable<typeof VanPicker.emits>>>>>, default: () => ({}) },
        /** VanPicker 组件的插槽 */
        pickerSlots: { type: Object as PropType<{
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
            /** 自定义空状态内容 */
            empty?: ComponentType<CommonSlotsProps<any, any>>;
        }> },
        /** 是否展示右侧箭头并开启点击反馈 - Field 字段, 调整默认值 */
        isLink: { type: Boolean, default: true },
        /** 点击事件, 当传递了此事件时, 会忽略内部打开弹窗操作 */
        onRowClick: { type: Function as PropType<(option: { open: () => void; close: () => void }, ev: MouseEvent) => void> },
        /** 页面显示时多个值之间的分隔符 @default - */
        separator: { type: String, default: '/' },
        /** 是否显示全路径, 多列不生效 */
        showAllLevels: { type: Boolean, default: true },
        /** 对值进行格式化 - 显示在页面上的值 */
        format: { type: Function as PropType<(option: {
            source: any[];
            value: any[];
            columnsFieldNames: Record<'text' | 'value' | 'children', string>;
            showAllLevels: boolean;
            separator: string;
        }) => any> },
        /** 值触发方式 @default confirm */
        valueTrigger: { type: String as PropType<'change' | 'confirm' | 'cancel'>, default: 'confirm' },
        /** 弹窗组件的属性 */
        popupProps: { type: Object as PropType<Partial<ComponentExposed<typeof VanPopup>>> },
        /** 弹窗组件的事件 - 兼容 vue2 版本 */
        popupOn: { type: Object as PropType<Partial<ReturnType<typeof emits2obj<NonNullable<typeof VanPopup.emits>>>>>, default: () => ({}) },
    } as const;
}
/** 组件传参 - 私有 */
export const pickerPropsPrivate = pickerPropsGeneric();
/** 组件传参 - 外部调用 */
export const pickerProps = {
    ...VanField.props as unknown as {},
    ...pickerPropsPrivate,
};
export type PickerProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof pickerPropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function pickerEmitsGeneric<T>() {
    return {};
}
/** 组件事件 - 私有 */
export const pickerEmitsPrivate = pickerEmitsGeneric();
/** 组件事件 - 外部调用 */
export const pickerEmits = {
    ...VanField.emits,
    ...pickerEmitsPrivate,
};

export type PickerEmits<T> = ReturnType<typeof pickerEmitsGeneric<T>>;

export interface PickerSlots extends CommonSlots<any> {
}

/** 选中时的参数 */
export interface PickerOption {
    columnIndex: number;
    selectedIndexes: number;
    selectedOptions: Record<'text' | 'value', string>;
    selectedValues: string[];
}
