import type { emits2obj, PlainProps } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import { Field as VanField, NumberKeyboard as VanNumberKeyboard, PasswordInput as VanPasswordInput } from 'vant';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType } from '../share';
import { commonProps } from '../share';

/** 组件传参 - 私有 */
export function passwordInputPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    return {
        ...commonProps as CommonProps<Query, OptionQuery>,
        ...plainProps as PlainProps<Query, OptionQuery>,
        /** 输入框左侧文本 */
        label: { type: String },
        /** VanPasswordInput 组件的属性 */
        passwordInputProps: { type: Object as PropType<Partial<ComponentProps<typeof VanPasswordInput>>> },
        /** VanPasswordInput 组件的事件 - 兼容 vue2 版本 */
        passwordInputOn: { type: Object as PropType<Partial<ReturnType<typeof emits2obj<NonNullable<typeof VanPasswordInput.emits>>>>>, default: () => ({}) },
        /** VanPasswordInput 组件的插槽 */
        passwordInputSlots: { type: Object as PropType<{
        }> },
        /** 点击事件, 当传递了此事件时, 会忽略内部打开弹窗操作 */
        onRowClick: { type: Function as PropType<(option: { open: () => void; close: () => void }, ev: MouseEvent) => void> },
        /** VanNumberKeyboard 组件的属性 */
        numberKeyboardProps: { type: Object as PropType<Partial<ComponentProps<typeof VanNumberKeyboard>>> },
        /** VanNumberKeyboard 组件的事件 - 兼容 vue2 版本 */
        numberKeyboardOn: { type: Object as PropType<Partial<ReturnType<typeof emits2obj<NonNullable<typeof VanNumberKeyboard.emits>>>>>, default: () => ({}) },
        /** VanNumberKeyboard 组件的插槽 */
        numberKeyboardSlots: { type: Object as PropType<{
            /** 自定义删除按键内容 */
            delete: ComponentType<CommonSlotsProps<any, any>>;
            /** 自定义左下角按键内容 */
            extraKey: ComponentType<CommonSlotsProps<any, any>>;
            /** 自定义标题栏左侧内容 */
            titleLeft: ComponentType<CommonSlotsProps<any, any>>;
        }> },
    } as const;
}
/** 组件传参 - 私有 */
export const passwordInputPropsPrivate = passwordInputPropsGeneric();
/** 组件传参 - 外部调用 */
export const passwordInputProps = {
    ...VanField.props as unknown as {},
    ...passwordInputPropsPrivate,
};
export type PasswordInputProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof passwordInputPropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function passwordInputEmitsGeneric<T>() {
    return {};
}
/** 组件事件 - 私有 */
export const passwordInputEmitsPrivate = passwordInputEmitsGeneric();
/** 组件事件 - 外部调用 */
export const passwordInputEmits = {
    ...VanField.emits,
    ...passwordInputEmitsPrivate,
};

export type PasswordInputEmits<T> = ReturnType<typeof passwordInputEmitsGeneric<T>>;

export interface PasswordInputSlots extends CommonSlots<any> {
}
