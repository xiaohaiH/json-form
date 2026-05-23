import type { emits2obj, PlainProps } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import type { Area as VanArea, Popup as VanPopup } from 'vant';
import { Field as VanField } from 'vant';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentEmit, ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { PickerOption } from '../picker/types';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType } from '../share';
import { commonProps } from '../share';

/** 组件传参 - 私有 */
export function areaPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    return {
        ...commonProps as CommonProps<Query, OptionQuery>,
        ...plainProps as PlainProps<Query, OptionQuery>,
        /** 重写 option 属性, 增加支持的类型 */
        options: { type: [Object, Array] as PropType<any> },
        /** VanArea 组件的属性 */
        areaProps: { type: Object as PropType<Partial<ComponentProps<typeof VanArea>>> },
        /** VanArea 组件的事件 - 兼容 vue2 版本 */
        areaOn: { type: Object as PropType<Partial<ReturnType<typeof emits2obj<NonNullable<typeof VanArea.emits>>>>>, default: () => ({}) },
        /** VanArea 组件的插槽 */
        areaSlots: { type: Object as PropType<{
            /** 自定义整个顶部栏的内容 */
            toolbar?: ComponentType<CommonSlotsProps<any, any>>;
            /** 自定义标题内容 */
            title?: ComponentType<CommonSlotsProps<any, any>>;
            /** 自定义确认按钮内容 */
            confirm?: ComponentType<CommonSlotsProps<any, any>>;
            /** 自定义取消按钮内容 */
            cancel?: ComponentType<CommonSlotsProps<any, any>>;
            /** 自定义选项上方内容 */
            columnsTop?: ComponentType<CommonSlotsProps<any, any>>;
            /** 自定义选项下方内容 */
            columnsBottom?: ComponentType<CommonSlotsProps<any, any>>;
        }> },
        /** 是否展示右侧箭头并开启点击反馈 - Field 字段, 调整默认值 */
        isLink: { type: Boolean, default: true },
        /** 点击事件, 当传递了此事件时, 会忽略内部打开弹窗操作 */
        onRowClick: { type: Function as PropType<(option: { open: () => void; close: () => void }, ev: MouseEvent) => void> },
        /** 显示文本的分隔符 @default / */
        separator: { type: String, default: '/' },
        /** 是否显示全路径 */
        showAllLevels: { type: Boolean, default: true },
        /** 对值进行格式化 - 显示在页面上的值 */
        format: { type: Function as PropType<(option: {
            source: Record<'province_list' | 'city_list' | 'county_list', Record<string, any>>;
            value: string | undefined;
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
export const areaPropsPrivate = areaPropsGeneric();
/** 组件传参 - 外部调用 */
export const areaProps = {
    ...VanField.props as unknown as {},
    ...areaPropsPrivate,
};
export type AreaProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof areaPropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function areaEmitsGeneric<T>() {
    return {};
}
/** 组件事件 - 私有 */
export const areaEmitsPrivate = areaEmitsGeneric();
/** 组件事件 - 外部调用 */
export const areaEmits = {
    ...VanField.emits,
    ...areaEmitsPrivate,
};

export type AreaEmits<T> = ReturnType<typeof areaEmitsGeneric<T>>;

export interface AreaSlots extends CommonSlots<any> {
}
