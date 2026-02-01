/**
 * @file 开关组件类型定义文件
 *
 * 包含开关组件所需的所有类型定义、属性配置和事件定义
 * 用于支持类型推断和属性验证
 */

import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import { Switch as ElSwitch } from 'element-ui';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { Component, ExtractPropTypes, PropType } from 'vue-demi';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, ElObj2Props, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

/** 获取Element UI开关组件属性定义 */
const elSwitchProps = (ElSwitch as any).props as ElObj2Props<ElSwitch>;
/** Element UI开关组件事件定义 */
const elSwitchEmits = {
    /** 值变更时触发 */
    change: (value: any) => true,
    /** 输入值变更时触发 */
    input: (value: any) => true,
};

/**
 * 开关组件属性生成函数 - 通用版本
 * 支持泛型配置，用于支持不同数据类型的开关组件
 *
 * @returns 开关组件属性配置对象
 */
export function switchPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elSwitchProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elSwitchEmits>]>>;

    return {
        /** 继承Element UI开关组件属性 */
        ...{} as _Prop,
        /** 继承核心库的平台属性 */
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        /** 继承通用属性 */
        ...commonProps as CommonProps<_Prop, SwitchSlotOption<Query, OptionQuery>, Query, Option>,
        /** 继承表单项属性 */
        ...formItemProps as FormItemProps<Query, Option>,
        // /** 传递给组件的插槽 */
        // itemSlots: { type: Object as PropType<Partial<{
        // }>> },
    } as const;
}

/**
 * 开关组件插槽配置项接口
 * 定义了插槽组件可用的属性和方法
 *
 */
export interface SwitchSlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
}

/** 组件属性配置 - 私有 */
export const switchPropsPrivate = switchPropsGeneric();

/** 组件属性配置 - 外部调用（包含事件映射） */
export const switchProps = emits2props({
    ...elSwitchProps,
    ...switchPropsPrivate,
}) as typeof switchPropsPrivate;

/**
 * 开关组件属性类型
 * 提供类型推断支持
 */
export type SwitchProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = Partial<ExtractPropTypes<ReturnType<typeof switchPropsGeneric<T, Query, Option, OptionQuery>>>>;

/**
 * 开关组件事件生成函数 - 通用版本
 *
 * @template T 值类型
 * @returns 开关组件事件配置对象
 */
export function switchEmitsGeneric<T>() {
    return {
        ...{} as typeof elSwitchEmits,
    };
}

/** 组件事件配置 - 私有 */
export const switchEmitsPrivate = switchEmitsGeneric();

/** 组件事件配置 - 外部调用 */
export const switchEmits = {
    ...elSwitchEmits,
    ...switchEmitsPrivate,
} as ReturnType<typeof switchEmitsGeneric<any>>;

/**
 * 开关组件事件类型
 * 提供类型推断支持
 */
export type SwitchEmits<T> = ReturnType<typeof switchEmitsGeneric<T>>;

/**
 * 开关组件插槽定义接口
 * 继承通用插槽定义
 */
export interface SwitchSlots extends CommonSlots<Record<string, any>> {
}
