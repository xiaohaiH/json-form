/**
 * 表单包装器类型定义文件
 *
 * 定义表单组件所需的各种类型、属性和事件
 */
import type { CamelCase, WrapperProps as CoreWrapperProps, emits2props, Obj2Props, useWrapper, WrapperArrayable } from '@xiaohaih/json-form-core';
import { wrapperProps as coreWrapperProps, emits2obj } from '@xiaohaih/json-form-core';
import { Form as VanForm } from 'vant';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { defineOption } from '../../src/assist';
import type { ComponentType } from '../share';

/**
 * Vant 表单属性对象
 * 从 Vant Form 组件中提取属性定义
 */
const vantFormProps = VanForm.props as unknown as Obj2Props<ComponentProps<typeof VanForm>>;
/**
 * Vant 表单事件对象
 */
const vantFormEmits = emits2obj(VanForm.emits);

/** 表单属性生成函数 */
export function formPropsGeneric<T extends Record<string, any> = Record<string, any>, O extends Record<keyof T, any> = Record<keyof T, any>>() {
    type _Prop = typeof vantFormProps & ReturnType<typeof emits2props<null, [NonNullable<typeof vantFormEmits>]>> & {
        class: { type: PropType<string | Record<string, any> | any[]> };
        style: { type: PropType<string | Record<string, any> | any[]> };
    };

    return {
        ...{} as Omit<_Prop, 'model'>,
        ...coreWrapperProps,
        /** 数据源 - 表单项配置对象 */
        config: { type: [Object, Array, Function] as PropType<any[] | ((...args: any[]) => any) | Record<string, any>> },
    } as const;
}
/** 表单组件内部使用的属性定义 */
export const formPropsPrivate = formPropsGeneric();

/**
 * 表单组件对外暴露的属性定义
 */
export const formProps = {
    ...vantFormProps,
    ...formPropsPrivate,
};

/**
 * 表单事件生成函数 - 泛型版本
 */
export function formEmitsGeneric<T>() {
    return {
        ...{} as typeof vantFormEmits,
        /** 重写提交事件 - 覆盖传参 */
        submit: (params: Record<string, any>) => true,
    };
}

/** 表单组件内部使用的事件定义 */
export const formEmitsPrivate = formEmitsGeneric();

/**
 * 表单组件对外暴露的事件定义
 */
export const formEmits = {
    ...vantFormEmits,
    ...formEmitsPrivate,
} as typeof vantFormEmits & typeof formEmitsPrivate;

/**
 * 表单事件类型定义
 */
export type FormEmits<T> = ReturnType<typeof formEmitsGeneric<T>>;

/**
 * 表单插槽接口
 */
export interface FormSlots<Query extends Record<string, any>, OptionQuery extends Partial<Record<keyof Query, any>>> {
    /** 前置插槽 - 在表单项之前 */
    prepend?: ComponentType<FormSlotProps<Query, OptionQuery>>;
    /** 默认插槽 - 在表单项之后 */
    default?: ComponentType<FormSlotProps<Query, OptionQuery>>;
}

/**
 * 表单插槽属性接口
 */
export interface FormSlotProps<Query extends Record<string, any>, OptionQuery extends Partial<Record<keyof Query, any>>> {
    /** 获取表单属性的方法 */
    props: ExtractPublicPropTypes<ReturnType<typeof formPropsGeneric<Query, OptionQuery>>>;
    /** 表单包装器实例 */
    wrapper: ReturnType<typeof useWrapper>;
}
