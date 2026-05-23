import type { emits2obj, PlainProps } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import type { TreeSelectChild, Popup as VanPopup } from 'vant';
import { Field as VanField, TreeSelect as VanTreeSelect } from 'vant';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentEmit, ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { PickerOption } from '../picker/types';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType } from '../share';
import { commonProps } from '../share';

/** 组件传参 - 私有 */
export function treeSelectPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    return {
        ...commonProps as CommonProps<Query, OptionQuery>,
        ...plainProps as PlainProps<Query, OptionQuery>,
        /** VanTreeSelect 组件的属性 */
        treeSelectProps: { type: Object as PropType<Partial<ComponentProps<typeof VanTreeSelect>>> },
        /** VanTreeSelect 组件的事件 - 兼容 vue2 版本 */
        treeSelectOn: { type: Object as PropType<Partial<ReturnType<typeof emits2obj<NonNullable<typeof VanTreeSelect.emits>>>>>, default: () => ({}) },
        /** VanTreeSelect 组件的插槽 */
        treeSelectSlots: { type: Object as PropType<{
            /** 自定义导航名称 */
            navText?: ComponentType<{ item: TreeSelectChild } & CommonSlotsProps<any, any>>;
            /** 自定义右侧区域内容 */
            content?: ComponentType<{ options: any[] } & CommonSlotsProps<any, any>>;
        }> },
        /** 是否展示右侧箭头并开启点击反馈 - Field 字段, 调整默认值 */
        isLink: { type: Boolean, default: true },
        /** 点击事件, 当传递了此事件时, 会忽略内部打开弹窗操作 */
        onRowClick: { type: Function as PropType<(option: { open: () => void; close: () => void }, ev: MouseEvent) => void> },
        /** 显示文本的分隔符 @default / */
        separator: { type: String, default: ',' },
        /** 对值进行格式化 - 显示在页面上的值 */
        format: { type: Function as PropType<(option: {
            source: TreeSelectOption[];
            value: string | string[];
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
export const treeSelectPropsPrivate = treeSelectPropsGeneric();
/** 组件传参 - 外部调用 */
export const treeSelectProps = {
    ...VanField.props as unknown as {},
    ...treeSelectPropsPrivate,
};
export type TreeSelectProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof treeSelectPropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function treeSelectEmitsGeneric<T>() {
    return {};
}
/** 组件事件 - 私有 */
export const treeSelectEmitsPrivate = treeSelectEmitsGeneric();
/** 组件事件 - 外部调用 */
export const treeSelectEmits = {
    ...VanField.emits,
    ...treeSelectEmitsPrivate,
};

export type TreeSelectEmits<T> = ReturnType<typeof treeSelectEmitsGeneric<T>>;

export interface TreeSelectSlots extends CommonSlots<any> {
}

export interface TreeSelectOption {
    text: string;
    id: string;
    children: Omit<TreeSelectOption, 'children'>[];
}
