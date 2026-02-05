/**
 * 单选框组件类型定义文件
 *
 * 定义单选框组件所需的各种类型、属性和事件
 * 包括组件属性、事件、插槽等类型定义
 */
import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import { Radio as ElRadio } from 'element-ui';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { Component, ExtractPropTypes, PropType } from 'vue-demi';
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, ElObj2Props, FormItemProps } from '../share';
import { commonProps, formItemProps } from '../share';

/**
 * Element UI单选框属性对象
 * 从Element UI Radio组件中提取属性定义
 */
const elRadioProps = (ElRadio as any).props as ElObj2Props<ElRadio>;

/**
 * Element UI单选框事件对象
 * 定义单选框组件支持的原生事件
 */
const elRadioEmits = {
    input: (value: string) => true,
};

/**
 * 单选框属性生成函数 - 泛型版本
 * 生成单选框组件所需的所有属性定义
 */
export function radioPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elRadioProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elRadioEmits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<Query, OptionQuery>,
        ...commonProps as CommonProps<_Prop, RadioSlotOption<Query, OptionQuery>, Query, OptionQuery>,
        ...formItemProps as FormItemProps<Query, OptionQuery>,
        /** 按钮类型(radio|button), 默认 radio */
        type: { type: String as PropType<'radio' | 'button'> },
        /** 选中状态是否可以被取消 */
        cancelable: { type: Boolean as PropType<boolean>, default: undefined },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            default: ComponentType<RadioSlotOption<Query, OptionQuery>>;
        }>>, default: () => ({}) },
    } as const;
}

/**
 * 单选框插槽配置项接口
 * 定义传递给插槽的属性和方法
 */
export interface RadioSlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
}

/** 单选框组件内部使用的属性定义 */
export const radioPropsPrivate = radioPropsGeneric();

/**
 * 单选框组件对外暴露的属性定义
 * 将单选框属性和Element UI单选框属性合并
 */
export const radioProps = emits2props({
    ...elRadioProps,
    ...radioPropsPrivate,
}, elRadioEmits);

/**
 * 单选框属性类型定义
 * 用于单选框组件属性的类型检查和提示
 */
export type RadioProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = Partial<ExtractPropTypes<ReturnType<typeof radioPropsGeneric<Query, OptionQuery>>>>;

/**
 * 单选框事件生成函数 - 泛型版本
 * 生成单选框组件支持的所有事件定义
 *
 * @template T 单选框数据类型
 * @returns 单选框事件定义对象
 */
export function radioEmitsGeneric<T>() {
    return {
        ...{} as typeof elRadioEmits,
    };
}

/** 单选框组件内部使用的事件定义 */
export const radioEmitsPrivate = radioEmitsGeneric();

/**
 * 单选框组件对外暴露的事件定义
 * 将单选框事件和Element UI单选框事件合并
 */
export const radioEmits = {
    ...elRadioEmits,
    ...radioEmitsPrivate,
} as ReturnType<typeof radioEmitsGeneric<any>>;

/**
 * 单选框事件类型定义
 * 用于单选框组件事件的类型检查和提示
 */
export type RadioEmits<T> = ReturnType<typeof radioEmitsGeneric<T>>;

/**
 * 单选框插槽接口
 * 定义单选框组件支持的所有插槽
 * 继承自通用插槽接口
 */
export interface RadioSlots extends CommonSlots<Record<string, any>> {
}
