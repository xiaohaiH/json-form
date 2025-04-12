import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import { ElSelect } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, DynamicProps, FormItemProps, StaticProps } from '../share';
import { commonProps, formItemProps } from '../share';

const elSelectProps = ElSelect.props as Obj2Props<ComponentProps<typeof ElSelect>>;
const elSelectEmits = emits2obj(ElSelect.emits);

/** 组件传参 - 私有 */
export function selectPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elSelectProps;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<T, SelectSlotOption<T, Query, Option, OptionQuery>, Query, Option>,
        ...formItemProps as FormItemProps<Query, Option>,
        /** 组件静态属性(与 formItem 或内置的属性冲突时, 可通过该属性传递) */
        staticProps: { type: Object as PropType<StaticProps<_Prop>> },
        /** 组件动态属性 */
        dynamicProps: { type: Function as PropType<DynamicProps<_Prop, Query, Option>> },
        /** 是否将选项进行分组 */
        group: { type: Boolean as PropType<boolean>, default: undefined },
        /** 存在分组时的子级键 @default true */
        groupChildrenKey: { type: String as PropType<string>, default: 'children' },
        /** 展示的字段 */
        labelKey: { type: String as PropType<string>, default: 'label' },
        /** 提交的字段 */
        valueKey: { type: String as PropType<string>, default: 'value' },
        /** 是否将整个选项都作为值传递给 ElOption(相当于忽略 valueKey) */
        valueIsWhole: { type: Boolean as PropType<boolean>, default: undefined },
        /** 是否可过滤 */
        filterable: { type: Boolean as PropType<boolean>, default: true },
        /** 是否可清除 */
        clearable: { type: Boolean as PropType<boolean>, default: true },
        /** 过滤方法 */
        filterMethod: { type: Function as unknown as PropType<(val: string, option: T) => boolean> },
        /** 选项禁用字段 */
        disabledKey: { type: String as PropType<string>, default: 'disabled' },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            header: ((props: SelectSlotOption<T, Query, Option, OptionQuery>) => any);
            footer: ((props: SelectSlotOption<T, Query, Option, OptionQuery>) => any);
            prefix: ((props: SelectSlotOption<T, Query, Option, OptionQuery>) => any);
            empty: ((props: SelectSlotOption<T, Query, Option, OptionQuery>) => any);
            tag: ((props: SelectSlotOption<T, Query, Option, OptionQuery>) => any);
            loading: ((props: SelectSlotOption<T, Query, Option, OptionQuery>) => any);
            label: ((props: SelectSlotOption<T, Query, Option, OptionQuery>) => any);
            option: ((props: { item: Option; disabled?: boolean; parent?: Option }) => any);
        }>> },
    } as const;
}
export interface SelectSlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    getFormItemProps: () => Partial<FormItemProps<Query, Option>>;
    getItemProps: () => Partial<ExtractPublicPropTypes<typeof elSelectProps>>;
    getProps: () => SelectProps<T, Query, Option, OptionQuery>;
    options: Option[];
    modelValue: T;
    onChange: (value: T) => void;
    filterValue: string;
    filterMethod: ((val: string) => void) | undefined;
    class: string;
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
}
/** 组件传参 - 私有 */
export const selectPropsPrivate = selectPropsGeneric();
/** 组件传参 - 外部调用 */

export const selectProps = emits2props({
    ...elSelectProps,
    ...selectPropsPrivate,
});
export type SelectProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof selectPropsGeneric<T, Query, Option, OptionQuery>>>;

/** 组件事件 - 私有 */
export function selectEmitsGeneric<T>() {
    return {
        // ...{} as typeof elSelectEmits,
    };
}
/** 组件事件 - 私有 */
export const selectEmitsPrivate = selectEmitsGeneric();
/** 组件事件 - 外部调用 */
export const selectEmits = {
    change: (value: true) => true,
    visibleChange: (visible: boolean) => true,
    removeTag: (tagValue: any) => true,
    clear: () => true,
    blur: (event: FocusEvent) => true,
    focus: (event: FocusEvent) => true,
    popupScroll: (data: { scrollTop: number; scrollLeft: number }) => true,
    ...selectEmitsPrivate,
};
export type SelectEmits<T> = ReturnType<typeof selectEmitsGeneric<T>>;

export interface SelectSlots extends CommonSlots<Record<string, any>> {
    /** 下拉项插槽 */
    option?: ((props: { item: any; disabled?: boolean; parent?: any }) => any);
}
