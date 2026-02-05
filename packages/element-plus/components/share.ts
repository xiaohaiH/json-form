import type { Obj2Props, usePlain } from '@xiaohaih/json-form-core';
import { ElFormItem } from 'element-plus';
import type { AsyncComponentOptions, Component, ComponentOptions, ComponentPublicInstance, DefineComponent, ExtractPropTypes, FunctionalComponent, PropType, Raw, VNode } from 'vue';
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
export function commonPropsGeneric<ContentProps, SlotProps, Query extends Record<string, any>, OptionQuery = Record<string, any>>() {
    return {
        /**
         * @deprecated 表单项动态属性 - 下个版本删除
         * 可改用 defineOption 的函数形式获取 query
         * @example
         * ```
         * defineOption(({ query }) => ([
         *     { field: '警号', t: 'input', placeholder: !query.name ? '请输入警号' : '请先选择用户', ... }
         * ]));
         * ```
         */
        dynamicProps: { type: Function as PropType<(opt: Record<'query', any>) => Record<string, any>> },
        /** 传递给表单元素的属性 - 在与 FormItem props 冲突时使用 */
        contentProps: { type: Object as PropType<Partial<ExtractPropTypes<ContentProps> & Record<'class' | 'style', any>>> },
        /** @deprecated 字段别名(优先级高于条件对象的 key) - 下个版本删除 */
        as: { type: String as PropType<string> },
        // /** 开启排序时, 排序下标 @default 0 */
        // conditionSortIndex: { type: Number as PropType<number> },
        slots: { type: Object as PropType<Partial<{
            /** 取代默认组件 */
            default: ComponentType<SlotProps>;
            /** 组件前渲染 */
            before: ComponentType<SlotProps>;
            /** 组件后渲染 */
            after: ComponentType<SlotProps>;
            /** 尾缀 */
            postfix: ComponentType<{}>;
        }>> },
    } as const;
}
/** 公共属性 */
export const commonProps = commonPropsGeneric();
export type CommonProps<ContentProps, SlotProps, Query extends Record<string, any>, OptionQuery> = ReturnType<typeof commonPropsGeneric<ContentProps, SlotProps, Query, OptionQuery>>;

const elFormItemProps = ElFormItem.props as unknown as Obj2Props<ComponentProps<typeof ElFormItem>>;

/** 表单属性 - 泛型 */
export function formItemPropsGeneric<Query extends Record<string, any>, OptionQuery>() {
    const { prop, ...itemProps } = elFormItemProps;
    return {
        ...itemProps,
        prop: { type: prop.type, validator: prop.validator },
        class: { type: [Object, Array, String] as PropType<string | Record<string, any> | any[]> },
        style: { type: [Object, Array, String] as PropType<string | Record<string, any> | any[]> },
    } as const;
}
/** 表单属性 */
export const formItemProps = formItemPropsGeneric();
export type FormItemProps<Query extends Record<string, any>, OptionQuery> = ReturnType<typeof formItemPropsGeneric<Query, OptionQuery>>;
export const formItemPropKeys = Object.keys(formItemProps);

export interface CommonSlots<T> {
    /** 取代默认组件 */
    default?: ComponentType<T>;
    /** 在组件前渲染 */
    before?: ComponentType<T>;
    /** 在组件后渲染 */
    after?: ComponentType<T>;
    /** 在最后渲染 */
    postfix?: ComponentType;
}

export interface CommonSlotsProps<Query extends Record<string, any>, Options extends Record<string, any>> {
    // formItemProps: Partial<ExtracedPropTypes<typeof formItemProps>>;
    // contentProps: Record<string, any>;
    props: Record<string, any>;
    plain: ReturnType<typeof usePlain<Query, Options>>;
}

/** 支持的组件格式 */
export type ComponentType<Props = Record<string, any>, Context = any>
    = | DefineComponent | Raw<DefineComponent> // defineComponent 定义的组件
        // | Component // 基本组件类型(隐藏该项, 防止函数式组件类型推断出现错误)
        | ((props: Props, ctx?: Context) => any) // 函数式组件或函数返回组件类型
        | ComponentOptions // 组件选项对象
        | ComponentPublicInstance // 组件实例
        | (() => Promise<Component | { default: Component }>) // 异步组件加载函数
        | AsyncComponentOptions // 异步组件选项
        | string | number // 直接渲染
        | { [key: string]: any }; // 普通对象
