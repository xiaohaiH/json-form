/**
 * @file 自定义渲染类型定义文件
 *
 * 包含自定义渲染组件所需的所有类型定义、属性配置和事件定义
 * 用于支持类型推断和属性验证
 */

// 导入基础类型和工具函数
import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { Component, ExtractPropTypes, PropType } from 'vue-demi';
// 导入共享类型和属性
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, ElObj2Props, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

/**
 * 自定义渲染属性生成函数 - 通用版本
 * 支持泛型配置，用于支持不同数据类型的自定义渲染
 *
 * @returns 自定义渲染属性配置对象
 */
export function customRenderPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    return {
        /** 继承核心库的平台属性 */
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        /** 继承通用属性 */
        ...commonProps as Omit<CommonProps<{}, CustomRenderSlotOption<Query, OptionQuery>, Query, Option>, 'contentProps'>,
        /** 继承表单项属性 */
        ...formItemProps as FormItemProps<Query, Option>,
        /**
         * 是否渲染为表单项
         * 当设置为true时，自定义内容会被包装在表单项容器中
         * 当设置为false时，自定义内容会直接渲染，不包含表单项容器
         * @default true
         */
        renderFormItem: { type: Boolean as PropType<boolean>, default: true },
        /**
         * 自定义渲染函数
         * 接收选项参数，返回一个渲染函数
         * 该函数负责生成要渲染的内容
         */
        render: {
            type: [Function, Object] as PropType<((option: CustomRenderSlotOption<Query, OptionQuery>) => () => any) | Record<string, any>>,
            required: true,
        },
    } as const;
}

/**
 * 自定义渲染插槽配置项接口
 * 定义了传递给自定义渲染函数的参数
 */
export interface CustomRenderSlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
    /** 获取表单项属性 */
    formItemProps: Record<string, any>;
}

/** 组件属性配置 - 私有 */
export const customRenderPropsPrivate = customRenderPropsGeneric();

/** 组件属性配置 - 外部调用 */
export const customRenderProps = customRenderPropsPrivate;

/**
 * 自定义渲染属性类型
 * 提供类型推断支持
 */
export type CustomRenderProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = Partial<ExtractPropTypes<ReturnType<typeof customRenderPropsGeneric<T, Query, Option, OptionQuery>>>>;

/**
 * 自定义渲染事件生成函数 - 通用版本
 *
 * @template T 值类型
 * @returns 自定义渲染事件配置对象
 */
export function customRenderEmitsGeneric<T>() {
    // 自定义渲染组件没有特定的事件
    return {
    };
}

/** 组件事件配置 - 私有 */
export const customRenderEmitsPrivate = customRenderEmitsGeneric();

/** 组件事件配置 - 外部调用 */
export const customRenderEmits = customRenderEmitsPrivate;

/**
 * 自定义渲染事件类型
 * 提供类型推断支持
 */
export type CustomRenderEmits<T> = ReturnType<typeof customRenderEmitsGeneric<T>>;

// 自定义渲染组件没有特定的插槽定义，因为渲染内容完全由render函数决定
// export interface CustomRenderSlots extends CommonSlots<Record<string, any>> {
// }
