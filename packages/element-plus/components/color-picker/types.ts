import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import { ElColorPicker } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

const elColorPickerProps = ElColorPicker.props as Obj2Props<ComponentProps<typeof ElColorPicker>>;
const elColorPickerEmits = emits2obj(ElColorPicker.emits);

/** 组件传参 - 私有 */
export function colorPickerPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elColorPickerProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elColorPickerEmits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<Query, OptionQuery>,
        ...commonProps as CommonProps<_Prop, ColorPickerSlotOption<Query, OptionQuery>, Query, OptionQuery>,
        ...formItemProps as FormItemProps<Query, OptionQuery>,
        /** 监听触发值改变的事件 @default change */
        changeName: { type: String, default: 'change'},
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
        }>> },
    } as const;
}
/** 插槽配置项 */
export interface ColorPickerSlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
}
/** 组件传参 - 私有 */
export const colorPickerPropsPrivate = colorPickerPropsGeneric();
/** 组件传参 - 外部调用 */
export const colorPickerProps = emits2props({
    ...elColorPickerProps,
    ...colorPickerPropsPrivate,
}, elColorPickerEmits) as typeof colorPickerPropsPrivate;
export type ColorPickerProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof colorPickerPropsGeneric<Query, OptionQuery>>>;

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
