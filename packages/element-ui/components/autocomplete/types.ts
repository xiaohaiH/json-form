import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import type { Input as ElInput } from 'element-ui';
import { Autocomplete as ElAutocomplete } from 'element-ui';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { Component, ExtractPropTypes, PropType } from 'vue-demi';
import type { CommonProps, CommonSlots, ComponentType, DynamicProps, ElObj2Props, FormItemProps, StaticProps } from '../share';
import { commonProps, formItemProps } from '../share';

/**  */
const elAutocompleteProps = (ElAutocomplete as any).props as ElObj2Props<ElAutocomplete> & ElObj2Props<ElInput>;
const elAutocompleteEmits = {
    /** 点击选中建议项时触发 */
    select: (item: any) => true,
    /** 在 Input 值改变时触发 */
    change: (value: string) => true,
};

/** 组件传参 - 私有 */
export function autocompletePropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any> = Record<string, any>>() {
    type _Prop = typeof elAutocompleteProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elAutocompleteEmits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<T, AutocompleteSlotOption<T, Query, Option, OptionQuery>, Query, Option>,
        ...formItemProps as FormItemProps<Query, Option>,
        /** 输入建议对象中用于显示的键名 */
        valueKey: { type: String as PropType<string>, default: 'value' },
        // /**
        //  * @deprecated 推荐用 getOptions 方法, 亦支持远程搜索(remoteFilter: true)
        //  * 如外部传递该属性, 内置的 getOptions 方法会失效
        //  */
        // fetchSuggestions: { type: [Array, Function] as PropType<Record<string, any>[] | ((filterValue: string, cb: (data: Record<string, any>[]) => void) => void)> },
        /** 开启基于 getOptions 的远程搜索 */
        remoteFilter: { type: Boolean as PropType<boolean>, default: undefined },
        /** 自定义过滤逻辑(由于重写了 fetchSuggestions, 导致组件自身的过滤逻辑失效) */
        filterMethod: { type: Function as PropType<(value: string, item: any, valueKey: string) => boolean>, default: (value: string, item: any, valueKey: string) => item[valueKey] && item[valueKey].includes(value) },
        /** 组件静态属性(与 formItem 或内置的属性冲突时, 可通过该属性传递) */
        staticProps: { type: Object as PropType<StaticProps<_Prop>> },
        /** 组件动态属性 */
        dynamicProps: { type: Function as PropType<DynamicProps<_Prop, Query, Option>> },
        /** 是否显示清除按钮 @default true */
        clearable: { type: Boolean as PropType<boolean>, default: true },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            // header: ComponentType<AutocompleteSlotOption<T, Query, Option, OptionQuery>>;
            // footer: ComponentType<AutocompleteSlotOption<T, Query, Option, OptionQuery>>;
            default: ComponentType<AutocompleteSlotOption<T, Query, Option, OptionQuery> & { item: any }>;
            prefix: ComponentType<AutocompleteSlotOption<T, Query, Option, OptionQuery>>;
            suffix: ComponentType<AutocompleteSlotOption<T, Query, Option, OptionQuery>>;
            prepend: ComponentType<AutocompleteSlotOption<T, Query, Option, OptionQuery>>;
            append: ComponentType<AutocompleteSlotOption<T, Query, Option, OptionQuery>>;
            // loading: ComponentType<AutocompleteSlotOption<T, Query, Option, OptionQuery>>;
        }>>, default: () => ({}) },
        /** 重写 select 方法 */
        onSelect: { type: [Function, Array] as PropType<(item: any, option: {
            props: { query: Record<string, any>; [index: string]: any };
            plain: ReturnType<typeof usePlain<any, any, any, any>>;
        }) => void> },
    } as const;
}
/** 插槽配置项 */
export interface AutocompleteSlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    getFormItemProps: () => Partial<FormItemProps<Query, Option>>;
    getItemProps: () => Partial<ExtractPropTypes<typeof elAutocompleteProps>>;
    getProps: () => AutocompleteProps<T, Query, Option, OptionQuery>;
    extraOptions: {
        modelValue: T;
        options: Option[];
        onChange: (value: T) => void;
        onEnter: (ev: Event | KeyboardEvent) => void;
    };
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
}
/** 组件传参 - 私有 */
export const autocompletePropsPrivate = autocompletePropsGeneric();
/** 组件传参 - 外部调用 */
export const autocompleteProps = emits2props({
    ...elAutocompleteProps,
    ...autocompletePropsPrivate,
}, elAutocompleteEmits);
export type AutocompleteProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = Partial<ExtractPropTypes<ReturnType<typeof autocompletePropsGeneric<T, Query, Option, OptionQuery>>>>;

/** 组件事件 - 私有 */
export function autocompleteEmitsGeneric<T>() {
    return {
        ...{} as typeof elAutocompleteEmits,
        /** 重写选中事件 */
        select: (item: any, option: {
            props: Record<string, any>;
            // props: AutocompleteProps<T, any, any, any>;
            plain: ReturnType<typeof usePlain<T, any, any, any>>;
        }) => true,
    };
}
/** 组件事件 - 私有 */
export const autocompleteEmitsPrivate = autocompleteEmitsGeneric();
/** 组件事件 - 外部调用 */
export const autocompleteEmits = {
    ...elAutocompleteEmits,
    ...autocompleteEmitsPrivate,
};
export type AutocompleteEmits<T> = ReturnType<typeof autocompleteEmitsGeneric<T>>;

export interface AutocompleteSlots extends CommonSlots<Record<string, any>> {
}
