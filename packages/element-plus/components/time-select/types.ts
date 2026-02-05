import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import { ElTimeSelect } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

const elTimeSelectProps = ElTimeSelect.props as Obj2Props<ComponentProps<typeof ElTimeSelect>>;
const elTimeSelectEmits = emits2obj(ElTimeSelect.emits);

/** 组件传参 - 私有 */
export function timeSelectPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elTimeSelectProps;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<Query, OptionQuery>,
        ...commonProps as CommonProps<_Prop, TimeSelectSlotOption<Query, OptionQuery>, Query, OptionQuery>,
        ...formItemProps as FormItemProps<Query, OptionQuery>,
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
        }>> },
    } as const;
}
/** 插槽配置项 */
export interface TimeSelectSlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
}
/** 组件传参 - 私有 */
export const timeSelectPropsPrivate = timeSelectPropsGeneric();
/** 组件传参 - 外部调用 */

export const timeSelectProps = emits2props({
    ...elTimeSelectProps,
    ...timeSelectPropsPrivate,
}) as typeof timeSelectPropsPrivate;
export type TimeSelectProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof timeSelectPropsGeneric<Query, OptionQuery>>>;

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
