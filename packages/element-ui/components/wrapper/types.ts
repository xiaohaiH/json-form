/**
 * 表单包装器类型定义文件
 *
 * 定义表单组件所需的各种类型、属性和事件, 包括:
 * - 表单属性定义
 * - 表单事件定义
 * - 表单插槽类型
 * - 表单相关的接口类型
 */
import type { CamelCase, WrapperProps as CoreWrapperProps, Obj2Props, useWrapper, WrapperArrayable } from '@xiaohaih/json-form-core';
import { wrapperProps as coreWrapperProps, emits2obj, emits2props } from '@xiaohaih/json-form-core';
import { Form as ElForm, Message as ElMessage } from 'element-ui';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { Component, ExtractPropTypes, PropType } from 'vue-demi';
import type { defineOption } from '../../src/assist';
import type { ComponentType, ElObj2Props } from '../share';

/**
 * Element UI表单属性对象
 * 从Element UI Form组件中提取属性定义
 */
const elFormProps = (ElForm as any).props as ElObj2Props<ElForm>;

/**
 * Element UI表单事件对象
 * 定义表单组件支持的原生事件
 */
const elFormEmits = {
    validate: () => true,
};

/** 表单属性生成函数 */
export function formPropsGeneric<T extends Record<string, any> = Record<string, any>, O extends Record<keyof T, any> = Record<keyof T, any>>() {
    type _Prop = typeof elFormProps & ReturnType<typeof emits2props<null, [NonNullable<typeof elFormEmits>]>> & {
        class: { type: PropType<string | Record<string, any> | any[]> };
        style: { type: PropType<string | Record<string, any> | any[]> };
    };

    return {
        ...{} as Omit<_Prop, 'model'>,
        ...coreWrapperProps,
        /**
         * @deprecated 兼容旧版, 请改用 config 属性
         */
        datum: { type: [Object, Array, Function] as PropType<any> },
        /** 数据源 - 表单项配置对象(由于泛型会导致不兼容, 因此只要符合基本格式即可) */
        config: { type: [Object, Array, Function] as PropType<any[] | ((...args: any[]) => any) | Record<string, any>> },
        // /** 是否启用排序 */
        // sortable: { type: Boolean as PropType<boolean> },
    } as const;
}

/** 表单组件内部使用的属性定义 */
export const formPropsPrivate = formPropsGeneric();

/**
 * 表单组件对外暴露的属性定义
 * 将表单属性和Element UI表单属性合并
 */
export const formProps = emits2props({
    ...elFormProps,
    ...formPropsPrivate,
});

/**
 * 表单事件生成函数 - 泛型版本
 * 生成表单组件支持的所有事件定义
 *
 * @template T 表单数据类型
 * @returns 表单事件定义对象
 */
export function formEmitsGeneric<T>() {
    return {
        ...{} as typeof elFormEmits,
        // /** query 已初始化 - 组件就绪时触发 */
        // ready: (query: Record<string, any>) => true,
        // /** 搜索事件 - 触发内部 query 对象更新 */
        // search: (query: Record<string, any>) => true,
        // /** 重置事件 - 重置表单数据时触发 */
        // reset: (query: Record<string, any>) => true,
        // /**
        //  * 字段值发生改变时触发
        //  * @param {object} option 提供的字段变更信息
        //  * @param {string} option.field 实际改变的键
        //  * @param {*} option.value 字段的新值
        //  * @param {object} option.query 当前表单的完整数据
        //  * @param {string} option.nativeField 原始健(不受 as, fields 等属性影响)
        //  */
        // fieldChange: (option: { field: string; value: any; query: Record<string, any>; nativeField: string }) => true,
    };
}

/** 表单组件内部使用的事件定义 */
export const formEmitsPrivate = formEmitsGeneric();

/**
 * 表单组件对外暴露的事件定义
 * 将表单事件和Element UI表单事件合并
 */
export const formEmits = {
    ...elFormEmits,
    ...formEmitsPrivate,
};

/**
 * 表单事件类型定义
 * 用于表单组件事件的类型检查和提示
 */
export type FormEmits<T> = ReturnType<typeof formEmitsGeneric<T>>;

/**
 * 表单插槽接口
 * 定义表单组件支持的所有插槽
 */
export interface FormSlots<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    /** 前置插槽 - 在表单项之前 */
    prepend?: ComponentType<FormSlotProps<T, Query, Option, OptionQuery>>;
    /** 默认插槽 - 在表单项之后 */
    default?: ComponentType<FormSlotProps<T, Query, Option, OptionQuery>>;
}

/**
 * 表单插槽属性接口
 * 定义传递给插槽的属性和方法
 */
export interface FormSlotProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    /** 获取表单属性的方法 */
    getProps: () => ExtractPropTypes<ReturnType<typeof formPropsGeneric<any>>>;
    /** 表单包装器实例 */
    plain: ReturnType<typeof useWrapper>;
}
