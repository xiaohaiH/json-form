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
import type { CommonProps, CommonSlots, CommonSlotsProps, ComponentType, ElObj2Props, FormItemProps } from '../share';
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
export function checkboxPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
    type _Prop = typeof elCheckboxProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elCheckboxEmits>]>>;

    return {
        ...{} as _Prop,
        ...plainProps as PlainProps<Query, OptionQuery>,
        ...commonProps as CommonProps<_Prop, CheckboxSlotOption<Query, OptionQuery>, Query, OptionQuery>,
        ...formItemProps as FormItemProps<Query, OptionQuery>,
        /** 按钮类型(checkbox|button), 默认 checkbox */
        type: { type: String as PropType<'checkbox' | 'button'> },
        /** 传递给组件的插槽 */
        itemSlots: { type: Object as PropType<Partial<{
            default: ComponentType<CheckboxSlotOption<Query, OptionQuery>>;
        }>>, default: () => ({}) },
    } as const;
}

/**
 * 复选框插槽配置项接口
 * 定义传递给插槽的属性和方法
 */
export interface CheckboxSlotOption<Query extends Record<string, any>, OptionQuery extends Record<string, any>> extends CommonSlotsProps<Query, OptionQuery> {
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
}, elCheckboxEmits);

/**
 * 复选框属性类型定义
 * 用于复选框组件属性的类型检查和提示
 */
export type CheckboxProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = Partial<ExtractPropTypes<ReturnType<typeof checkboxPropsGeneric<Query, OptionQuery>>>>;

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
