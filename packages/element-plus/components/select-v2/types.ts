import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import { ElSelectV2 } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, DynamicProps, FormItemProps, StaticProps } from '../share';
import { commonProps, formItemProps } from '../share';

const elSelectV2Props = ElSelectV2.props as Obj2Props<ComponentProps<typeof ElSelectV2>>;
const elSelectV2Emits = emits2obj(ElSelectV2.emits);

/** 组件传参 - 私有 */
export function selectV2PropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elSelectV2Props & ReturnType<typeof emits2props<null, [NonNullable<typeof elSelectV2Emits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<T, SelectV2SlotOption<T, Query, Option, OptionQuery>, Query, Option>,
        ...formItemProps as FormItemProps<Query, Option>,
        /** 组件静态属性(与 formItem 或内置的属性冲突时, 可通过该属性传递) */
        staticProps: { type: Object as PropType<StaticProps<_Prop>> },
        /** 组件动态属性 */
        dynamicProps: { type: Function as PropType<DynamicProps<_Prop, Query, Option>> },
        /** 展示的字段 */
        labelKey: { type: String as PropType<string>, default: 'label' },
        /** 提交的字段 */
        valueKey: { type: String as PropType<string>, default: 'value' },
        /** 是否可过滤 */
        filterable: { type: Boolean as PropType<boolean>, default: true },
        /** 是否可清除 */
        clearable: { type: Boolean as PropType<boolean>, default: true },
        /** 过滤方法 */
        filterMethod: { type: Function as unknown as PropType<(val: string, option: T) => boolean> },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            header: ((props: SelectV2SlotOption<T, Query, Option, OptionQuery>) => any);
            footer: ((props: SelectV2SlotOption<T, Query, Option, OptionQuery>) => any);
            prefix: ((props: SelectV2SlotOption<T, Query, Option, OptionQuery>) => any);
            empty: ((props: SelectV2SlotOption<T, Query, Option, OptionQuery>) => any);
            tag: ((props: SelectV2SlotOption<T, Query, Option, OptionQuery>) => any);
            loading: ((props: SelectV2SlotOption<T, Query, Option, OptionQuery>) => any);
            label: ((props: SelectV2SlotOption<T, Query, Option, OptionQuery>) => any);
        }>> },
    } as const;
}
export interface SelectV2SlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    getFormItemProps: () => Partial<FormItemProps<Query, Option>>;
    getItemProps: () => Partial<ExtractPublicPropTypes<typeof elSelectV2Props>>;
    getProps: () => SelectV2Props<T, Query, Option, OptionQuery>;
    options: Option[];
    modelValue: T;
    onChange: (value: T) => void;
    filterValue: string;
    filterMethod: ((val: string) => void) | undefined;
    class: string;
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
}
/** 组件传参 - 私有 */
export const selectV2PropsPrivate = selectV2PropsGeneric();
/** 组件传参 - 外部调用 */

export const selectV2Props = emits2props({
    ...elSelectV2Props,
    ...selectV2PropsPrivate,
});
export type SelectV2Props<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof selectV2PropsGeneric<T, Query, Option, OptionQuery>>>;

/** 组件事件 - 私有 */
export function selectV2EmitsGeneric<T>() {
    return {
        ...{} as typeof elSelectV2Emits,
    };
}
/** 组件事件 - 私有 */
export const selectV2EmitsPrivate = selectV2EmitsGeneric();
/** 组件事件 - 外部调用 */
export const selectV2Emits = {
    ...elSelectV2Emits,
    ...selectV2EmitsPrivate,
};
export type SelectV2Emits<T> = ReturnType<typeof selectV2EmitsGeneric<T>>;

export interface SelectV2Slots extends CommonSlots<Record<string, any>> {
}
