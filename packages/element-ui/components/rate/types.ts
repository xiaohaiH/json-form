/**
 * 评分组件类型定义文件
 *
 * 定义评分组件所需的各种类型、属性和事件
 * 包括组件属性、事件、插槽等类型定义
 */
import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import { Rate as ElRate } from 'element-ui';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { Component, ExtractPropTypes, PropType } from 'vue-demi';
import type { CommonProps, CommonSlots, DynamicProps, ElObj2Props, FormItemProps, StaticProps } from '../share';
import { commonProps, formItemProps } from '../share';

/**
 * Element UI评分属性对象
 * 从Element UI Rate组件中提取属性定义
 */
const elRateProps = (ElRate as any).props as ElObj2Props<ElRate>;

/**
 * Element UI评分事件对象
 * 定义评分组件支持的原生事件
 */
const elRateEmits = {
    change: (value: number) => true,
};

/**
 * 评分属性生成函数 - 泛型版本
 * 生成评分组件所需的所有属性定义
 *
 * @template T 评分数据类型
 * @template Query 查询参数类型
 * @template Option 选项类型
 * @template OptionQuery 选项查询类型
 * @returns 评分属性定义对象
 */
export function ratePropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elRateProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elRateEmits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<T, RateSlotOption<T, Query, Option, OptionQuery>, Query, Option>,
        ...formItemProps as FormItemProps<Query, Option>,
        /** 组件静态属性(与 formItem 或内置的属性冲突时, 可通过该属性传递) */
        staticProps: { type: Object as PropType<StaticProps<_Prop>> },
        /** 组件动态属性 */
        dynamicProps: { type: Function as PropType<DynamicProps<_Prop, Query, Option>> },
        // /** 传递给组件的插槽 */
        // itemSlots: { type: Object as PropType<Partial<{
        // }>> },
    } as const;
}

/**
 * 评分插槽配置项接口
 * 定义传递给插槽的属性和方法
 */
export interface RateSlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    /** 获取表单项属性的方法 */
    getFormItemProps: () => Partial<FormItemProps<Query, Option>>;
    /** 获取评分组件属性的方法 */
    getItemProps: () => Partial<ExtractPropTypes<typeof elRateProps>>;
    /** 获取所有属性的方法 */
    getProps: () => RateProps<T, Query, Option, OptionQuery>;
    /** 可用选项列表 */
    options: Option[];
    /** 当前绑定的值 */
    value: T;
    /** 值变更处理函数 */
    onChange: (value: T) => void;
    /** 组件类名 */
    class: string;
    /** 组件扁平化数据对象 */
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
}

/** 评分组件内部使用的属性定义 */
export const ratePropsPrivate = ratePropsGeneric();

/**
 * 评分组件对外暴露的属性定义
 * 将评分属性和Element UI评分属性合并
 */
export const rateProps = emits2props({
    ...elRateProps,
    ...ratePropsPrivate,
}) as typeof ratePropsPrivate;

/**
 * 评分属性类型定义
 * 用于评分组件属性的类型检查和提示
 */
export type RateProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = Partial<ExtractPropTypes<ReturnType<typeof ratePropsGeneric<T, Query, Option, OptionQuery>>>>;

/**
 * 评分事件生成函数 - 泛型版本
 * 生成评分组件支持的所有事件定义
 *
 * @template T 评分数据类型
 * @returns 评分事件定义对象
 */
export function rateEmitsGeneric<T>() {
    return {
        ...{} as typeof elRateEmits,
    };
}

/** 评分组件内部使用的事件定义 */
export const rateEmitsPrivate = rateEmitsGeneric();

/**
 * 评分组件对外暴露的事件定义
 * 将评分事件和Element UI评分事件合并
 */
export const rateEmits = {
    ...elRateEmits,
    ...rateEmitsPrivate,
} as ReturnType<typeof rateEmitsGeneric<any>>;

/**
 * 评分事件类型定义
 * 用于评分组件事件的类型检查和提示
 */
export type RateEmits<T> = ReturnType<typeof rateEmitsGeneric<T>>;

/**
 * 评分插槽接口
 * 定义评分组件支持的所有插槽
 * 继承自通用插槽接口
 */
export interface RateSlots extends CommonSlots<Record<string, any>> {
}
