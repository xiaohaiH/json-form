import type { Obj2Props } from '@xiaohaih/json-form-core';
import { ElFormItem } from 'element-plus';
import type { ExtractPropTypes, PropType, VNode } from 'vue';
import type { ComponentProps } from 'vue-component-type-helpers';

export interface SlotQuery {
    /** 是否禁用 */
    disabled: boolean;
    /** 绑定的值 */
    modelValue: any;
    /** 内部设置的类名 */
    class: string;
    /** 组件内部信息 */
    extraOption: {
        /** 表单信息值 */
        query: Record<string, any>;
        /** 触发外部搜索事件 */
        search: () => void;
        /** 触发内部搜索事件 */
        insideSearch: () => void;
    };
    [index: string]: string | number | boolean | ((...args: any[]) => any) | Record<string, any> | any[];
}

/** 公共属性 - 泛型 */
export function commonPropsGeneric<T, SlotProps, Query extends Record<string, any>, Option = Record<string, any>>() {
    return {
        /** 字段别名(优先级高于条件对象的 key) */
        as: { type: String as PropType<string> },
        // /** 开启排序时, 排序下标 @default 0 */
        // conditionSortIndex: { type: Number as PropType<number> },
        slots: { type: Object as PropType<Partial<{
            /** 取代默认组件 */
            default: string | number | Record<string, any> | ((props: SlotProps) => any);
            /** 组件前渲染 */
            before: string | number | Record<string, any> | ((props: SlotProps) => any);
            /** 组件后渲染 */
            after: string | number | Record<string, any> | ((props: SlotProps) => any);
            /** 尾缀 */
            postfix: string | number | Record<string, any> | (() => any);
        }>> },
    } as const;
}
/** 公共属性 */
export const commonProps = commonPropsGeneric();
export type CommonProps<T, SlotProps, Query extends Record<string, any>, Option> = ReturnType<typeof commonPropsGeneric<T, SlotProps, Query, Option>>;

const elFormItemProps = ElFormItem.props as Obj2Props<ComponentProps<typeof ElFormItem>>;

/** 表单属性 - 泛型 */
export function formItemPropsGeneric<Query extends Record<string, any>, Option>() {
    const { prop, ...itemProps } = elFormItemProps;
    return {
        ...itemProps,
        prop: { type: prop.type, validator: prop.validator },
        /** 表单项静态渲染的字段 */
        formItemProps: { type: Object as PropType<Partial<ExtractPropTypes<CustomFormItemProps>>> },
        /** 表单项返回动态渲染的字段 */
        formItemDynamicProps: { type: Function as PropType<(option: { query: Query }) => Partial<ExtractPropTypes<CustomFormItemProps>>> },
        class: { type: [Object, Array, String] as PropType<string | Record<string, any> | any[]> },
        style: { type: [Object, Array, String] as PropType<string | Record<string, any> | any[]> },
    } as const;
}
/** 表单属性 */
export const formItemProps = formItemPropsGeneric();
export type FormItemProps<Query extends Record<string, any>, Option> = ReturnType<typeof formItemPropsGeneric<Query, Option>>;
/**  */
type CustomFormItemProps = typeof elFormItemProps & {
    class: { type: PropType<string | Record<string, any> | any[]> };
    style: { type: PropType<string | Record<string, any> | any[]> };
};

/** 组件动态属性 */
export type DynamicProps<T extends Record<string, any>, Query extends Record<string, any>, Option = Record<string, any>> = (option: { query: Query }) => Partial<ExtractPropTypes<T>>;
/** 组件静态属性 */
export type StaticProps<T extends Record<string, any>> = Partial<ExtractPropTypes<T> & Partial<Record<'class' | 'style', string | Record<string, any> | any[]>>>;
export const formItemPropKeys = Object.keys(formItemProps).filter((k) => k !== 'formItemProps' && k !== 'formItemDynamicProps');

export interface CommonSlots<T> {
    /** 取代默认组件 */
    default?: ((props: T) => any);
    /** 在组件前渲染 */
    before?: ((props: T) => any);
    /** 在组件后渲染 */
    after?: ((props: T) => any);
    /** 在最后渲染 */
    postfix?: (() => any);
}
