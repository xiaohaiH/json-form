import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import type { TreeComponentProps } from 'element-plus';
import { ElTree } from 'element-plus';
import { SelectProps as elSelectProps } from 'element-plus/es/components/select/src/select';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, DynamicProps, FormItemProps, StaticProps } from '../share';
import { commonProps, formItemProps } from '../share';

/** 组件传参 - 私有 */
export function treeSelectPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = Obj2Props<TreeComponentProps> & typeof elSelectProps & ReturnType<typeof emits2props<null, [NonNullable<typeof ElTree.emits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<T, TreeSelectSlotOption<T, Query, Option, OptionQuery>, Query, Option>,
        ...formItemProps as FormItemProps<Query, Option>,
        /** 组件静态属性(与 formItem 或内置的属性冲突时, 可通过该属性传递) */
        staticProps: { type: Object as PropType<StaticProps<_Prop>> },
        /** 组件动态属性 */
        dynamicProps: { type: Function as PropType<DynamicProps<_Prop, Query, Option>> },
        /** 是否可过滤 */
        filterable: { type: Boolean as PropType<boolean>, default: true },
        /** 是否可清除 */
        clearable: { type: Boolean as PropType<boolean>, default: true },
        /** 过滤方法 */
        filterMethod: {
            type: Function as unknown as PropType<(val: string, option: unknown, index: number, arr: unknown[]) => boolean>,
        },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            header: ((props: TreeSelectSlotOption<T, Query, Option, OptionQuery>) => any);
            footer: ((props: TreeSelectSlotOption<T, Query, Option, OptionQuery>) => any);
            prefix: ((props: TreeSelectSlotOption<T, Query, Option, OptionQuery>) => any);
            empty: ((props: TreeSelectSlotOption<T, Query, Option, OptionQuery>) => any);
            tag: ((props: TreeSelectSlotOption<T, Query, Option, OptionQuery>) => any);
            loading: ((props: TreeSelectSlotOption<T, Query, Option, OptionQuery>) => any);
            label: ((props: TreeSelectSlotOption<T, Query, Option, OptionQuery>) => any);
        }>> },
    } as const;
}
export interface TreeSelectSlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    getFormItemProps: () => Partial<FormItemProps<Query, Option>>;
    getItemProps: () => Partial<ExtractPublicPropTypes<typeof elSelectProps>>;
    getProps: () => TreeSelectProps<T, Query, Option, OptionQuery>;
    options: Option[];
    modelValue: T;
    onChange: (value: T) => void;
    filterValue: string;
    filterMethod: ((val: string) => void) | undefined;
    class: string;
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
}
/** 组件传参 - 私有 */
export const treeSelectPropsPrivate = treeSelectPropsGeneric();
/** 组件传参 - 外部调用 */

export const treeSelectProps = emits2props({
    ...elSelectProps,
    ...ElTree.props as {},
    ...treeSelectPropsPrivate,
}) as typeof treeSelectPropsPrivate;
export type TreeSelectProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof treeSelectPropsGeneric<T, Query, Option, OptionQuery>>>;

/** 组件事件 - 私有 */
export function treeSelectEmitsGeneric<T>() {
    return {
        // ...{} as typeof elTreeSelectEmits,
    };
}
/** 组件事件 - 私有 */
export const treeSelectEmitsPrivate = treeSelectEmitsGeneric();
/** 组件事件 - 外部调用 */
export const treeSelectEmits = {
    change: (value: string) => true,
    blur: (ev: FocusEvent) => true,
    focus: (ev: FocusEvent) => true,
    clear: () => true,
    ...treeSelectEmitsPrivate,
} as ReturnType<typeof treeSelectEmitsGeneric<any>>;
export type TreeSelectEmits<T> = ReturnType<typeof treeSelectEmitsGeneric<T>>;

export interface TreeSelectSlots extends CommonSlots<Record<string, any>> {
}
