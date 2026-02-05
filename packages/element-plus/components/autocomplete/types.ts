import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import { ElAutocomplete } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

const elAutocompleteProps = ElAutocomplete.props as Obj2Props<ComponentProps<typeof ElAutocomplete>>;
const elAutocompleteEmits = emits2obj(ElAutocomplete.emits);

/** 重写指定事件 */
const rewriteOn = {
    select: (item: any, option: {
        props: Omit<AutocompleteProps<any, any>, 'onSelect'>;
        plain: ReturnType<typeof usePlain<any, any>>;
    }) => true,
};

/** 组件传参 - 私有 */
export function autocompletePropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elAutocompleteProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elAutocompleteEmits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<Query, OptionQuery>,
        ...commonProps as CommonProps<_Prop, AutocompleteSlotOption<Query, OptionQuery>, Query, OptionQuery>,
        ...formItemProps as FormItemProps<Query, OptionQuery>,
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
        /** 在选中后, 使输入框失焦 */
        blurOnSelected: { type: Boolean, default: true },
        /** 是否显示清除按钮 @default true */
        clearable: { type: Boolean as PropType<boolean>, default: true },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            header: ComponentType<AutocompleteSlotOption<Query, OptionQuery>>;
            footer: ComponentType<AutocompleteSlotOption<Query, OptionQuery>>;
            default: ComponentType<AutocompleteSlotOption<Query, OptionQuery> & { item: any }>;
            prefix: ComponentType<AutocompleteSlotOption<Query, OptionQuery>>;
            suffix: ComponentType<AutocompleteSlotOption<Query, OptionQuery>>;
            prepend: ComponentType<AutocompleteSlotOption<Query, OptionQuery>>;
            append: ComponentType<AutocompleteSlotOption<Query, OptionQuery>>;
            loading: ComponentType<AutocompleteSlotOption<Query, OptionQuery>>;
        }>> },
        /** 重写 select 方法 */
        onSelect: { type: [Function, Array] as PropType<(item: any, option: {
            props: { query: Record<string, any>; [index: string]: any };
            plain: ReturnType<typeof usePlain<Query, OptionQuery>>;
        }) => void> },
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
export type AutocompleteProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof autocompletePropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function autocompleteEmitsGeneric<T>() {
    return {
        ...{} as typeof elAutocompleteEmits,
        ...rewriteOn,
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
