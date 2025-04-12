import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import { inputEmits as elInputEmits, inputProps as elInputProps } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, DynamicProps, FormItemProps, StaticProps } from '../share';
import { commonProps, formItemProps } from '../share';

/** 组件传参 - 私有 */
export function inputPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any> = Record<string, any>>() {
    type _Prop = typeof elInputProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elInputEmits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<T, InputSlotOption<T, Query, Option, OptionQuery>, Query, Option>,
        ...formItemProps as FormItemProps<Query, Option>,
        /** 组件静态属性(与 formItem 或内置的属性冲突时, 可通过该属性传递) */
        staticProps: { type: Object as PropType<StaticProps<_Prop>> },
        /** 组件动态属性 */
        dynamicProps: { type: Function as PropType<DynamicProps<_Prop, Query, Option>> },
        /** 是否实时触发搜索事件(当 wrapper.realtime 为 true 时, 可将该值设为 false 并设置抖动时间) */
        realtime: { type: Boolean as PropType<boolean>, default: true },
        /** 实时触发时防抖动的时间 */
        waitTime: { type: Number as PropType<number>, default: 300 },
        /** 是否显示清除按钮 @default true */
        clearable: { type: Boolean as PropType<boolean>, default: true },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            prefix: ((props: InputSlotOption<T, Query, Option, OptionQuery>) => any);
            suffix: ((props: InputSlotOption<T, Query, Option, OptionQuery>) => any);
            prepend: ((props: InputSlotOption<T, Query, Option, OptionQuery>) => any);
            append: ((props: InputSlotOption<T, Query, Option, OptionQuery>) => any);
        }>> },
    } as const;
}
/** 插槽配置项 */
export interface InputSlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    getFormItemProps: () => Partial<FormItemProps<Query, Option>>;
    getItemProps: () => Partial<ExtractPublicPropTypes<typeof elInputProps>>;
    getProps: () => InputProps<T, Query, Option, OptionQuery>;
    options: Option[];
    modelValue: T;
    onChange: (value: T) => void;
    onEnter: (ev: Event | KeyboardEvent) => void;
    class: string;
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
}
/** 组件传参 - 私有 */
export const inputPropsPrivate = inputPropsGeneric();
/** 组件传参 - 外部调用 */

export const inputProps = emits2props({
    ...elInputProps,
    ...inputPropsPrivate,
}, elInputEmits);
export type InputProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof inputPropsGeneric<T, Query, Option, OptionQuery>>>;

/** 组件事件 - 私有 */
export function inputEmitsGeneric<T>() {
    return {
        ...{} as typeof elInputEmits,
    };
}
/** 组件事件 - 私有 */
export const inputEmitsPrivate = inputEmitsGeneric();
/** 组件事件 - 外部调用 */
export const inputEmits = {
    ...elInputEmits,
    ...inputEmitsPrivate,
} as ReturnType<typeof inputEmitsGeneric<any>>;
export type InputEmits<T> = ReturnType<typeof inputEmitsGeneric<T>>;

export interface InputSlots extends CommonSlots<Record<string, any>> {
}
