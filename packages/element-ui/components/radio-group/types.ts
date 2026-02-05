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
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, ElObj2Props, FormItemProps } from '../share';
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
 * @returns 单选框组属性配置对象
 */
export function radioGroupPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elRadioGroupProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elRadioGroupEmits>]>>;

    return {
        /** 继承Element UI单选框组属性 */
        ...{} as _Prop,
        /** 继承核心库的平台属性 */
        ...plainProps as PlainProps<Query, OptionQuery>,
        /** 继承通用属性 */
        ...commonProps as CommonProps<_Prop, RadioGroupSlotOption<Query, OptionQuery>, Query, OptionQuery>,
        /** 继承表单项属性 */
        ...formItemProps as FormItemProps<Query, OptionQuery>,
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
            default: ComponentType<RadioGroupSlotOption<Query, OptionQuery> & { option: any; labelKey: string; valueKey: string; disabledKey: string }>;
        }>>, default: () => ({}) },
    } as const;
}

/**
 * 单选框组插槽配置项接口
 * 定义了插槽组件可用的属性和方法
 */
export interface RadioGroupSlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
}

/** 组件属性配置 - 私有 */
export const radioGroupPropsPrivate = radioGroupPropsGeneric();

/** 组件属性配置 - 外部调用（包含事件映射） */
export const radioGroupProps = emits2props({
    ...elRadioGroupProps,
    ...radioGroupPropsPrivate,
}, elRadioGroupEmits);

/**
 * 单选框组属性类型
 * 提供类型推断支持
 */
export type RadioGroupProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = Partial<ExtractPropTypes<ReturnType<typeof radioGroupPropsGeneric<Query, OptionQuery>>>>;

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
