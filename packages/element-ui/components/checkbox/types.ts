/**
 * 复选框组件类型定义文件
 *
 * 定义复选框组件所需的各种类型、属性和事件
 * 包括组件属性、事件、插槽等类型定义
 */
import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2obj, emits2props, plainProps } from '@xiaohaih/json-form-core';
import { Checkbox as ElCheckbox } from 'element-ui';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { Component, ExtractPropTypes, PropType } from 'vue-demi';
import type { CommonProps, CommonSlots, DynamicProps, ElObj2Props, FormItemProps, StaticProps } from '../share';
import { commonProps, formItemProps } from '../share';

/**
 * Element UI复选框属性对象
 * 从Element UI Checkbox组件中提取属性定义
 */
const elCheckboxProps = (ElCheckbox as any).props as ElObj2Props<Omit<ElCheckbox, 'checked'>>;

/**
 * Element UI复选框事件对象
 * 定义复选框组件支持的原生事件
 */
const elCheckboxEmits = {
    change: (value: any) => true,
};

/**
 * 复选框属性生成函数 - 泛型版本
 * 生成复选框组件所需的所有属性定义
 *
 * @template T 复选框数据类型
 * @template Query 查询参数类型
 * @template Option 选项类型
 * @template OptionQuery 选项查询类型
 * @returns 复选框属性定义对象
 */
export function checkboxPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elCheckboxProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elCheckboxEmits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<T, Query, Option, OptionQuery>,
        ...commonProps as CommonProps<T, CheckboxSlotOption<T, Query, Option, OptionQuery>, Query, Option>,
        ...formItemProps as FormItemProps<Query, Option>,
        /** 组件静态属性(与 formItem 或内置的属性冲突时, 可通过该属性传递) */
        staticProps: { type: Object as PropType<StaticProps<_Prop>> },
        /** 组件动态属性 */
        dynamicProps: { type: Function as PropType<DynamicProps<_Prop, Query, Option>> },
        /** 按钮类型(checkbox|button), 默认 checkbox */
        type: { type: String as PropType<'checkbox' | 'button'> },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            default: ((props: CheckboxSlotOption<T, Query, Option, OptionQuery>) => any);
        }>>, default: () => ({}) },
    } as const;
}

/**
 * 复选框插槽配置项接口
 * 定义传递给插槽的属性和方法
 */
export interface CheckboxSlotOption<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    /** 获取表单项属性的方法 */
    getFormItemProps: () => Partial<FormItemProps<Query, Option>>;
    /** 获取复选框组件属性的方法 */
    getItemProps: () => Partial<ExtractPropTypes<typeof elCheckboxProps>>;
    /** 获取所有属性的方法 */
    getProps: () => CheckboxProps<T, Query, Option, OptionQuery>;
    /** 可用选项列表 */
    options: Option[];
    /** 当前绑定的值 */
    value: T;
    /** 值变更处理函数 */
    onChange: (value: T) => void;
    /** 复选框类型（普通复选框或按钮样式） */
    checkboxType: 'ElCheckboxButton' | 'ElCheckbox';
    /** 组件类名 */
    class: string;
    /** 组件扁平化数据对象 */
    plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>>;
}

/** 复选框组件内部使用的属性定义 */
export const checkboxPropsPrivate = checkboxPropsGeneric();

/**
 * 复选框组件对外暴露的属性定义
 * 将复选框属性和Element UI复选框属性合并
 */
export const checkboxProps = emits2props({
    ...elCheckboxProps,
    ...checkboxPropsPrivate,
}, elCheckboxEmits) as typeof checkboxPropsPrivate;

/**
 * 复选框属性类型定义
 * 用于复选框组件属性的类型检查和提示
 */
export type CheckboxProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = Partial<ExtractPropTypes<ReturnType<typeof checkboxPropsGeneric<T, Query, Option, OptionQuery>>>>;

/**
 * 复选框事件生成函数 - 泛型版本
 * 生成复选框组件支持的所有事件定义
 *
 * @template T 复选框数据类型
 * @returns 复选框事件定义对象
 */
export function checkboxEmitsGeneric<T>() {
    return {
        ...{} as typeof elCheckboxEmits,
    };
}

/** 复选框组件内部使用的事件定义 */
export const checkboxEmitsPrivate = checkboxEmitsGeneric();

/**
 * 复选框组件对外暴露的事件定义
 * 将复选框事件和Element UI复选框事件合并
 */
export const checkboxEmits = {
    ...elCheckboxEmits,
    ...checkboxEmitsPrivate,
};

/**
 * 复选框事件类型定义
 * 用于复选框组件事件的类型检查和提示
 */
export type CheckboxEmits<T> = ReturnType<typeof checkboxEmitsGeneric<T>>;

/**
 * 复选框插槽接口
 * 定义复选框组件支持的所有插槽
 * 继承自通用插槽接口
 */
export interface CheckboxSlots extends CommonSlots<Record<string, any>> {
}
