import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import { segmentedEmits as elSegmentedEmits, segmentedProps as elSegmentedProps } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, DynamicProps, FormItemProps, StaticProps } from '../share';
import { commonProps, formItemProps } from '../share';

/** 组件传参 - 私有 */
export function segmentedPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any> = Record<string, any>>() {
    type _Prop = typeof elSegmentedProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elSegmentedEmits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<T, SegmentedSlotOption<T, Query, Option, OptionQuery>, Query, Option>,
        ...formItemProps as FormItemProps<Query, Option>,
        /** 组件静态属性(与 formItem 或内置的属性冲突时, 可通过该属性传递) */
        staticProps: { type: Object as PropType<StaticProps<_Prop>> },
        /** 组件动态属性 */
        dynamicProps: { type: Function as PropType<DynamicProps<_Prop, Query, Option>> },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            default: ((props: SegmentedSlotOption<T, Query, Option, OptionQuery> & { item: Option}) => any);
        }>> },
    } as const;
}
/** 插槽配置项 */
export interface SegmentedSlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    getFormItemProps: () => Partial<FormItemProps<Query, Option>>;
    getItemProps: () => Partial<ExtractPublicPropTypes<typeof elSegmentedProps>>;
    getProps: () => SegmentedProps<T, Query, Option, OptionQuery>;
    options: Option[];
    modelValue: T;
    onChange: (value: T) => void;
    class: string;
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
}
/** 组件传参 - 私有 */
export const segmentedPropsPrivate = segmentedPropsGeneric();
/** 组件传参 - 外部调用 */
export const segmentedProps = emits2props({
    ...elSegmentedProps,
    ...segmentedPropsPrivate,
}, elSegmentedEmits);
export type SegmentedProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof segmentedPropsGeneric<T, Query, Option, OptionQuery>>>;

/** 组件事件 - 私有 */
export function segmentedEmitsGeneric<T>() {
    return {
        ...{} as typeof elSegmentedEmits,
    };
}
/** 组件事件 - 私有 */
export const segmentedEmitsPrivate = segmentedEmitsGeneric();
/** 组件事件 - 外部调用 */
export const segmentedEmits = {
    ...elSegmentedEmits,
    ...segmentedEmitsPrivate,
} as ReturnType<typeof segmentedEmitsGeneric<any>>;
export type SegmentedEmits<T> = ReturnType<typeof segmentedEmitsGeneric<T>>;

export interface SegmentedSlots extends CommonSlots<Record<string, any>> {
}
