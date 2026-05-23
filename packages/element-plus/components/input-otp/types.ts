import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import { ElInputOtp } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

const elInputOtpProps = ElInputOtp.props as unknown as Obj2Props<ComponentProps<typeof ElInputOtp>>;
const elInputOtpEmits = emits2obj(ElInputOtp.emits);

/** 组件传参 - 私有 */
export function inputOtpPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elInputOtpProps;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<Query, OptionQuery>,
        ...commonProps as CommonProps<_Prop, InputOtpSlotOption<Query, OptionQuery>, Query, OptionQuery>,
        ...formItemProps as FormItemProps<Query, OptionQuery>,
        /** 值触发方式 @default change */
        valueTrigger: { type: String as PropType<'update:modelValue' | 'change' | 'finish'>, default: 'update:modelValue' },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            separator: ComponentType<{ index: number } & InputOtpSlotOption<Query, OptionQuery>>;
        }>> },
    } as const;
}
/** 插槽配置项 */
export interface InputOtpSlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
}
/** 组件传参 - 私有 */
export const inputOtpPropsPrivate = inputOtpPropsGeneric();
/** 组件传参 - 外部调用 */
export const inputOtpProps = {
    ...elInputOtpProps,
    ...inputOtpPropsPrivate,
};
export type InputOtpProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof inputOtpPropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function inputOtpEmitsGeneric<T>() {
    return {
    };
}
/** 组件事件 - 私有 */
export const inputOtpEmitsPrivate = inputOtpEmitsGeneric();
/** 组件事件 - 外部调用 */
export const inputOtpEmits = {
    ...elInputOtpEmits,
    ...inputOtpEmitsPrivate,
}
export type InputOtpEmits<T> = ReturnType<typeof inputOtpEmitsGeneric<T>>;

export interface InputOtpSlots extends CommonSlots<Record<string, any>> {
}
