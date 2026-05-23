import type { emits2obj, PlainProps } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import { Field as VanField, Rate as VanRate } from 'vant';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType } from '../share';
import { commonProps } from '../share';

/** 组件传参 - 私有 */
export function ratePropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    return {
        ...commonProps as CommonProps<Query, OptionQuery>,
        ...plainProps as PlainProps<Query, OptionQuery>,
        /** VanRate 组件的属性 */
        rateProps: { type: Object as PropType<Partial<ComponentProps<typeof VanRate>>> },
        /** VanRate 组件的事件 - 兼容 vue2 版本 */
        rateOn: { type: Object as PropType<Partial<ReturnType<typeof emits2obj<NonNullable<typeof VanRate.emits>>>>>, default: () => ({}) },
        /** VanRate 组件的插槽 */
        rateSlots: { type: Object as PropType<{
        }> },
    } as const;
}
/** 组件传参 - 私有 */
export const ratePropsPrivate = ratePropsGeneric();
/** 组件传参 - 外部调用 */
export const rateProps = {
    ...VanField.props as unknown as {},
    ...ratePropsPrivate,
};
export type RateProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof ratePropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function rateEmitsGeneric<T>() {
    return {};
}
/** 组件事件 - 私有 */
export const rateEmitsPrivate = rateEmitsGeneric();
/** 组件事件 - 外部调用 */
export const rateEmits = {
    ...VanField.emits,
    ...rateEmitsPrivate,
};

export type RateEmits<T> = ReturnType<typeof rateEmitsGeneric<T>>;

export interface RateSlots extends CommonSlots<any> {
}
