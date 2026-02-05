/**
 * @file 颜色选择器类型定义文件
 *
 * 包含颜色选择器组件所需的所有类型定义、属性配置和事件定义
 * 用于支持类型推断和属性验证
 */

import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import { ColorPicker as ElColorPicker } from 'element-ui';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { Component, ExtractPropTypes, PropType } from 'vue-demi';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, ElObj2Props, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

/** 获取Element UI颜色选择器属性定义 */
const elColorPickerProps = (ElColorPicker as any).props as ElObj2Props<ElColorPicker>;

/** Element UI颜色选择器事件定义 */
const elColorPickerEmits = {
    /** 颜色值改变时触发 */
    change: (value: string) => true,
    /** 当前激活的颜色改变时触发 */
    activeChange: (value: string) => true,
};

/**
 * 颜色选择器属性生成函数 - 通用版本
 * 支持泛型配置，用于支持不同数据类型的颜色选择器
 * @returns 颜色选择器属性配置对象
 */
export function colorPickerPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elColorPickerProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elColorPickerEmits>]>>;

    return {
        /** 继承Element UI颜色选择器属性 */
        ...{} as _Prop,
        /** 继承核心库的平台属性 */
        ...plainProps as PlainProps<Query, OptionQuery>,
        /** 继承通用属性 */
        ...commonProps as CommonProps<_Prop, ColorPickerSlotOption<Query, OptionQuery>, Query, OptionQuery>,
        /** 继承表单项属性 */
        ...formItemProps as FormItemProps<Query, OptionQuery>,
        /** 监听触发值改变的事件 @default change */
        changeName: { type: String, default: 'change' },
        /** 传递给颜色选择器组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            // 颜色选择器没有特定的插槽
        }>> },
    } as const;
}

/**
 * 颜色选择器插槽配置项接口
 * 定义了插槽组件可用的属性和方法
 */
export interface ColorPickerSlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
}

/** 组件属性配置 - 私有 */
export const colorPickerPropsPrivate = colorPickerPropsGeneric();

/** 组件属性配置 - 外部调用（包含事件映射） */
export const colorPickerProps = emits2props({
    ...elColorPickerProps,
    ...colorPickerPropsPrivate,
}, elColorPickerEmits) as typeof colorPickerPropsPrivate;

/**
 * 颜色选择器属性类型
 * 提供类型推断支持
 */
export type ColorPickerProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = Partial<ExtractPropTypes<ReturnType<typeof colorPickerPropsGeneric<Query, OptionQuery>>>>;

/**
 * 颜色选择器事件生成函数 - 通用版本
 *
 * @template T 选中值类型
 * @returns 颜色选择器事件配置对象
 */
export function colorPickerEmitsGeneric<T>() {
    return {
        ...{} as typeof elColorPickerEmits,
    };
}

/** 组件事件配置 - 私有 */
export const colorPickerEmitsPrivate = colorPickerEmitsGeneric();

/** 组件事件配置 - 外部调用 */
export const colorPickerEmits = {
    ...elColorPickerEmits,
    ...colorPickerEmitsPrivate,
} as ReturnType<typeof colorPickerEmitsGeneric<any>>;

/**
 * 颜色选择器事件类型
 * 提供类型推断支持
 */
export type ColorPickerEmits<T> = ReturnType<typeof colorPickerEmitsGeneric<T>>;

/**
 * 颜色选择器插槽定义接口
 * 继承通用插槽定义
 */
export interface ColorPickerSlots extends CommonSlots<Record<string, any>> {
}
