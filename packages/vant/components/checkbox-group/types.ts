import type { emits2obj, PlainProps } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import type { Checkbox as VanCheckbox } from 'vant';
import { CheckboxGroup as VanCheckboxGroup, Field as VanField } from 'vant';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { camelize } from 'vue';
import type { ComponentEmit, ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType } from '../share';
import { commonProps } from '../share';

/** 组件传参 - 私有 */
export function checkboxGroupPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    return {
        ...commonProps as CommonProps<Query, OptionQuery>,
        ...plainProps as PlainProps<Query, OptionQuery>,
        /** 输入框左侧文本 */
        label: { type: String },
        /** VanCheckboxGroup 组件的属性 */
        checkboxGroupProps: { type: Object as PropType<Partial<ComponentProps<typeof VanCheckboxGroup>>> },
        /** VanCheckboxGroup 组件的事件 - 兼容 vue2 版本 */
        checkboxGroupOn: { type: Object as PropType<Partial<ReturnType<typeof emits2obj<NonNullable<typeof VanCheckboxGroup.emits>>>>>, default: () => ({}) },
        /** 显示的标签 */
        labelKey: { type: String, default: 'label' },
        /** 提交的值 */
        valueKey: { type: String, default: 'value' },
        /** VanCheckbox 组件的属性 */
        checkboxProps: { type: Object as PropType<Partial<ComponentProps<typeof VanCheckbox>>> },
        /** VanCheckbox 组件的事件 - 兼容 vue2 版本 */
        checkboxOn: { type: Object as PropType<Partial<ReturnType<typeof emits2obj<NonNullable<typeof VanCheckbox.emits>>>>>, default: () => ({}) },
        /** VanCheckbox 组件的插槽 */
        checkboxSlots: { type: Object as PropType<{
            /** 自定义文本 */
            default?: ComponentType<{ checked: boolean; disabled: boolean; item: any } & CommonSlotsProps<any, any>>;
            /** 自定义图标 */
            icon?: ComponentType<{ checked: boolean; disabled: boolean; item: any } & CommonSlotsProps<any, any>>;
        }> },
    } as const;
}
/** 组件传参 - 私有 */
export const checkboxGroupPropsPrivate = checkboxGroupPropsGeneric();
/** 组件传参 - 外部调用 */
export const checkboxGroupProps = {
    ...VanField.props as unknown as {},
    ...checkboxGroupPropsPrivate,
};
export type CheckboxGroupProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof checkboxGroupPropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function checkboxGroupEmitsGeneric<T>() {
    return {};
}
/** 组件事件 - 私有 */
export const checkboxGroupEmitsPrivate = checkboxGroupEmitsGeneric();
/** 组件事件 - 外部调用 */
export const checkboxGroupEmits = {
    ...VanField.emits,
    ...checkboxGroupEmitsPrivate,
};

export type CheckboxGroupEmits<T> = ReturnType<typeof checkboxGroupEmitsGeneric<T>>;

export interface CheckboxGroupSlots extends CommonSlots<any> {
}
