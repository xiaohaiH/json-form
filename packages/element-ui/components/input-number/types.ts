/**
 * @file 数字输入框类型定义文件
 *
 * 包含数字输入框组件所需的所有类型定义、属性配置和事件定义
 * 用于支持类型推断和属性验证
 */

import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import { InputNumber as ElInputNumber } from 'element-ui';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { Component, ExtractPropTypes, PropType } from 'vue-demi';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, ElObj2Props, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

/** 获取Element UI数字输入框属性定义，并添加label和placeholder属性 */
const elInputNumberProps = (ElInputNumber as any).props as ElObj2Props<ElInputNumber & { label: string; placeholder: string }>;

/** Element UI数字输入框事件定义 */
const elInputNumberEmits = {
    /** 值变更时触发 */
    change: (value: any, oldValue: any) => true,
    /** 失去焦点时触发 */
    blur: (ev: FocusEvent) => true,
    /** 获得焦点时触发 */
    focus: (ev: FocusEvent) => true,
    /** 输入值变化时触发 */
    input: (val: any) => true,
};

/**
 * 数字输入框属性生成函数 - 通用版本
 * 支持泛型配置，用于支持不同数据类型的数字输入框
 *
 * @returns 数字输入框属性配置对象
 */
export function inputNumberPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elInputNumberProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elInputNumberEmits>]>>;

    return {
        /** 继承Element UI数字输入框属性 */
        ...{} as _Prop,
        /** 继承核心库的平台属性 */
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        /** 继承通用属性 */
        ...commonProps as CommonProps<_Prop, InputNumberSlotOption<Query, OptionQuery>, Query, Option>,
        /** 继承表单项属性 */
        ...formItemProps as FormItemProps<Query, Option>,
        /** 延迟触发抖动时长(单位 ms) */
        debounceTime: { type: Number as PropType<number>, default: undefined },
        // 以下为已注释的插槽配置，当前组件未启用
        // /** 传递给组件的插槽 */
        // itemSlots: { type: Object as PropType<Partial<{
        //     prefix: ComponentType<InputNumberSlotOption<Query, OptionQuery>>;
        //     suffix: ComponentType<InputNumberSlotOption<Query, OptionQuery>>;
        //     decreaseIcon: ComponentType<InputNumberSlotOption<Query, OptionQuery>>;
        //     increaseIcon: ComponentType<InputNumberSlotOption<Query, OptionQuery>>;
        // }>>, default: () => ({}) },
    } as const;
}

/**
 * 数字输入框插槽配置项接口
 * 定义了插槽组件可用的属性和方法
 */
export interface InputNumberSlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
}

/** 组件属性配置 - 私有 */
export const inputNumberPropsPrivate = inputNumberPropsGeneric();

/** 组件属性配置 - 外部调用 */
export const inputNumberProps = emits2props({
    ...elInputNumberProps,
    ...inputNumberPropsPrivate,
}, elInputNumberEmits) as typeof inputNumberPropsPrivate;

/**
 * 数字输入框属性类型
 * 提供类型推断支持
 */
export type InputNumberProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = Partial<ExtractPropTypes<ReturnType<typeof inputNumberPropsGeneric<T, Query, Option, OptionQuery>>>>;

/**
 * 数字输入框事件生成函数 - 通用版本
 *
 * @template T 值类型
 * @returns 数字输入框事件配置对象
 */
export function inputNumberEmitsGeneric<T>() {
    return {
        ...{} as typeof elInputNumberEmits,
    };
}

/** 组件事件配置 - 私有 */
export const inputNumberEmitsPrivate = inputNumberEmitsGeneric();

/** 组件事件配置 - 外部调用 */
export const inputNumberEmits = {
    ...elInputNumberEmits,
    ...inputNumberEmitsPrivate,
} as ReturnType<typeof inputNumberEmitsGeneric<any>>;

/**
 * 数字输入框事件类型
 * 提供类型推断支持
 */
export type InputNumberEmits<T> = ReturnType<typeof inputNumberEmitsGeneric<T>>;

/**
 * 数字输入框插槽定义接口
 * 继承通用插槽定义
 */
export interface InputNumberSlots extends CommonSlots<Record<string, any>> {
}
