import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import { ElCheckbox } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

const elCheckboxProps = ElCheckbox.props as Obj2Props<ComponentProps<typeof ElCheckbox>>;
const elCheckboxEmits = emits2obj(ElCheckbox.emits);

/** 组件传参 - 私有 */
export function checkboxPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elCheckboxProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elCheckboxEmits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<Query, OptionQuery>,
        ...commonProps as CommonProps<_Prop, CheckboxSlotOption<Query, OptionQuery>, Query, OptionQuery>,
        ...formItemProps as FormItemProps<Query, OptionQuery>,
        /** 按钮类型(checkbox|button), 默认 checkbox */
        type: { type: String as PropType<'checkbox' | 'button'> },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            default: ComponentType<CheckboxSlotOption<Query, OptionQuery>>;
        }>> },
    } as const;
}
/** 插槽配置项 */
export interface CheckboxSlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
}
/** 组件传参 - 私有 */
export const checkboxPropsPrivate = checkboxPropsGeneric();
/** 组件传参 - 外部调用 */
export const checkboxProps = emits2props({
    ...elCheckboxProps,
    ...checkboxPropsPrivate,
}, elCheckboxEmits) as typeof checkboxPropsPrivate;
export type CheckboxProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof checkboxPropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function checkboxEmitsGeneric<T>() {
    return {
        ...{} as typeof elCheckboxEmits,
    };
}
/** 组件事件 - 私有 */
export const checkboxEmitsPrivate = checkboxEmitsGeneric();
/** 组件事件 - 外部调用 */
export const checkboxEmits = {
    ...elCheckboxEmits,
    ...checkboxEmitsPrivate,
};
export type CheckboxEmits<T> = ReturnType<typeof checkboxEmitsGeneric<T>>;

export interface CheckboxSlots extends CommonSlots<Record<string, any>> {
}
