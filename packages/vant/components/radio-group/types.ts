import type { emits2obj, PlainProps } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import type { Radio as VanRadio } from 'vant';
import { Field as VanField, RadioGroup as VanRadioGroup } from 'vant';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { camelize } from 'vue';
import type { ComponentEmit, ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType } from '../share';
import { commonProps } from '../share';

/** 组件传参 - 私有 */
export function radioGroupPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    return {
        ...commonProps as CommonProps<Query, OptionQuery>,
        ...plainProps as PlainProps<Query, OptionQuery>,
        /** 输入框左侧文本 */
        label: { type: String },
        /** VanRadioGroup 组件的属性 */
        radioGroupProps: { type: Object as PropType<Partial<ComponentProps<typeof VanRadioGroup>>> },
        /** VanRadioGroup 组件的事件 - 兼容 vue2 版本 */
        radioGroupOn: { type: Object as PropType<Partial<ReturnType<typeof emits2obj<NonNullable<typeof VanRadioGroup.emits>>>>>, default: () => ({}) },
        /** 显示的标签 */
        labelKey: { type: String, default: 'label' },
        /** 提交的值 */
        valueKey: { type: String, default: 'value' },
        /** 是否可取消选中 */
        cancelable: { type: Boolean },
        /** VanRadio 组件的属性 */
        radioProps: { type: Object as PropType<Partial<ComponentProps<typeof VanRadio>>> },
        /** VanRadio 组件的事件 - 兼容 vue2 版本 */
        radioOn: { type: Object as PropType<Partial<ReturnType<typeof emits2obj<NonNullable<typeof VanRadio.emits>>>>>, default: () => ({}) },
        /** VanRadio 组件的插槽 */
        radioSlots: { type: Object as PropType<{
            /** 自定义文本 */
            default?: ComponentType<{ checked: boolean; disabled: boolean; item: any } & CommonSlotsProps<any, any>>;
            /** 自定义图标 */
            icon?: ComponentType<{ checked: boolean; disabled: boolean; item: any } & CommonSlotsProps<any, any>>;
        }> },
    } as const;
}
/** 组件传参 - 私有 */
export const radioGroupPropsPrivate = radioGroupPropsGeneric();
/** 组件传参 - 外部调用 */
export const radioGroupProps = {
    ...VanField.props as unknown as {},
    ...radioGroupPropsPrivate,
};
export type RadioGroupProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof radioGroupPropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function radioGroupEmitsGeneric<T>() {
    return {};
}
/** 组件事件 - 私有 */
export const radioGroupEmitsPrivate = radioGroupEmitsGeneric();
/** 组件事件 - 外部调用 */
export const radioGroupEmits = {
    ...VanField.emits,
    ...radioGroupEmitsPrivate,
};

export type RadioGroupEmits<T> = ReturnType<typeof radioGroupEmitsGeneric<T>>;

export interface RadioGroupSlots extends CommonSlots<any> {
}
