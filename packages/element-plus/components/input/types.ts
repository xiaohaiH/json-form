import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import { inputEmits as elInputEmits, inputProps as elInputProps } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

/** 组件传参 - 私有 */
export function inputPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elInputProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elInputEmits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<Query, OptionQuery>,
        ...commonProps as CommonProps<_Prop, InputSlotOption<Query, OptionQuery>, Query, OptionQuery>,
        ...formItemProps as FormItemProps<Query, OptionQuery>,
        /** 延迟触发抖动时长(单位 ms) */
        debounceTime: { type: Number as PropType<number>, default: undefined },
        /** 是否显示清除按钮 @default true */
        clearable: { type: Boolean as PropType<boolean>, default: true },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            prefix: ComponentType<InputSlotOption<Query, OptionQuery>>;
            suffix: ComponentType<InputSlotOption<Query, OptionQuery>>;
            prepend: ComponentType<InputSlotOption<Query, OptionQuery>>;
            append: ComponentType<InputSlotOption<Query, OptionQuery>>;
        }>> },
    } as const;
}
/** 插槽配置项 */
export interface InputSlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
}
/** 组件传参 - 私有 */
export const inputPropsPrivate = inputPropsGeneric();
/** 组件传参 - 外部调用 */
export const inputProps = emits2props({
    ...elInputProps,
    ...inputPropsPrivate,
}, elInputEmits);
export type InputProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof inputPropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function inputEmitsGeneric<T>() {
    return {
        ...{} as typeof elInputEmits,
    };
}
/** 组件事件 - 私有 */
export const inputEmitsPrivate = inputEmitsGeneric();
/** 组件事件 - 外部调用 */
export const inputEmits = {
    ...elInputEmits,
    ...inputEmitsPrivate,
} as ReturnType<typeof inputEmitsGeneric<any>>;
export type InputEmits<T> = ReturnType<typeof inputEmitsGeneric<T>>;

export interface InputSlots extends CommonSlots<Record<string, any>> {
}
