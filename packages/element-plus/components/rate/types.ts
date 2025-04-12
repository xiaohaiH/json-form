import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import { rateEmits as elRateEmits, rateProps as elRateProps } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, DynamicProps, FormItemProps, StaticProps } from '../share';
import { commonProps, formItemProps } from '../share';

/** 组件传参 - 私有 */
export function ratePropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elRateProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elRateEmits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<T, RateSlotOption<T, Query, Option, OptionQuery>, Query, Option>,
        ...formItemProps as FormItemProps<Query, Option>,
        /** 组件静态属性(与 formItem 或内置的属性冲突时, 可通过该属性传递) */
        staticProps: { type: Object as PropType<StaticProps<_Prop>> },
        /** 组件动态属性 */
        dynamicProps: { type: Function as PropType<DynamicProps<_Prop, Query, Option>> },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
        }>> },
    } as const;
}
/** 插槽配置项 */
export interface RateSlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    getFormItemProps: () => Partial<FormItemProps<Query, Option>>;
    getItemProps: () => Partial<ExtractPublicPropTypes<typeof elRateProps>>;
    getProps: () => RateProps<T, Query, Option, OptionQuery>;
    options: Option[];
    modelValue: T;
    onChange: (value: T) => void;
    class: string;
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
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
