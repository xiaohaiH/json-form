import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import { ElSwitch } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

const elSwitchProps = ElSwitch.props as unknown as Obj2Props<ComponentProps<typeof ElSwitch>>;
const elSwitchEmits = emits2obj(ElSwitch.emits);

/** 组件传参 - 私有 */
export function switchPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elSwitchProps;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<Query, OptionQuery>,
        ...commonProps as CommonProps<_Prop, SwitchSlotOption<Query, OptionQuery>, Query, OptionQuery>,
        ...formItemProps as FormItemProps<Query, OptionQuery>,
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            activeAction: ComponentType<SwitchSlotOption<Query, OptionQuery>>;
            inactiveAction: ComponentType<SwitchSlotOption<Query, OptionQuery>>;
        }>> },
    } as const;
}
/** 插槽配置项 */
export interface SwitchSlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
}
/** 组件传参 - 私有 */
export const switchPropsPrivate = switchPropsGeneric();
/** 组件传参 - 外部调用 */

export const switchProps = {
    ...elSwitchProps,
    ...switchPropsPrivate,
};
export type SwitchProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof switchPropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function switchEmitsGeneric<T>() {
    return {
    };
}
/** 组件事件 - 私有 */
export const switchEmitsPrivate = switchEmitsGeneric();
/** 组件事件 - 外部调用 */
export const switchEmits = {
    ...elSwitchEmits,
    ...switchEmitsPrivate,
};
export type SwitchEmits<T> = ReturnType<typeof switchEmitsGeneric<T>>;

export interface SwitchSlots extends CommonSlots<Record<string, any>> {
}
