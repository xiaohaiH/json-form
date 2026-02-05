import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import type { checkboxEmits as elCheckboxEmits, checkboxProps as elCheckboxProps } from 'element-plus';
import { ElCheckboxGroup } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

const elCheckboxGroupProps = ElCheckboxGroup.props as Obj2Props<ComponentProps<typeof ElCheckboxGroup>>;
const elCheckboxGroupEmits = emits2obj(ElCheckboxGroup.emits);

/** 组件传参 - 私有 */
export function checkboxGroupPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elCheckboxGroupProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elCheckboxGroupEmits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<Query, OptionQuery>,
        ...commonProps as CommonProps<_Prop, CheckboxGroupSlotOption<Query, OptionQuery>, Query, OptionQuery>,
        ...formItemProps as FormItemProps<Query, OptionQuery>,
        /** 展示的字段 */
        labelKey: { type: String as PropType<string>, default: 'label' },
        /** 提交的字段 */
        valueKey: { type: String as PropType<string>, default: 'value' },
        /** 按钮类型(checkbox|button), 默认 checkbox */
        type: { type: String as PropType<'checkbox' | 'button'> },
        /** 选项禁用字段 */
        disabledKey: { type: String as PropType<string>, default: 'disabled' },
        /** 暴露给 Checkbox 或 CheckboxButton 的属性 */
        itemProps: { type: Object as PropType<Partial<ExtractPublicPropTypes<ReturnType<typeof emits2props<typeof elCheckboxProps, [NonNullable<typeof elCheckboxEmits>]>>>>> },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            default: ComponentType<CheckboxGroupSlotOption<Query, OptionQuery> & { option: any; labelKey: string; valueKey: string; disabledKey: string }>;
        }>> },
    } as const;
}
/** 插槽配置项 */
export interface CheckboxGroupSlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
}
/** 组件传参 - 私有 */
export const checkboxGroupPropsPrivate = checkboxGroupPropsGeneric();
/** 组件传参 - 外部调用 */
export const checkboxGroupProps = emits2props({
    ...elCheckboxGroupProps,
    ...checkboxGroupPropsPrivate,
}, elCheckboxGroupEmits);
export type CheckboxGroupProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof checkboxGroupPropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function checkboxGroupEmitsGeneric<T>() {
    return {
        ...{} as typeof elCheckboxGroupEmits,
    };
}
/** 组件事件 - 私有 */
export const checkboxGroupEmitsPrivate = checkboxGroupEmitsGeneric();
/** 组件事件 - 外部调用 */
export const checkboxGroupEmits = {
    ...elCheckboxGroupEmits,
    ...checkboxGroupEmitsPrivate,
} as ReturnType<typeof checkboxGroupEmitsGeneric<any>>;
export type CheckboxGroupEmits<T> = ReturnType<typeof checkboxGroupEmitsGeneric<T>>;

export interface CheckboxGroupSlots extends CommonSlots<Record<string, any>> {
}
