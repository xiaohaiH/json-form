import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import { switchEmits as elSwitchEmits, switchProps as elSwitchProps } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, DynamicProps, FormItemProps, StaticProps } from '../share';
import { commonProps, formItemProps } from '../share';

/** 组件传参 - 私有 */
export function switchPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elSwitchProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elSwitchEmits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<T, SwitchSlotOption<T, Query, Option, OptionQuery>, Query, Option>,
        ...formItemProps as FormItemProps<Query, Option>,
        /** 组件静态属性(与 formItem 或内置的属性冲突时, 可通过该属性传递) */
        staticProps: { type: Object as PropType<StaticProps<_Prop>> },
        /** 组件动态属性 */
        dynamicProps: { type: Function as PropType<DynamicProps<_Prop, Query, Option>> },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            activeAction: ((props: SwitchSlotOption<T, Query, Option, OptionQuery>) => any);
            inactiveAction: ((props: SwitchSlotOption<T, Query, Option, OptionQuery>) => any);
        }>> },
    } as const;
}
/** 插槽配置项 */
export interface SwitchSlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    getFormItemProps: () => Partial<FormItemProps<Query, Option>>;
    getItemProps: () => Partial<ExtractPublicPropTypes<typeof elSwitchProps>>;
    getProps: () => SwitchProps<T, Query, Option, OptionQuery>;
    options: Option[];
    modelValue: T;
    onChange: (value: T) => void;
    class: string;
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
}
/** 组件传参 - 私有 */
export const switchPropsPrivate = switchPropsGeneric();
/** 组件传参 - 外部调用 */

export const switchProps = emits2props({
    ...elSwitchProps,
    ...switchPropsPrivate,
}) as typeof switchPropsPrivate;
export type SwitchProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof switchPropsGeneric<T, Query, Option, OptionQuery>>>;

/** 组件事件 - 私有 */
export function switchEmitsGeneric<T>() {
    return {
        ...{} as typeof elSwitchEmits,
    };
}
/** 组件事件 - 私有 */
export const switchEmitsPrivate = switchEmitsGeneric();
/** 组件事件 - 外部调用 */
export const switchEmits = {
    ...elSwitchEmits,
    ...switchEmitsPrivate,
} as ReturnType<typeof switchEmitsGeneric<any>>;
export type SwitchEmits<T> = ReturnType<typeof switchEmitsGeneric<T>>;

export interface SwitchSlots extends CommonSlots<Record<string, any>> {
}
