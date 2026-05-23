import type { emits2obj, PlainProps } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import { Field as VanField, Switch as VanSwitch } from 'vant';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType } from '../share';
import { commonProps } from '../share';

/** 组件传参 - 私有 */
export function switchPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    return {
        ...commonProps as CommonProps<Query, OptionQuery>,
        ...plainProps as PlainProps<Query, OptionQuery>,
        /** VanSwitch 组件的属性 */
        switchProps: { type: Object as PropType<Partial<ComponentProps<typeof VanSwitch>>> },
        /** VanSwitch 组件的事件 - 兼容 vue2 版本 */
        switchOn: { type: Object as PropType<Partial<ReturnType<typeof emits2obj<NonNullable<typeof VanSwitch.emits>>>>>, default: () => ({}) },
        /** VanSwitch 组件的插槽 */
        switchSlots: { type: Object as PropType<{
            /** 自定义按钮的内容 */
            node?: ComponentType<CommonSlotsProps<any, any>>;
            /** 自定义开关的背景内容 */
            background?: ComponentType<CommonSlotsProps<any, any>>;
        }> },
    } as const;
}
/** 组件传参 - 私有 */
export const switchPropsPrivate = switchPropsGeneric();
/** 组件传参 - 外部调用 */
export const switchProps = {
    ...VanField.props as unknown as {},
    ...switchPropsPrivate,
};
export type SwitchProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof switchPropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function switchEmitsGeneric<T>() {
    return {};
}
/** 组件事件 - 私有 */
export const switchEmitsPrivate = switchEmitsGeneric();
/** 组件事件 - 外部调用 */
export const switchEmits = {
    ...VanField.emits,
    ...switchEmitsPrivate,
};

export type SwitchEmits<T> = ReturnType<typeof switchEmitsGeneric<T>>;

export interface SwitchSlots extends CommonSlots<any> {
}
