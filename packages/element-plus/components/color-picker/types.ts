import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import { ElColorPicker } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, DynamicProps, FormItemProps, StaticProps } from '../share';
import { commonProps, formItemProps } from '../share';

const elColorPickerProps = ElColorPicker.props as Obj2Props<ComponentProps<typeof ElColorPicker>>;
const elColorPickerEmits = emits2obj(ElColorPicker.emits);

/** 组件传参 - 私有 */
export function colorPickerPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elColorPickerProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elColorPickerEmits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<T, ColorPickerSlotOption<T, Query, Option, OptionQuery>, Query, Option>,
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
export interface ColorPickerSlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    getFormItemProps: () => Partial<FormItemProps<Query, Option>>;
    getItemProps: () => Partial<ExtractPublicPropTypes<typeof elColorPickerProps>>;
    getProps: () => ColorPickerProps<T, Query, Option, OptionQuery>;
    options: Option[];
    modelValue: T;
    onChange: (value: T) => void;
    class: string;
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
}
/** 组件传参 - 私有 */
export const colorPickerPropsPrivate = colorPickerPropsGeneric();
/** 组件传参 - 外部调用 */
export const colorPickerProps = emits2props({
    ...elColorPickerProps,
    ...colorPickerPropsPrivate,
}, elColorPickerEmits) as typeof colorPickerPropsPrivate;
export type ColorPickerProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof colorPickerPropsGeneric<T, Query, Option, OptionQuery>>>;

/** 组件事件 - 私有 */
export function colorPickerEmitsGeneric<T>() {
    return {
        ...{} as typeof elColorPickerEmits,
    };
}
/** 组件事件 - 私有 */
export const colorPickerEmitsPrivate = colorPickerEmitsGeneric();
/** 组件事件 - 外部调用 */
export const colorPickerEmits = {
    ...elColorPickerEmits,
    ...colorPickerEmitsPrivate,
} as ReturnType<typeof colorPickerEmitsGeneric<any>>;
export type ColorPickerEmits<T> = ReturnType<typeof colorPickerEmitsGeneric<T>>;

export interface ColorPickerSlots extends CommonSlots<Record<string, any>> {
}
