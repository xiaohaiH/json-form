import type { emits2obj, PlainProps } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import { Field as VanField, Stepper as VanStepper } from 'vant';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType } from '../share';
import { commonProps } from '../share';

/** 组件传参 - 私有 */
export function stepperPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    return {
        ...commonProps as CommonProps<Query, OptionQuery>,
        ...plainProps as PlainProps<Query, OptionQuery>,
        /** VanStepper 组件的属性 */
        stepperProps: { type: Object as PropType<Partial<ComponentProps<typeof VanStepper>>> },
        /** VanStepper 组件的事件 - 兼容 vue2 版本 */
        stepperOn: { type: Object as PropType<Partial<ReturnType<typeof emits2obj<NonNullable<typeof VanStepper.emits>>>>>, default: () => ({}) },
        /** VanStepper 组件的插槽 */
        stepperSlots: { type: Object as PropType<{
        }> },
    } as const;
}
/** 组件传参 - 私有 */
export const stepperPropsPrivate = stepperPropsGeneric();
/** 组件传参 - 外部调用 */
export const stepperProps = {
    ...VanField.props as unknown as {},
    ...stepperPropsPrivate,
};
export type StepperProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof stepperPropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function stepperEmitsGeneric<T>() {
    return {};
}
/** 组件事件 - 私有 */
export const stepperEmitsPrivate = stepperEmitsGeneric();
/** 组件事件 - 外部调用 */
export const stepperEmits = {
    ...VanField.emits,
    ...stepperEmitsPrivate,
};

export type StepperEmits<T> = ReturnType<typeof stepperEmitsGeneric<T>>;

export interface StepperSlots extends CommonSlots<any> {
}
