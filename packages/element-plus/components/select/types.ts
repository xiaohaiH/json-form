import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import { ElSelect } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

const elSelectProps = ElSelect.props as Obj2Props<ComponentProps<typeof ElSelect>>;
const elSelectEmits = emits2obj(ElSelect.emits);

/** 组件传参 - 私有 */
export function selectPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elSelectProps;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<Query, OptionQuery>,
        ...commonProps as CommonProps<_Prop, SelectSlotOption<Query, OptionQuery>, Query, OptionQuery>,
        ...formItemProps as FormItemProps<Query, OptionQuery>,
        /** 是否将选项进行分组 */
        group: { type: Boolean as PropType<boolean>, default: undefined },
        /** 存在分组时的子级键 @default children */
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
        filterMethod: { type: Function as unknown as PropType<(val: string, option: any) => boolean> },
        /** 选项禁用字段 */
        disabledKey: { type: String as PropType<string>, default: 'disabled' },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            header: ComponentType<SelectSlotOption<Query, OptionQuery>>;
            footer: ComponentType<SelectSlotOption<Query, OptionQuery>>;
            prefix: ComponentType<SelectSlotOption<Query, OptionQuery>>;
            empty: ComponentType<SelectSlotOption<Query, OptionQuery>>;
            tag: ComponentType<SelectSlotOption<Query, OptionQuery>>;
            loading: ComponentType<SelectSlotOption<Query, OptionQuery>>;
            label: ComponentType<SelectSlotOption<Query, OptionQuery>>;
            option: ComponentType<{ item: any; disabled?: boolean; parent?: any }>;
        }>> },
    } as const;
}
export interface SelectSlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
    filterValue: string;
    /** 主动触发远程搜索 */
    remoteMethod: (val: string) => void;
}
/** 组件传参 - 私有 */
export const selectPropsPrivate = selectPropsGeneric();
/** 组件传参 - 外部调用 */

export const selectProps = emits2props({
    ...elSelectProps,
    ...selectPropsPrivate,
});
export type SelectProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof selectPropsGeneric<Query, OptionQuery>>>;

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
    change: (value: any) => true,
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
    option?: ComponentType<{ item: any; disabled?: boolean; parent?: any }>;
}
