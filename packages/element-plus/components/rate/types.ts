import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import { ElRate } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

const elRateProps = ElRate.props as unknown as Obj2Props<ComponentProps<typeof ElRate>>;
const elRateEmits = emits2obj(ElRate.emits);

/** 组件传参 - 私有 */
export function ratePropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elRateProps;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<Query, OptionQuery>,
        ...commonProps as CommonProps<_Prop, RateSlotOption<Query, OptionQuery>, Query, OptionQuery>,
        ...formItemProps as FormItemProps<Query, OptionQuery>,
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

export const rateProps = {
    ...elRateProps,
    ...ratePropsPrivate,
};
export type RateProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof ratePropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function rateEmitsGeneric<T>() {
    return {
    };
}
/** 组件事件 - 私有 */
export const rateEmitsPrivate = rateEmitsGeneric();
/** 组件事件 - 外部调用 */
export const rateEmits = {
    ...elRateEmits,
    ...rateEmitsPrivate,
}
export type RateEmits<T> = ReturnType<typeof rateEmitsGeneric<T>>;

export interface RateSlots extends CommonSlots<Record<string, any>> {
}
