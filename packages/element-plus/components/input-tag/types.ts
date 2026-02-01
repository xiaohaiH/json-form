import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import { inputTagEmits as elInputTagEmits, inputTagProps as elInputTagProps } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

/** 组件传参 - 私有 */
export function inputTagPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any> = Record<string, any>>() {
    type _Prop = typeof elInputTagProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elInputTagEmits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<_Prop, InputTagSlotOption<Query, OptionQuery>, Query, Option>,
        ...formItemProps as FormItemProps<Query, Option>,
        /** 是否显示清除按钮 @default true */
        clearable: { type: Boolean as PropType<boolean>, default: true },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            prefix: ComponentType<InputTagSlotOption<Query, OptionQuery>>;
            suffix: ComponentType<InputTagSlotOption<Query, OptionQuery>>;
            tag: ComponentType<InputTagSlotOption<Query, OptionQuery> & { value: string; index: number }>;
        }>> },
    } as const;
}
/** 插槽配置项 */
export interface InputTagSlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
}
/** 组件传参 - 私有 */
export const inputTagPropsPrivate = inputTagPropsGeneric();
/** 组件传参 - 外部调用 */
export const inputTagProps = emits2props({
    ...elInputTagProps,
    ...inputTagPropsPrivate,
}, elInputTagEmits);
export type InputTagProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof inputTagPropsGeneric<T, Query, Option, OptionQuery>>>;

/** 组件事件 - 私有 */
export function inputTagEmitsGeneric<T>() {
    return {
        ...{} as typeof elInputTagEmits,
    };
}
/** 组件事件 - 私有 */
export const inputTagEmitsPrivate = inputTagEmitsGeneric();
/** 组件事件 - 外部调用 */
export const inputTagEmits = {
    ...elInputTagEmits,
    ...inputTagEmitsPrivate,
} as ReturnType<typeof inputTagEmitsGeneric<any>>;
export type InputTagEmits<T> = ReturnType<typeof inputTagEmitsGeneric<T>>;

export interface InputTagSlots extends CommonSlots<Record<string, any>> {
}
