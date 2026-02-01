import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import { rateEmits as elRateEmits, rateProps as elRateProps } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

/** 组件传参 - 私有 */
export function ratePropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elRateProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elRateEmits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<_Prop, RateSlotOption<Query, OptionQuery>, Query, Option>,
        ...formItemProps as FormItemProps<Query, Option>,
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
        }>> },
    } as const;
}
/** 插槽配置项 */
export interface RateSlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
}
/** 组件传参 - 私有 */
export const ratePropsPrivate = ratePropsGeneric();
/** 组件传参 - 外部调用 */

export const rateProps = emits2props({
    ...elRateProps,
    ...ratePropsPrivate,
}) as typeof ratePropsPrivate;
export type RateProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof ratePropsGeneric<T, Query, Option, OptionQuery>>>;

/** 组件事件 - 私有 */
export function rateEmitsGeneric<T>() {
    return {
        ...{} as typeof elRateEmits,
    };
}
/** 组件事件 - 私有 */
export const rateEmitsPrivate = rateEmitsGeneric();
/** 组件事件 - 外部调用 */
export const rateEmits = {
    ...elRateEmits,
    ...rateEmitsPrivate,
} as ReturnType<typeof rateEmitsGeneric<any>>;
export type RateEmits<T> = ReturnType<typeof rateEmitsGeneric<T>>;

export interface RateSlots extends CommonSlots<Record<string, any>> {
}
