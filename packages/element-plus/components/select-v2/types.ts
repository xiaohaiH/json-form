import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import { ElSelectV2 } from 'element-plus';
import type ElSelectV2Type from 'element-plus/es/components/select-v2/src/select.vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

const elSelectV2Props = ElSelectV2.props as Obj2Props<ComponentProps<typeof ElSelectV2Type>>;
const elSelectV2Emits = emits2obj(ElSelectV2.emits);

/** 组件传参 - 私有 */
export function selectV2PropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elSelectV2Props & ReturnType<typeof emits2props<null, [NonNullable<typeof elSelectV2Emits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<_Prop, SelectV2SlotOption<Query, OptionQuery>, Query, Option>,
        ...formItemProps as FormItemProps<Query, Option>,
        /** 是否可过滤 */
        filterable: { type: Boolean as PropType<boolean>, default: true },
        /** 是否可清除 */
        clearable: { type: Boolean as PropType<boolean>, default: true },
        /** 过滤方法 */
        filterMethod: { type: Function as unknown as PropType<(val: string, option: T) => boolean> },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            default: ComponentType<SelectV2SlotOption<Query, OptionQuery>>;
            header: ComponentType<SelectV2SlotOption<Query, OptionQuery>>;
            footer: ComponentType<SelectV2SlotOption<Query, OptionQuery>>;
            prefix: ComponentType<SelectV2SlotOption<Query, OptionQuery>>;
            empty: ComponentType<SelectV2SlotOption<Query, OptionQuery>>;
            tag: ComponentType<SelectV2SlotOption<Query, OptionQuery>>;
            loading: ComponentType<SelectV2SlotOption<Query, OptionQuery>>;
            label: ComponentType<SelectV2SlotOption<Query, OptionQuery>>;
        }>> },
    } as const;
}
export interface SelectV2SlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
    filterValue: string;
    /** 主动触发远程搜索 */
    remoteMethod: (val: string) => void;
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
