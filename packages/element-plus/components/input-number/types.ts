import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import { inputNumberEmits as elInputNumberEmits, inputNumberProps as elInputNumberProps } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, ComponentType, DynamicProps, FormItemProps, StaticProps } from '../share';
import { commonProps, formItemProps } from '../share';

/** 组件传参 - 私有 */
export function inputNumberPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elInputNumberProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elInputNumberEmits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<T, InputNumberSlotOption<T, Query, Option, OptionQuery>, Query, Option>,
        ...formItemProps as FormItemProps<Query, Option>,
        /** 组件静态属性(与 formItem 或内置的属性冲突时, 可通过该属性传递) */
        staticProps: { type: Object as PropType<StaticProps<_Prop>> },
        /** 组件动态属性 */
        dynamicProps: { type: Function as PropType<DynamicProps<_Prop, Query, Option>> },
        /** 延迟触发抖动时长(单位 ms) */
        debounceTime: { type: Number as PropType<number>, default: undefined },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            prefix: ComponentType<InputNumberSlotOption<T, Query, Option, OptionQuery>>;
            suffix: ComponentType<InputNumberSlotOption<T, Query, Option, OptionQuery>>;
            decreaseIcon: ComponentType<InputNumberSlotOption<T, Query, Option, OptionQuery>>;
            increaseIcon: ComponentType<InputNumberSlotOption<T, Query, Option, OptionQuery>>;
        }>> },
    } as const;
}
/** 插槽配置项 */
export interface InputNumberSlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    getFormItemProps: () => Partial<FormItemProps<Query, Option>>;
    getItemProps: () => Partial<ExtractPublicPropTypes<typeof elInputNumberProps>>;
    getProps: () => InputNumberProps<T, Query, Option, OptionQuery>;
    extraOptions: {
        modelValue: T;
        options: Option[];
        onChange: (value: T) => void;
    };
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
}
/** 组件传参 - 私有 */
export const inputNumberPropsPrivate = inputNumberPropsGeneric();
/** 组件传参 - 外部调用 */

export const inputNumberProps = emits2props({
    ...elInputNumberProps,
    ...inputNumberPropsPrivate,
}, elInputNumberEmits) as typeof inputNumberPropsPrivate;
export type InputNumberProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof inputNumberPropsGeneric<T, Query, Option, OptionQuery>>>;

/** 组件事件 - 私有 */
export function inputNumberEmitsGeneric<T>() {
    return {
        ...{} as typeof elInputNumberEmits,
    };
}
/** 组件事件 - 私有 */
export const inputNumberEmitsPrivate = inputNumberEmitsGeneric();
/** 组件事件 - 外部调用 */
export const inputNumberEmits = {
    ...elInputNumberEmits,
    ...inputNumberEmitsPrivate,
} as ReturnType<typeof inputNumberEmitsGeneric<any>>;
export type InputNumberEmits<T> = ReturnType<typeof inputNumberEmitsGeneric<T>>;

export interface InputNumberSlots extends CommonSlots<Record<string, any>> {
}
