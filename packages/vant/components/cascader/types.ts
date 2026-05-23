import type { emits2obj, PlainProps } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import type { CascaderOption, Cascader as VanCascader, Popup as VanPopup } from 'vant';
import { Field as VanField } from 'vant';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { camelize } from 'vue';
import type { ComponentEmit, ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType } from '../share';
import { commonProps } from '../share';

/** 组件传参 - 私有 */
export function cascaderPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    return {
        ...commonProps as CommonProps<Query, OptionQuery>,
        ...plainProps as PlainProps<Query, OptionQuery>,
        /** 输入框左侧文本 */
        label: { type: String },
        /** 输入框的提示文字 */
        placeholder: { type: String },
        /** 是否展示右侧箭头并开启点击反馈 */
        isLink: { type: Boolean, default: true },
        /** 是否严格的遵守父子节点不互相关联(可选任意级) */
        checkStrictly: { type: Boolean, default: undefined },
        /** 是否显示全路径 */
        showAllLevels: { type: Boolean, default: undefined },
        /** 节点关联的情况下, 是否返回所有路径(即返回数组) */
        emitPath: { type: Boolean, default: undefined },
        /** 点击事件, 当传递了此事件时, 会忽略内部打开弹窗操作 */
        onRowClick: { type: Function as PropType<(option: { open: () => void; close: () => void }, ev: MouseEvent) => void> },
        /** VanCascader 组件的属性 */
        cascaderProps: { type: Object as PropType<Partial<ComponentProps<typeof VanCascader>>>, default: () => ({}) },
        /** VanCascader 组件的事件 - 兼容 vue2 版本 */
        cascaderOn: { type: Object as PropType<Partial<ReturnType<typeof emits2obj<NonNullable<typeof VanCascader.emits>>>>>, default: () => ({}) },
        /** VanCascader 组件的插槽 */
        cascaderSlots: { type: Object as PropType<{
            /** 自定义顶部标题 */
            title?: ComponentType<CommonSlotsProps<any, any>>;
            /** 自定义选项文字 */
            option?: ComponentType<{ option: CascaderOption; selected: boolean } & CommonSlotsProps<any, any>>;
            /** 自定义选项上方的内容 */
            optionsTop?: ComponentType<{ tabIndex: number } & CommonSlotsProps<any, any>>;
            /** 自定义选项下方的内容 */
            optionsBottom?: ComponentType<{ tabIndex: number } & CommonSlotsProps<any, any>>;
        }> },
        /** 弹窗组件的属性 */
        popupProps: { type: Object as PropType<Partial<ComponentExposed<typeof VanPopup>>> },
        /** 弹窗组件的事件 - 兼容 vue2 版本 */
        popupOn: { type: Object as PropType<Partial<ReturnType<typeof emits2obj<NonNullable<typeof VanPopup.emits>>>>>, default: () => ({}) },
    } as const;
}
/** 组件传参 - 私有 */
export const cascaderPropsPrivate = cascaderPropsGeneric();
/** 组件传参 - 外部调用 */
export const cascaderProps = {
    ...VanField.props as unknown as {},
    ...cascaderPropsPrivate,
};
export type CascaderProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof cascaderPropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function cascaderEmitsGeneric<T>() {
    return {};
}
/** 组件事件 - 私有 */
export const cascaderEmitsPrivate = cascaderEmitsGeneric();
/** 组件事件 - 外部调用 */
export const cascaderEmits = {
    ...VanField.emits,
    ...cascaderEmitsPrivate,
};

export type CascaderEmits<T> = ReturnType<typeof cascaderEmitsGeneric<T>>;

export interface CascaderSlots extends CommonSlots<any> {
}
