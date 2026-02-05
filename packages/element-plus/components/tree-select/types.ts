import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import type { ElSelect, TreeComponentProps } from 'element-plus';
import { ElTree, ElTreeSelect } from 'element-plus';
// import { SelectProps as elSelectProps } from 'element-plus/es/components/select/src/select';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

// 主动提取 props, 不从内部导入, 防止 2.9.5版本与高版本导出名称不一致
const elSelectProps = ElTreeSelect.props as Obj2Props<ComponentProps<typeof ElSelect> & ComponentProps<typeof ElTree>>;

/** 组件传参 - 私有 */
export function treeSelectPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    type _Prop = Obj2Props<TreeComponentProps> & typeof elSelectProps & ReturnType<typeof emits2props<null, [NonNullable<typeof ElTree.emits>]>>;

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

export const treeSelectProps = emits2props({
    ...elSelectProps,
    ...ElTree.props as {},
    ...treeSelectPropsPrivate,
}) as typeof treeSelectPropsPrivate;
export type TreeSelectProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof treeSelectPropsGeneric<Query, OptionQuery>>>;

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
