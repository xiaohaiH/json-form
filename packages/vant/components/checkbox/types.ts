import type { emits2obj, PlainProps } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import { Checkbox as VanCheckbox, Field as VanField } from 'vant';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { camelize } from 'vue';
import type { ComponentEmit, ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType } from '../share';
import { commonProps } from '../share';

/** 组件传参 - 私有 */
export function checkboxPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    return {
        ...commonProps as CommonProps<Query, OptionQuery>,
        ...plainProps as PlainProps<Query, OptionQuery>,
        /** 输入框左侧文本 */
        label: { type: String },
        /** VanCheckbox 组件的属性 */
        checkboxProps: { type: Object as PropType<Partial<ComponentProps<typeof VanCheckbox>>> },
        /** VanCheckbox 组件的事件 - 兼容 vue2 版本 */
        checkboxOn: { type: Object as PropType<Partial<ReturnType<typeof emits2obj<NonNullable<typeof VanCheckbox.emits>>>>>, default: () => ({}) },
        /** VanCheckbox 组件的插槽 */
        checkboxSlots: { type: Object as PropType<{
            /** 自定义文本 */
            default?: ComponentType<{ checked: boolean; disabled: boolean } & CommonSlotsProps<any, any>>;
            /** 自定义图标 */
            icon?: ComponentType<{ checked: boolean; disabled: boolean } & CommonSlotsProps<any, any>>;
        }> },
    } as const;
}
/** 组件传参 - 私有 */
export const checkboxPropsPrivate = checkboxPropsGeneric();
/** 组件传参 - 外部调用 */
export const checkboxProps = {
    ...VanField.props as unknown as {},
    ...checkboxPropsPrivate,
};
export type CheckboxProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof checkboxPropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function checkboxEmitsGeneric<T>() {
    return {};
}
/** 组件事件 - 私有 */
export const checkboxEmitsPrivate = checkboxEmitsGeneric();
/** 组件事件 - 外部调用 */
export const checkboxEmits = {
    ...VanField.emits,
    ...checkboxEmitsPrivate,
};

export type CheckboxEmits<T> = ReturnType<typeof checkboxEmitsGeneric<T>>;

export interface CheckboxSlots extends CommonSlots<any> {
}
