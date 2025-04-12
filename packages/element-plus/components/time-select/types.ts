import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import { ElTimeSelect } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, DynamicProps, FormItemProps, StaticProps } from '../share';
import { commonProps, formItemProps } from '../share';

const elTimeSelectProps = ElTimeSelect.props as Obj2Props<ComponentProps<typeof ElTimeSelect>>;
const elTimeSelectEmits = emits2obj(ElTimeSelect.emits);

/** 组件传参 - 私有 */
export function timeSelectPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elTimeSelectProps;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<T, TimeSelectSlotOption<T, Query, Option, OptionQuery>, Query, Option>,
        ...formItemProps as FormItemProps<Query, Option>,
        /** 组件静态属性(与 formItem 或内置的属性冲突时, 可通过该属性传递) */
        staticProps: { type: Object as PropType<StaticProps<_Prop>> },
        /** 组件动态属性 */
        dynamicProps: { type: Function as PropType<DynamicProps<_Prop, Query, Option>> },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
        }>> },
    } as const;
}
/** 插槽配置项 */
export interface TimeSelectSlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    getFormItemProps: () => Partial<FormItemProps<Query, Option>>;
    getItemProps: () => Partial<ExtractPublicPropTypes<typeof elTimeSelectProps>>;
    getProps: () => TimeSelectProps<T, Query, Option, OptionQuery>;
    options: Option[];
    modelValue: T;
    onChange: (value: T) => void;
    class: string;
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
}
/** 组件传参 - 私有 */
export const timeSelectPropsPrivate = timeSelectPropsGeneric();
/** 组件传参 - 外部调用 */

export const timeSelectProps = emits2props({
    ...elTimeSelectProps,
    ...timeSelectPropsPrivate,
}) as typeof timeSelectPropsPrivate;
export type TimeSelectProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof timeSelectPropsGeneric<T, Query, Option, OptionQuery>>>;

/** 组件事件 - 私有 */
export function timeSelectEmitsGeneric<T>() {
    return {
        // ...{} as typeof elTimeSelectEmits,
    };
}
/** 组件事件 - 私有 */
export const timeSelectEmitsPrivate = timeSelectEmitsGeneric();
/** 组件事件 - 外部调用 */
export const timeSelectEmits = {
    change: (value: string) => true,
    blur: (ev: FocusEvent) => true,
    focus: (ev: FocusEvent) => true,
    clear: () => true,
    ...timeSelectEmitsPrivate,
} as ReturnType<typeof timeSelectEmitsGeneric<any>>;
export type TimeSelectEmits<T> = ReturnType<typeof timeSelectEmitsGeneric<T>>;

export interface TimeSelectSlots extends CommonSlots<Record<string, any>> {
}
