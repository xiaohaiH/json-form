/**
 * @file 复选框组类型定义文件
 *
 * 包含复选框组组件所需的所有类型定义、属性配置和事件定义
 * 用于支持类型推断和属性验证
 */
import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import { Checkbox as ElCheckbox, CheckboxGroup as ElCheckboxGroup } from 'element-ui';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { Component, ExtractPropTypes, PropType } from 'vue-demi';
import type { CheckboxSlotOption } from '../checkbox/types';
import type { CommonProps, CommonSlots, ComponentType, DynamicProps, ElObj2Props, FormItemProps, StaticProps } from '../share';
import { commonProps, formItemProps } from '../share';

/** 获取Element UI复选框组属性定义 */
const elCheckboxGroupProps = (ElCheckboxGroup as any).props as ElObj2Props<ElCheckboxGroup>;
/** Element UI复选框组事件定义 */
const elCheckboxGroupEmits = {
    /** 当绑定值变化时触发的事件 */
    change: (value: any) => true,
};
/** 获取Element UI复选框属性定义 */
const elCheckboxProps = (ElCheckbox as any).props as ElObj2Props<ElCheckbox>;
/** Element UI复选框事件定义，与复选框组共用 */
const elCheckboxEmits = elCheckboxGroupEmits;

/**
 * 复选框组属性生成函数 - 通用版本
 * 支持泛型配置，用于支持不同数据类型的复选框组
 *
 * @template T 选中值类型
 * @template Query 查询参数类型
 * @template Option 选项类型
 * @template OptionQuery 选项查询参数类型
 * @returns 复选框组属性配置对象
 */
export function checkboxGroupPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elCheckboxGroupProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elCheckboxGroupEmits>]>>;

    return {
        // 继承Element UI复选框组属性
        ...{} as _Prop,
        // 继承核心库的平台属性
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        // 继承通用属性
        ...commonProps as CommonProps<T, CheckboxGroupSlotOption<T, Query, Option, OptionQuery>, Query, Option>,
        // 继承表单项属性
        ...formItemProps as FormItemProps<Query, Option>,
        /** 组件静态属性(与 formItem 或内置的属性冲突时, 可通过该属性传递) */
        staticProps: { type: Object as PropType<StaticProps<_Prop>> },
        /** 组件动态属性，根据查询条件动态计算属性值 */
        dynamicProps: { type: Function as PropType<DynamicProps<_Prop, Query, Option>> },
        /** 展示的字段名，用于从选项对象中获取显示文本 */
        labelKey: { type: String as PropType<string>, default: 'label' },
        /** 提交的字段名，用于从选项对象中获取值 */
        valueKey: { type: String as PropType<string>, default: 'value' },
        /** 复选框类型(checkbox|button)，可选普通复选框或按钮式复选框 @default checkbox */
        type: { type: String as PropType<'checkbox' | 'button'>, default: 'checkbox' },
        /** 选项禁用状态字段名，用于从选项对象中获取禁用状态 @default disabled */
        disabledKey: { type: String as PropType<string>, default: 'disabled' },
        /** 暴露给单个复选框的属性，适用于Checkbox或CheckboxButton组件 */
        itemProps: { type: Object as PropType<Partial<ExtractPropTypes<ReturnType<typeof emits2props<typeof elCheckboxProps, [NonNullable<typeof elCheckboxEmits>]>>>>> },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            default: ComponentType<CheckboxGroupSlotOption<T, Query, Option, OptionQuery> & { option: Option; labelKey: string; valueKey: string; disabledKey: string }>;
        }>>, default: () => ({}) },
    } as const;
}

/**
 * 复选框组插槽配置项接口
 * 定义了插槽组件可用的属性和方法
 *
 * @template T 选中值类型
 * @template Query 查询参数类型
 * @template Option 选项类型
 * @template OptionQuery 选项查询参数类型
 */
export interface CheckboxGroupSlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    /** 获取表单项属性 */
    getFormItemProps: () => Partial<FormItemProps<Query, Option>>;
    /** 获取复选框组属性 */
    getItemProps: () => Partial<ExtractPropTypes<typeof elCheckboxGroupProps>>;
    /** 获取所有组件属性 */
    getProps: () => CheckboxGroupProps<T, Query, Option, OptionQuery>;
    /** 额外选项 */
    extraOptions: {
        /** 当前选中值 */
        value: T;
        /** 复选框选项数组 */
        options: Option[];
        /** 值变更处理函数 */
        onChange: (value: T) => void;
        /** 复选框类型，普通复选框或按钮式复选框 */
        checkboxType: 'ElCheckboxButton' | 'ElCheckbox';
    };
    /** 平台状态管理对象 */
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
}

/** 组件属性配置 - 私有 */
export const checkboxGroupPropsPrivate = checkboxGroupPropsGeneric();

/** 组件属性配置 - 外部调用（包含事件映射） */
export const checkboxGroupProps = emits2props({
    ...elCheckboxGroupProps,
    ...checkboxGroupPropsPrivate,
}, elCheckboxGroupEmits) as typeof checkboxGroupPropsPrivate;

/**
 * 复选框组属性类型
 * 提供类型推断支持
 */
export type CheckboxGroupProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = Partial<ExtractPropTypes<ReturnType<typeof checkboxGroupPropsGeneric<T, Query, Option, OptionQuery>>>>;

/**
 * 复选框组事件生成函数 - 通用版本
 *
 * @template T 选中值类型
 * @returns 复选框组事件配置对象
 */
export function checkboxGroupEmitsGeneric<T>() {
    return {
        ...{} as typeof elCheckboxGroupEmits,
    };
}

/** 组件事件配置 - 私有 */
export const checkboxGroupEmitsPrivate = checkboxGroupEmitsGeneric();

/** 组件事件配置 - 外部调用 */
export const checkboxGroupEmits = {
    ...elCheckboxGroupEmits,
    ...checkboxGroupEmitsPrivate,
} as ReturnType<typeof checkboxGroupEmitsGeneric<any>>;

/**
 * 复选框组事件类型
 * 提供类型推断支持
 */
export type CheckboxGroupEmits<T> = ReturnType<typeof checkboxGroupEmitsGeneric<T>>;

/**
 * 复选框组插槽定义接口
 * 继承通用插槽定义
 */
export interface CheckboxGroupSlots extends CommonSlots<Record<string, any>> {
}
