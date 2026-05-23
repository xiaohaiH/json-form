import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import { ElSegmented } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

const elSegmentedProps = ElSegmented.props as unknown as Obj2Props<ComponentProps<typeof ElSegmented>>;
const elSegmentedEmits = emits2obj(ElSegmented.emits);

/** 组件传参 - 私有 */
export function segmentedPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elSegmentedProps;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<Query, OptionQuery>,
        ...commonProps as CommonProps<_Prop, SegmentedSlotOption<Query, OptionQuery>, Query, OptionQuery>,
        ...formItemProps as FormItemProps<Query, OptionQuery>,
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            default: ComponentType<SegmentedSlotOption<Query, OptionQuery> & { item: any }>;
        }>> },
    } as const;
}
/** 插槽配置项 */
export interface SegmentedSlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
}
/** 组件传参 - 私有 */
export const segmentedPropsPrivate = segmentedPropsGeneric();
/** 组件传参 - 外部调用 */
export const segmentedProps = {
    ...elSegmentedProps,
    ...segmentedPropsPrivate,
};
export type SegmentedProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof segmentedPropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function segmentedEmitsGeneric<T>() {
    return {
    };
}
/** 组件事件 - 私有 */
export const segmentedEmitsPrivate = segmentedEmitsGeneric();
/** 组件事件 - 外部调用 */
export const segmentedEmits = {
    ...elSegmentedEmits,
    ...segmentedEmitsPrivate,
};
export type SegmentedEmits<T> = ReturnType<typeof segmentedEmitsGeneric<T>>;

export interface SegmentedSlots extends CommonSlots<Record<string, any>> {
}
