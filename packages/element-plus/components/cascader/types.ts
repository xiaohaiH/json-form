import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import type { CascaderNode } from 'element-plus';
import { ElCascader } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, DynamicProps, FormItemProps, StaticProps } from '../share';
import { commonProps, formItemProps } from '../share';

const elCascaderProps = ElCascader.props as Obj2Props<ComponentProps<typeof ElCascader>>;
const elCascaderEmits = emits2obj(ElCascader.emits);

/** 组件传参 - 私有 */
export function cascaderPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elCascaderProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elCascaderEmits>]>>;
    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<T, CascaderSlotOption<T, Query, Option, OptionQuery>, Query, Option>,
        ...formItemProps as FormItemProps<Query, Option>,
        /** 组件静态属性(与 formItem 或内置的属性冲突时, 可通过该属性传递) */
        staticProps: { type: Object as PropType<StaticProps<_Prop>> },
        /** 组件动态属性 */
        dynamicProps: { type: Function as PropType<DynamicProps<_Prop, Query, Option>> },
        /** 是否可过滤 */
        filterable: { type: Boolean as PropType<boolean>, default: true },
        /** 是否可清除 */
        clearable: { type: Boolean as PropType<boolean>, default: true },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            default: ((props: CascaderSlotOption<T, Query, Option, OptionQuery> & { node: any; data: T }) => any);
            empty: ((props: CascaderSlotOption<T, Query, Option, OptionQuery>) => any);
            prefix: ((props: CascaderSlotOption<T, Query, Option, OptionQuery>) => any);
            suggestionItem: ((props: CascaderSlotOption<T, Query, Option, OptionQuery> & { item: CascaderNode }) => any);
        }>> },
    } as const;
}
/** 插槽配置项 */
export interface CascaderSlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    getFormItemProps: () => Partial<FormItemProps<Query, Option>>;
    getItemProps: () => Partial<ExtractPublicPropTypes<typeof elCascaderProps>>;
    getProps: () => CascaderProps<T, Query, Option, OptionQuery>;
    options: Option[];
    modelValue: T;
    onChange: (value: T) => void;
    class: string;
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
}
/** 组件传参 - 私有 */
export const cascaderPropsPrivate = cascaderPropsGeneric();
/** 组件传参 - 外部调用 */
export const cascaderProps = emits2props({
    ...elCascaderProps,
    ...cascaderPropsPrivate,
}, elCascaderEmits);
export type CascaderProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof cascaderPropsGeneric<T, Query, Option, OptionQuery>>>;

/** 组件事件 - 私有 */
export function cascaderEmitsGeneric<T>() {
    return {
        ...{} as typeof elCascaderEmits,
    };
}
/** 组件事件 - 私有 */
export const cascaderEmitsPrivate = cascaderEmitsGeneric();
/** 组件事件 - 外部调用 */
export const cascaderEmits = {
    ...elCascaderEmits,
    ...cascaderEmitsPrivate,
};
export type CascaderEmits<T> = ReturnType<typeof cascaderEmitsGeneric<T>>;

export interface CascaderSlots extends CommonSlots<Record<string, any>> {
}
