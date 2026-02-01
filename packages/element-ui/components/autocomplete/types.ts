import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import type { Input as ElInput } from 'element-ui';
import { Autocomplete as ElAutocomplete } from 'element-ui';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { Component, ExtractPropTypes, PropType } from 'vue-demi';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, ElObj2Props, FormItemProps } from '../share';
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
        ...commonProps as CommonProps<_Prop, AutocompleteSlotOption<Query, OptionQuery>, Query, Option>,
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
        /** 是否显示清除按钮 @default true */
        clearable: { type: Boolean as PropType<boolean>, default: true },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            // header: ComponentType<AutocompleteSlotOption<Query, OptionQuery>>;
            // footer: ComponentType<AutocompleteSlotOption<Query, OptionQuery>>;
            default: ComponentType<AutocompleteSlotOption<Query, OptionQuery> & { item: any }>;
            prefix: ComponentType<AutocompleteSlotOption<Query, OptionQuery>>;
            suffix: ComponentType<AutocompleteSlotOption<Query, OptionQuery>>;
            prepend: ComponentType<AutocompleteSlotOption<Query, OptionQuery>>;
            append: ComponentType<AutocompleteSlotOption<Query, OptionQuery>>;
            // loading: ComponentType<AutocompleteSlotOption<Query, OptionQuery>>;
        }>>, default: () => ({}) },
    } as const;
}
/** 插槽配置项 */
export interface AutocompleteSlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
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
