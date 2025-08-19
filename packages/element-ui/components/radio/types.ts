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
import type { CommonProps, CommonSlots, DynamicProps, ElObj2Props, FormItemProps, StaticProps } from '../share';
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
 *
 * @template T 单选框数据类型
 * @template Query 查询参数类型
 * @template Option 选项类型
 * @template OptionQuery 选项查询类型
 * @returns 单选框属性定义对象
 */
export function radioPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elRadioProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elRadioEmits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<T, RadioSlotOption<T, Query, Option, OptionQuery>, Query, Option>,
        ...formItemProps as FormItemProps<Query, Option>,
        /** 组件静态属性(与 formItem 或内置的属性冲突时, 可通过该属性传递) */
        staticProps: { type: Object as PropType<StaticProps<_Prop>> },
        /** 组件动态属性 */
        dynamicProps: { type: Function as PropType<DynamicProps<_Prop, Query, Option>> },
        /** 按钮类型(radio|button), 默认 radio */
        type: { type: String as PropType<'radio' | 'button'> },
        /** 选中状态是否可以被取消 */
        cancelable: { type: Boolean as PropType<boolean>, default: undefined },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            default: ((props: RadioSlotOption<T, Query, Option, OptionQuery>) => any);
        }>>, default: () => ({}) },
    } as const;
}

/**
 * 单选框插槽配置项接口
 * 定义传递给插槽的属性和方法
 */
export interface RadioSlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    /** 获取表单项属性的方法 */
    getFormItemProps: () => Partial<FormItemProps<Query, Option>>;
    /** 获取单选框组件属性的方法 */
    getItemProps: () => Partial<ExtractPropTypes<typeof elRadioProps>>;
    /** 获取所有属性的方法 */
    getProps: () => RadioProps<T, Query, Option, OptionQuery>;
    /** 额外选项 */
    extra: {
        /** 当前绑定的值 */
        value: T;
        /** 可用选项列表 */
        options: Option[];
        /** 值变更处理函数 */
        onChange: (value: T) => void;
        /** 单选框类型 */
        radioType: 'ElRadio' | 'ElRadioButton';
    };
    /** 组件扁平化数据对象 */
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
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
}, elRadioEmits) as typeof radioPropsPrivate;

/**
 * 单选框属性类型定义
 * 用于单选框组件属性的类型检查和提示
 */
export type RadioProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = Partial<ExtractPropTypes<ReturnType<typeof radioPropsGeneric<T, Query, Option, OptionQuery>>>>;

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
