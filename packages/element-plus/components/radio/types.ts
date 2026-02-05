import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import { radioEmits as elRadioEmits, radioProps as elRadioProps } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

/** 组件传参 - 私有 */
export function radioPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elRadioProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elRadioEmits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<Query, OptionQuery>,
        ...commonProps as CommonProps<_Prop, RadioSlotOption<Query, OptionQuery>, Query, OptionQuery>,
        ...formItemProps as FormItemProps<Query, OptionQuery>,
        /**
         * 按钮类型(radio|button), 默认 radio
         * @deprecated element-plus 设计缺陷(单个 ElRadioButton 无法触发事件)
         */
        type: { type: String as PropType<'radio' | 'button'> },
        /** 选中状态是否可以被取消 */
        cancelable: { type: Boolean as PropType<boolean>, default: undefined },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            default: ComponentType<RadioSlotOption<Query, OptionQuery>>;
        }>> },
    } as const;
}
/** 插槽配置项 */
export interface RadioSlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
}
/** 组件传参 - 私有 */
export const radioPropsPrivate = radioPropsGeneric();
/** 组件传参 - 外部调用 */

export const radioProps = emits2props({
    ...elRadioProps,
    ...radioPropsPrivate,
}, elRadioEmits) as typeof radioPropsPrivate;
export type RadioProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof radioPropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function radioEmitsGeneric<T>() {
    return {
        ...{} as typeof elRadioEmits,
    };
}
/** 组件事件 - 私有 */
export const radioEmitsPrivate = radioEmitsGeneric();
/** 组件事件 - 外部调用 */
export const radioEmits = {
    ...elRadioEmits,
    ...radioEmitsPrivate,
} as ReturnType<typeof radioEmitsGeneric<any>>;
export type RadioEmits<T> = ReturnType<typeof radioEmitsGeneric<T>>;

export interface RadioSlots extends CommonSlots<Record<string, any>> {
}
