import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import type { ElSelect, TreeComponentProps } from 'element-plus';
import { ElTree, ElTreeSelect } from 'element-plus';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

const elTreeSelectProps = ElTreeSelect.props as unknown as Obj2Props<ComponentProps<typeof ElSelect> & ComponentProps<typeof ElTree>>;

/** 组件传参 - 私有 */
export function treeSelectPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elTreeSelectProps;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<Query, OptionQuery>,
        ...commonProps as CommonProps<_Prop, TreeSelectSlotOption<Query, OptionQuery>, Query, OptionQuery>,
        ...formItemProps as FormItemProps<Query, OptionQuery>,
        /** 是否可过滤 */
        filterable: { type: Boolean as PropType<boolean>, default: true },
        /** 是否可清除 */
        clearable: { type: Boolean as PropType<boolean>, default: true },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            header: ComponentType<TreeSelectSlotOption<Query, OptionQuery>>;
            footer: ComponentType<TreeSelectSlotOption<Query, OptionQuery>>;
            prefix: ComponentType<TreeSelectSlotOption<Query, OptionQuery>>;
            empty: ComponentType<TreeSelectSlotOption<Query, OptionQuery>>;
            tag: ComponentType<TreeSelectSlotOption<Query, OptionQuery>>;
            loading: ComponentType<TreeSelectSlotOption<Query, OptionQuery>>;
            label: ComponentType<TreeSelectSlotOption<Query, OptionQuery>>;
        }>> },
    } as const;
}
export interface TreeSelectSlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
    /** 主动触发远程搜索 */
    remoteMethod: (val: string) => void;
}
/** 组件传参 - 私有 */
export const treeSelectPropsPrivate = treeSelectPropsGeneric();
/** 组件传参 - 外部调用 */

export const treeSelectProps = {
    ...elTreeSelectProps,
    ...ElTree.props as {},
    ...treeSelectPropsPrivate,
};
export type TreeSelectProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof treeSelectPropsGeneric<Query, OptionQuery>>>;

/** 组件事件 - 私有 */
export function treeSelectEmitsGeneric<T>() {
    return {
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
}
export type TreeSelectEmits<T> = ReturnType<typeof treeSelectEmitsGeneric<T>>;

export interface TreeSelectSlots extends CommonSlots<Record<string, any>> {
}
