/**
 * @file 单选框组类型定义文件
 *
 * 包含单选框组组件所需的所有类型定义、属性配置和事件定义
 * 用于支持类型推断和属性验证
 */

import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import { Radio as ElRadio, RadioGroup as ElRadioGroup } from 'element-ui';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { Component, ExtractPropTypes, PropType } from 'vue-demi';
import type { CommonProps, CommonSlots, DynamicProps, ElObj2Props, FormItemProps, StaticProps } from '../share';
import { commonProps, formItemProps } from '../share';

/** 获取Element UI单选框组属性定义 */
const elRadioGroupProps = (ElRadioGroup as any).props as ElObj2Props<ElRadioGroup>;
/** Element UI单选框组事件定义 */
const elRadioGroupEmits = {
    /** 值变更时触发 */
    input: (value: any) => true,
};
/** 获取Element UI单选框属性定义 */
const elRadioProps = (ElRadio as any).props as ElObj2Props<ElRadio>;
/** Element UI单选框事件定义，与单选框组共用 */
const elRadioEmits = elRadioGroupEmits;

/**
 * 单选框组属性生成函数 - 通用版本
 * 支持泛型配置，用于支持不同数据类型的单选框组
 *
 * @template T 选中值类型
 * @template Query 查询参数类型
 * @template Option 选项类型
 * @template OptionQuery 选项查询参数类型
 * @returns 单选框组属性配置对象
 */
export function radioGroupPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elRadioGroupProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elRadioGroupEmits>]>>;

    return {
        /** 继承Element UI单选框组属性 */
        ...{} as _Prop,
        /** 继承核心库的平台属性 */
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        /** 继承通用属性 */
        ...commonProps as CommonProps<T, RadioGroupSlotOption<T, Query, Option, OptionQuery>, Query, Option>,
        /** 继承表单项属性 */
        ...formItemProps as FormItemProps<Query, Option>,
        /** 组件静态属性(与 formItem 或内置的属性冲突时, 可通过该属性传递) */
        staticProps: { type: Object as PropType<StaticProps<_Prop>> },
        /** 组件动态属性，根据查询条件动态计算属性值 */
        dynamicProps: { type: Function as PropType<DynamicProps<_Prop, Query, Option>> },
        /** 展示的字段名，用于从选项对象中获取显示文本 */
        labelKey: { type: String as PropType<string>, default: 'label' },
        /** 提交的字段名，用于从选项对象中获取值 */
        valueKey: { type: String as PropType<string>, default: 'value' },
        /** 单选框类型，可选普通单选框或按钮式单选框 @default radio */
        type: { type: String as PropType<'radio' | 'button'> },
        /**
         * 选中状态是否可以被取消
         * 设置为true时，点击已选中的选项会取消选择
         * 设置为false或不设置时，不能取消选择
         */
        cancelable: { type: Boolean as PropType<boolean>, default: undefined },
        /** 选项禁用状态字段名，用于从选项对象中获取禁用状态 @default disabled */
        disabledKey: { type: String as PropType<string>, default: 'disabled' },
        /** 暴露给单个单选框的属性，适用于Radio或RadioButton组件 */
        itemProps: { type: Object as PropType<Partial<ExtractPropTypes<ReturnType<typeof emits2props<typeof elRadioProps, [NonNullable<typeof elRadioEmits>]>>>>> },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            default: ((props: RadioGroupSlotOption<T, Query, Option, OptionQuery> & { option: Option; labelKey: string; valueKey: string; disabledKey: string }) => any);
        }>>, default: () => ({}) },
    } as const;
}

/**
 * 单选框组插槽配置项接口
 * 定义了插槽组件可用的属性和方法
 *
 * @template T 选中值类型
 * @template Query 查询参数类型
 * @template Option 选项类型
 * @template OptionQuery 选项查询参数类型
 */
export interface RadioGroupSlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    /** 获取表单项属性 */
    getFormItemProps: () => Partial<FormItemProps<Query, Option>>;
    /** 获取单选框组属性 */
    getItemProps: () => Partial<ExtractPropTypes<typeof elRadioGroupProps>>;
    /** 获取所有组件属性 */
    getProps: () => RadioGroupProps<T, Query, Option, OptionQuery>;
    /** 额外选项 */
    extraOptions: {
        /** 当前选中值 */
        value: T;
        /** 单选框选项数组 */
        options: Option[];
        /** 值变更处理函数 */
        onChange: (value: T) => void;
        /**
         * 可取消选择处理函数
         * 比较新值和当前值，实现可取消选择功能
         */
        onCancelable: (newVal: T, currentVal: T, cb: (value: T) => void) => void;
        /** 单选框类型，普通单选框或按钮式单选框 */
        radioType: 'ElRadioButton' | 'ElRadio';
    };
    /** 平台状态管理对象 */
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
}

/** 组件属性配置 - 私有 */
export const radioGroupPropsPrivate = radioGroupPropsGeneric();

/** 组件属性配置 - 外部调用（包含事件映射） */
export const radioGroupProps = emits2props({
    ...elRadioGroupProps,
    ...radioGroupPropsPrivate,
}, elRadioGroupEmits) as typeof radioGroupPropsPrivate;

/**
 * 单选框组属性类型
 * 提供类型推断支持
 */
export type RadioGroupProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = Partial<ExtractPropTypes<ReturnType<typeof radioGroupPropsGeneric<T, Query, Option, OptionQuery>>>>;

/**
 * 单选框组事件生成函数 - 通用版本
 *
 * @template T 选中值类型
 * @returns 单选框组事件配置对象
 */
export function radioGroupEmitsGeneric<T>() {
    return {
        ...{} as typeof elRadioGroupEmits,
    };
}

/** 组件事件配置 - 私有 */
export const radioGroupEmitsPrivate = radioGroupEmitsGeneric();

/** 组件事件配置 - 外部调用 */
export const radioGroupEmits = {
    ...elRadioGroupEmits,
    ...radioGroupEmitsPrivate,
} as ReturnType<typeof radioGroupEmitsGeneric<any>>;

/**
 * 单选框组事件类型
 * 提供类型推断支持
 */
export type RadioGroupEmits<T> = ReturnType<typeof radioGroupEmitsGeneric<T>>;

/**
 * 单选框组插槽定义接口
 * 继承通用插槽定义
 */
export interface RadioGroupSlots extends CommonSlots<Record<string, any>> {
}
