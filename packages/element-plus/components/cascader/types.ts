import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import type { CascaderNode } from 'element-plus';
import { ElCascader } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

const elCascaderProps = ElCascader.props as Obj2Props<ComponentProps<typeof ElCascader>>;
const elCascaderEmits = emits2obj(ElCascader.emits);

/** 组件传参 - 私有 */
export function cascaderPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elCascaderProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elCascaderEmits>]>>;
    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<Query, OptionQuery>,
        ...commonProps as CommonProps<_Prop, CascaderSlotOption<Query, OptionQuery>, Query, OptionQuery>,
        ...formItemProps as FormItemProps<Query, OptionQuery>,
        /** 是否可过滤 */
        filterable: { type: Boolean as PropType<boolean>, default: true },
        /** 是否可清除 */
        clearable: { type: Boolean as PropType<boolean>, default: true },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            default: ComponentType<CascaderSlotOption<Query, OptionQuery> & { node: any; data: any }>;
            empty: ComponentType<CascaderSlotOption<Query, OptionQuery>>;
            prefix: ComponentType<CascaderSlotOption<Query, OptionQuery>>;
            suggestionItem: ComponentType<CascaderSlotOption<Query, OptionQuery> & { item: CascaderNode }>;
        }>> },
    } as const;
}
/** 插槽配置项 */
export interface CascaderSlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
}
/** 组件传参 - 私有 */
export const cascaderPropsPrivate = cascaderPropsGeneric();
/** 组件传参 - 外部调用 */
export const cascaderProps = emits2props({
    ...elCascaderProps,
    ...cascaderPropsPrivate,
}, elCascaderEmits);
export type CascaderProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof cascaderPropsGeneric<Query, OptionQuery>>>;

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
