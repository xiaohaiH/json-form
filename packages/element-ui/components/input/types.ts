/**
 * 输入框组件类型定义文件
 *
 * 定义输入框组件所需的各种类型、属性和事件
 * 包括组件属性、事件、插槽等类型定义
 */
import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import { Input as ElInput } from 'element-ui';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { Component, ExtractPropTypes, PropType } from 'vue-demi';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, ElObj2Props, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

/**
 * Element UI输入框属性对象
 * 从Element UI Input组件中提取属性定义
 */
const elInputProps = (ElInput as any).props as ElObj2Props<ElInput>;

/**
 * Element UI输入框事件对象
 * 定义输入框组件支持的原生事件
 */
const elInputEmits = {
    change: (value: any) => true,
    blur: (ev: FocusEvent) => true,
    focus: (ev: FocusEvent) => true,
    input: (val: any) => true,
    clear: () => true,
};

/**
 * 输入框属性生成函数 - 泛型版本
 * 生成输入框组件所需的所有属性定义
 */
export function inputPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elInputProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elInputEmits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<Query, OptionQuery>,
        ...commonProps as CommonProps<_Prop, InputSlotOption<Query, OptionQuery>, Query, OptionQuery>,
        ...formItemProps as FormItemProps<Query, OptionQuery>,
        /** 延迟触发抖动时长(单位 ms) */
        debounceTime: { type: Number as PropType<number>, default: undefined },
        /** 是否显示清除按钮 @default true */
        clearable: { type: Boolean as PropType<boolean>, default: true },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            /** 输入框头部内容 */
            prefix: ComponentType<InputSlotOption<Query, OptionQuery>>;
            /** 输入框尾部内容 */
            suffix: ComponentType<InputSlotOption<Query, OptionQuery>>;
            /** 输入框前置内容 */
            prepend: ComponentType<InputSlotOption<Query, OptionQuery>>;
            /** 输入框后置内容 */
            append: ComponentType<InputSlotOption<Query, OptionQuery>>;
        }>>, default: () => ({}) },
    } as const;
}

/**
 * 输入框插槽配置项接口
 * 定义传递给插槽的属性和方法
 */
export interface InputSlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
}

/** 输入框组件内部使用的属性定义 */
export const inputPropsPrivate = inputPropsGeneric();

/**
 * 输入框组件对外暴露的属性定义
 * 将输入框属性和Element UI输入框属性合并
 */
export const inputProps = emits2props({
    ...elInputProps,
    ...inputPropsPrivate,
}, elInputEmits);

/**
 * 输入框属性类型定义
 * 用于输入框组件属性的类型检查和提示
 */
export type InputProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = Partial<ExtractPropTypes<ReturnType<typeof inputPropsGeneric<Query, OptionQuery>>>>;

/**
 * 输入框事件生成函数 - 泛型版本
 * 生成输入框组件支持的所有事件定义
 *
 * @template T 输入框数据类型
 * @returns 输入框事件定义对象
 */
export function inputEmitsGeneric<T>() {
    return {
        ...{} as typeof elInputEmits,
    };
}

/** 输入框组件内部使用的事件定义 */
export const inputEmitsPrivate = inputEmitsGeneric();

/**
 * 输入框组件对外暴露的事件定义
 * 将输入框事件和Element UI输入框事件合并
 */
export const inputEmits = {
    ...elInputEmits,
    ...inputEmitsPrivate,
} as ReturnType<typeof inputEmitsGeneric<any>>;

/**
 * 输入框事件类型定义
 * 用于输入框组件事件的类型检查和提示
 */
export type InputEmits<T> = ReturnType<typeof inputEmitsGeneric<T>>;

/**
 * 输入框插槽接口
 * 定义输入框组件支持的所有插槽
 * 继承自通用插槽接口
 */
export interface InputSlots extends CommonSlots<Record<string, any>> {
}
