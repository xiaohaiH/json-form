import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import { ElSlider } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, DynamicProps, FormItemProps, StaticProps } from '../share';
import { commonProps, formItemProps } from '../share';

const elSliderProps = ElSlider.props as Obj2Props<ComponentProps<typeof ElSlider>>;
const elSliderEmits = emits2obj(ElSlider.emits);

/** 组件传参 - 私有 */
export function sliderPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elSliderProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elSliderEmits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<T, SliderSlotOption<T, Query, Option, OptionQuery>, Query, Option>,
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
export interface SliderSlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    getFormItemProps: () => Partial<FormItemProps<Query, Option>>;
    getItemProps: () => Partial<ExtractPublicPropTypes<typeof elSliderProps>>;
    getProps: () => SliderProps<T, Query, Option, OptionQuery>;
    options: Option[];
    modelValue: T;
    onChange: (value: T) => void;
    class: string;
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
}
/** 组件传参 - 私有 */
export const sliderPropsPrivate = sliderPropsGeneric();
/** 组件传参 - 外部调用 */
export const sliderProps = emits2props({
    ...elSliderProps,
    ...sliderPropsPrivate,
}) as typeof sliderPropsPrivate;
export type SliderProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof sliderPropsGeneric<T, Query, Option, OptionQuery>>>;

/** 组件事件 - 私有 */
export function sliderEmitsGeneric<T>() {
    return {
        ...{} as typeof elSliderEmits,
    };
}
/** 组件事件 - 私有 */
export const sliderEmitsPrivate = sliderEmitsGeneric();
/** 组件事件 - 外部调用 */
export const sliderEmits = {
    ...elSliderEmits,
    ...sliderEmitsPrivate,
} as ReturnType<typeof sliderEmitsGeneric<any>>;
export type SliderEmits<T> = ReturnType<typeof sliderEmitsGeneric<T>>;

export interface SliderSlots extends CommonSlots<Record<string, any>> {
}
