import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import { ElInputTag } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

const elInputTagProps = ElInputTag.props as unknown as Obj2Props<ComponentProps<typeof ElInputTag>>;
const elInputTagEmits = emits2obj(ElInputTag.emits);

/** 组件传参 - 私有 */
export function inputTagPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elInputTagProps;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<Query, OptionQuery>,
        ...commonProps as CommonProps<_Prop, InputTagSlotOption<Query, OptionQuery>, Query, OptionQuery>,
        ...formItemProps as FormItemProps<Query, OptionQuery>,
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
export const inputTagProps = {
    ...elInputTagProps,
    ...inputTagPropsPrivate,
};
export type InputTagProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof inputTagPropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function inputTagEmitsGeneric<T>() {
    return {
    };
}
/** 组件事件 - 私有 */
export const inputTagEmitsPrivate = inputTagEmitsGeneric();
/** 组件事件 - 外部调用 */
export const inputTagEmits = {
    ...elInputTagEmits,
    ...inputTagEmitsPrivate,
};
export type InputTagEmits<T> = ReturnType<typeof inputTagEmitsGeneric<T>>;

export interface InputTagSlots extends CommonSlots<Record<string, any>> {
}
