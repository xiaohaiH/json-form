import type { emits2obj, PlainProps } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import type { Radio, RadioProps as VantRadioProps } from 'vant';
import { Field as VanField, Radio as VanRadio } from 'vant';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { camelize } from 'vue';
import type { ComponentEmit, ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType } from '../share';
import { commonProps } from '../share';


/** 组件传参 - 私有 */
export function radioPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    return {
        ...commonProps as CommonProps<Query, OptionQuery>,
        ...plainProps as PlainProps<Query, OptionQuery>,
        /** 输入框左侧文本 */
        label: { type: String },
        /** VanRadio 组件的属性 */
        radioProps: { type: Object as PropType<Partial<ComponentProps<typeof VanRadio>>> },
        /** VanRadio 组件的事件 - 兼容 vue2 版本 */
        radioOn: { type: Object as PropType<Partial<ReturnType<typeof emits2obj<NonNullable<typeof VanRadio.emits>>>>>, default: () => ({}) },
        /** VanRadio 组件的插槽 */
        radioSlots: { type: Object as PropType<{
            /** 自定义文本 */
            default?: ComponentType<{ checked: boolean; disabled: boolean } & CommonSlotsProps<any, any>>;
            /** 自定义图标 */
            icon?: ComponentType<{ checked: boolean; disabled: boolean } & CommonSlotsProps<any, any>>;
        }> },
        /** 是否可取消选中 */
        cancelable: { type: Boolean, default: true },
    } as const;
}
/** 组件传参 - 私有 */
export const radioPropsPrivate = radioPropsGeneric();
/** 组件传参 - 外部调用 */
export const radioProps = {
    ...VanField.props as unknown as {},
    ...radioPropsPrivate,
};
export type RadioProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof radioPropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function radioEmitsGeneric<T>() {
    return {};
}
/** 组件事件 - 私有 */
export const radioEmitsPrivate = radioEmitsGeneric();
/** 组件事件 - 外部调用 */
export const radioEmits = {
    ...VanField.emits,
    ...radioEmitsPrivate,
};

export type RadioEmits<T> = ReturnType<typeof radioEmitsGeneric<T>>;

export interface RadioSlots extends CommonSlots<any> {
}
