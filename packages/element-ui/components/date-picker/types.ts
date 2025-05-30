/**
 * 日期选择器组件类型定义文件
 *
 * 定义日期选择器组件所需的各种类型、属性和事件
 * 包括组件属性、事件、插槽等类型定义
 */
import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import { DatePicker as ElDatePicker } from 'element-ui';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { Component, ExtractPropTypes, PropType } from 'vue-demi';
import type { CommonProps, CommonSlots, DynamicProps, ElObj2Props, FormItemProps, StaticProps } from '../share';
import { commonProps, formItemProps } from '../share';

/**
 * Element UI日期选择器属性对象
 * 从Element UI DatePicker组件中提取属性定义
 */
const elDatePickerProps = (ElDatePicker as any).props as ElObj2Props<ElDatePicker>;

/**
 * Element UI日期选择器事件对象
 * 定义日期选择器组件支持的原生事件
 */
const elDatePickerEmits = {
    change: (value: any) => true,
    blur: (ev: FocusEvent) => true,
    focus: (ev: FocusEvent) => true,
};

/**
 * 日期选择器属性生成函数 - 泛型版本
 * 生成日期选择器组件所需的所有属性定义
 *
 * @template T 日期选择器数据类型
 * @template Query 查询参数类型
 * @template Option 选项类型
 * @template OptionQuery 选项查询类型
 * @returns 日期选择器属性定义对象
 */
export function datePickerPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elDatePickerProps;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<T, DatePickerSlotOption<T, Query, Option, OptionQuery>, Query, Option>,
        ...formItemProps as FormItemProps<Query, Option>,
        /** 组件静态属性(与 formItem 或内置的属性冲突时, 可通过该属性传递) */
        staticProps: { type: Object as PropType<StaticProps<_Prop>> },
        /** 组件动态属性 */
        dynamicProps: { type: Function as PropType<DynamicProps<_Prop, Query, Option>> },
        /** 日期格式化的类型 */
        valueFormat: { type: String as PropType<string>, default: 'yyyy-MM-dd' },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            // default: ((props: DatePickerSlotOption<T, Query, Option, OptionQuery>) => any);
            // rangeSeparator: ((props: DatePickerSlotOption<T, Query, Option, OptionQuery>) => any);
            // prevMonth: ((props: DatePickerSlotOption<T, Query, Option, OptionQuery>) => any);
            // nextMonth: ((props: DatePickerSlotOption<T, Query, Option, OptionQuery>) => any);
            // prevYear: ((props: DatePickerSlotOption<T, Query, Option, OptionQuery>) => any);
            // nextYear: ((props: DatePickerSlotOption<T, Query, Option, OptionQuery>) => any);
        }>> },
    } as const;
}

/**
 * 日期选择器插槽配置项接口
 * 定义传递给插槽的属性和方法
 */
export interface DatePickerSlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    /** 获取表单项属性的方法 */
    getFormItemProps: () => Partial<FormItemProps<Query, Option>>;
    /** 获取日期选择器组件属性的方法 */
    getItemProps: () => Partial<ExtractPropTypes<typeof elDatePickerProps>>;
    /** 获取所有属性的方法 */
    getProps: () => DatePickerProps<T, Query, Option, OptionQuery>;
    /** 额外选项 */
    extraOptions: {
        /** 当前绑定的值 */
        value: T;
        /** 可用选项列表 */
        options: Option[];
        /** 值变更处理函数 */
        onChange: (value: T) => void;
    };
    /** 组件扁平化数据对象 */
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
}

/** 日期选择器组件内部使用的属性定义 */
export const datePickerPropsPrivate = datePickerPropsGeneric();

/**
 * 日期选择器组件对外暴露的属性定义
 * 将日期选择器属性和Element UI日期选择器属性合并
 */
export const datePickerProps = emits2props({
    ...elDatePickerProps,
    ...datePickerPropsPrivate,
}) as typeof datePickerPropsPrivate;

/**
 * 日期选择器属性类型定义
 * 用于日期选择器组件属性的类型检查和提示
 */
export type DatePickerProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = Partial<ExtractPropTypes<ReturnType<typeof datePickerPropsGeneric<T, Query, Option, OptionQuery>>>>;

/**
 * 日期选择器事件生成函数 - 泛型版本
 * 生成日期选择器组件支持的所有事件定义
 *
 * @template T 日期选择器数据类型
 * @returns 日期选择器事件定义对象
 */
export function datePickerEmitsGeneric<T>() {
    return {
        // ...{} as typeof elDatePickerEmits,
    };
}

/** 日期选择器组件内部使用的事件定义 */
export const datePickerEmitsPrivate = datePickerEmitsGeneric();

/**
 * 日期选择器组件对外暴露的事件定义
 * 将日期选择器事件和Element UI日期选择器事件合并
 */
export const datePickerEmits = {
    change: (val: null | string | string[] | Date | Date[]) => true,
    blur: (ev: FocusEvent) => true,
    focus: (ev: FocusEvent) => true,
    // clear: () => true,
    // calendarChange: (val: [Date, null | Date]) => true,
    // panelChange: (date: Date | [Date, Date], mode: 'month' | 'year', view?: string) => true,
    // visibleChange: (visibility: boolean) => true,
    ...datePickerEmitsPrivate,
} as ReturnType<typeof datePickerEmitsGeneric<any>>;

/**
 * 日期选择器事件类型定义
 * 用于日期选择器组件事件的类型检查和提示
 */
export type DatePickerEmits<T> = ReturnType<typeof datePickerEmitsGeneric<T>>;

/**
 * 日期选择器插槽接口
 * 定义日期选择器组件支持的所有插槽
 * 继承自通用插槽接口
 */
export interface DatePickerSlots extends CommonSlots<Record<string, any>> {
}
