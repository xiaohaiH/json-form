/**
 * @file 时间选择器组件类型定义文件
 *
 * 包含时间选择器组件所需的所有类型定义、属性配置和事件定义
 * 用于支持类型推断和属性验证
 */

import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import { TimePicker as ElTimePicker } from 'element-ui';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { Component, ExtractPropTypes, PropType } from 'vue-demi';
import type { CommonProps, CommonSlots, DynamicProps, ElObj2Props, FormItemProps, StaticProps } from '../share';
import { commonProps, formItemProps } from '../share';

/** 获取Element UI时间选择器组件属性定义 */
const elTimePickerProps = (ElTimePicker as any).props as ElObj2Props<ElTimePicker>;
/** Element UI时间选择器组件事件定义 */
const elTimePickerEmits = {
    /** 值变更时触发 */
    change: (value: any) => true,
    /** 获得焦点时触发 */
    focus: (ev: FocusEvent) => true,
    /** 失去焦点时触发 */
    blur: (ev: FocusEvent) => true,
};

/**
 * 时间选择器组件属性生成函数 - 通用版本
 * 支持泛型配置，用于支持不同数据类型的时间选择器组件
 *
 * @template T 值类型
 * @template Query 查询参数类型
 * @template Option 选项类型
 * @template OptionQuery 选项查询参数类型
 * @returns 时间选择器组件属性配置对象
 */
export function timePickerPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elTimePickerProps;

    return {
        /** 继承Element UI时间选择器组件属性 */
        ...{} as _Prop,
        /** 继承核心库的平台属性 */
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        /** 继承通用属性 */
        ...commonProps as CommonProps<T, TimePickerSlotOption<T, Query, Option, OptionQuery>, Query, Option>,
        /** 继承表单项属性 */
        ...formItemProps as FormItemProps<Query, Option>,
        /** 组件静态属性(与 formItem 或内置的属性冲突时, 可通过该属性传递) */
        staticProps: { type: Object as PropType<StaticProps<_Prop>> },
        /** 组件动态属性，根据查询条件动态计算属性值 */
        dynamicProps: { type: Function as PropType<DynamicProps<_Prop, Query, Option>> },
        /** 日期格式化的类型，用于指定时间值的格式 @default 'HH:mm:ss' */
        valueFormat: { type: String as PropType<string>, default: 'HH:mm:ss' },
        // /** 传递给组件的插槽 */
        // itemSlots: { type: Object as PropType<Partial<{
        // }>> },
    } as const;
}

/**
 * 时间选择器组件插槽配置项接口
 * 定义了插槽组件可用的属性和方法
 *
 * @template T 值类型
 * @template Query 查询参数类型
 * @template Option 选项类型
 * @template OptionQuery 选项查询参数类型
 */
export interface TimePickerSlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    /** 获取表单项属性 */
    getFormItemProps: () => Partial<FormItemProps<Query, Option>>;
    /** 获取时间选择器组件属性 */
    getItemProps: () => Partial<ExtractPropTypes<typeof elTimePickerProps>>;
    /** 获取所有组件属性 */
    getProps: () => TimePickerProps<T, Query, Option, OptionQuery>;
    /** 选项数组 */
    options: Option[];
    /** 当前值 */
    value: T;
    /** 值变更处理函数 */
    onChange: (value: T) => void;
    /** 组件类名 */
    class: string;
    /** 平台状态管理对象 */
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
}

/** 组件属性配置 - 私有 */
export const timePickerPropsPrivate = timePickerPropsGeneric();

/** 组件属性配置 - 外部调用（包含事件映射） */
export const timePickerProps = emits2props({
    ...elTimePickerProps,
    ...timePickerPropsPrivate,
}) as typeof timePickerPropsPrivate;

/**
 * 时间选择器组件属性类型
 * 提供类型推断支持
 */
export type TimePickerProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = Partial<ExtractPropTypes<ReturnType<typeof timePickerPropsGeneric<T, Query, Option, OptionQuery>>>>;

/**
 * 时间选择器组件事件生成函数 - 通用版本
 *
 * @template T 值类型
 * @returns 时间选择器组件事件配置对象
 */
export function timePickerEmitsGeneric<T>() {
    return {
        // ...{} as typeof elTimePickerEmits,
    };
}

/** 组件事件配置 - 私有 */
export const timePickerEmitsPrivate = timePickerEmitsGeneric();

/** 组件事件配置 - 外部调用 */
export const timePickerEmits = {
    /** 时间值变化时触发 */
    change: (val: number | string | Date | [number, number] | [string, string] | [Date, Date]) => true,
    /** 失去焦点时触发 */
    blur: (ev: FocusEvent) => true,
    /** 获得焦点时触发 */
    focus: (ev: FocusEvent) => true,
    ...timePickerEmitsPrivate,
} as ReturnType<typeof timePickerEmitsGeneric<any>>;

/**
 * 时间选择器组件事件类型
 * 提供类型推断支持
 */
export type TimePickerEmits<T> = ReturnType<typeof timePickerEmitsGeneric<T>>;

/**
 * 时间选择器组件插槽定义接口
 * 继承通用插槽定义
 */
export interface TimePickerSlots extends CommonSlots<Record<string, any>> {
}
