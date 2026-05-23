import type { emits2obj, PlainProps } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import { Field as VanField } from 'vant';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import type { CommonProps, CommonSlots, ComponentType } from '../share';
import { commonProps } from '../share';

/** 组件传参 - 私有 */
export function inputPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    return {
        ...commonProps as CommonProps<Query, OptionQuery>,
        ...plainProps as PlainProps<Query, OptionQuery>,
        /** 是否显示清除按钮 @default true */
        clearable: { type: Boolean as PropType<boolean>, default: true },
        /** 实时触发时防抖动的时间 */
        debounceTime: { type: Number as PropType<number>, default: 300 },
    } as const;
}
/** 组件传参 - 私有 */
export const inputPropsPrivate = inputPropsGeneric();
/** 组件传参 - 外部调用 */
export const inputProps = {
    ...VanField.props as unknown as {},
    ...inputPropsPrivate,
};
export type InputProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof inputPropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function inputEmitsGeneric<T>() {
    return {};
}
/** 组件事件 - 私有 */
export const inputEmitsPrivate = inputEmitsGeneric();
/** 组件事件 - 外部调用 */
export const inputEmits = {
    ...VanField.emits,
    ...inputEmitsPrivate,
};

export type InputEmits<T> = ReturnType<typeof inputEmitsGeneric<T>>;

export interface InputSlots extends CommonSlots<any> {
}
