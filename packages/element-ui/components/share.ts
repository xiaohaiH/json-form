import type { Obj2Props, usePlain } from '@xiaohaih/json-form-core';
import { Checkbox, FormItem as ElFormItem } from 'element-ui';
import type { ElementUIComponent } from 'element-ui/types/component.d';
import type { ComponentProps } from 'vue-component-type-helpers';
import type { Component, ComponentOptions, ComponentPublicInstance, defineComponent, ExtractPropTypes, markRaw, PropType, VNode } from 'vue-demi';

/**
 * 插槽查询接口
 * 定义组件插槽所需的通用属性和方法
 */
export interface SlotQuery {
    /** 是否禁用 */
    disabled: boolean;
    /** 绑定的值 */
    value: any;
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

/**
 * 通用属性生成函数 - 支持泛型
 * 用于生成各组件的通用属性配置
 * @returns 通用属性对象
 */
export function commonPropsGeneric<ContentProps, SlotProps, Query extends Record<string, any>, Option = Record<string, any>>() {
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
        /** 传递给表单元素的事件 */
        on: { type: Object as PropType<Record<string, any>> },
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
        }>>, default: () => ({}) },
    } as const;
}
/** 通用属性对象实例 */
export const commonProps = commonPropsGeneric();
export type CommonProps<ContentProps, SlotProps, Query extends Record<string, any>, Option> = ReturnType<typeof commonPropsGeneric<ContentProps, SlotProps, Query, Option>>;

/** 提取Element UI的FormItem属性 */
const elFormItemProps = (ElFormItem as any).props as ElObj2Props<ElFormItem>;

/**
 * 表单项属性生成函数 - 支持泛型
 * 用于生成表单项的属性配置
 * @returns 表单项属性对象
 */
export function formItemPropsGeneric<Query extends Record<string, any>, Option>() {
    const { prop, ...itemProps } = elFormItemProps;
    return {
        ...itemProps,
        prop: { type: prop.type, validator: prop.validator },
        // class: { type: [Object, Array, String] as PropType<string | Record<string, any> | any[]> },
        // style: { type: [Object, Array, String] as PropType<string | Record<string, any> | any[]> },
    } as const;
}
/** 表单项属性对象实例 */
export const formItemProps = formItemPropsGeneric();
/** 表单项属性类型定义 */
export type FormItemProps<Query extends Record<string, any>, Option> = ReturnType<typeof formItemPropsGeneric<Query, Option>>;
/** 表单项属性键名数组，排除特定属性 */
export const formItemPropKeys = Object.keys(formItemProps);

/**
 * 通用插槽类型接口
 * 定义组件通用的插槽结构
 */
export interface CommonSlots<T> {
    /** 取代默认组件 */
    default?: ComponentType<T>;
    /** 在组件前渲染 */
    before?: ComponentType<T>;
    /** 在组件后渲染 */
    after?: ComponentType<T>;
    /** 在最后渲染 */
    postfix?: ComponentType<{}>;
}

export interface CommonSlotsProps<Query extends Record<string, any>, Options extends Record<string, any>> {
    // formItemProps: Partial<ExtracedPropTypes<typeof formItemProps>>;
    // contentProps: Record<string, any>;
    props: Record<string, any>;
    plain: ReturnType<typeof usePlain<any, Query, any, Options>>;
}

/**
 * 提取 element-ui 中的 props 对象
 * 移除ElementUIComponent中的内部属性
 */
export type ExtractElementUIProps<T> = Omit<T, keyof ElementUIComponent | '$slots'>;
/**
 * 将 element-ui props 对象转为 vue props 类型
 * 转换为标准的Vue属性配置对象
 */
export type ElObj2Props<T> = Obj2Props<ExtractElementUIProps<T>>;

/** 支持的组件格式 */
export type ComponentType<Props = Record<string, any>, Context = any>
    = | ReturnType<typeof defineComponent> | ReturnType<typeof markRaw<ReturnType<typeof defineComponent>>> // defineComponent 定义的组件
        // | Component // 基本组件类型(隐藏该项, 防止函数式组件类型推断出现错误)
        | ((props: Props, ctx?: Context) => any) // 函数式组件或函数返回组件类型
        | ComponentOptions<any> // 组件选项对象
        | ComponentPublicInstance // 组件实例
        | (() => Promise<Component | { default: Component }>) // 异步组件加载函数
        | string | number // 直接渲染
        | { [key: string]: any }; // 普通对象
