import type { CamelCase, getProvideValue, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import { emits2props, plainProps } from '@xiaohaih/json-form-core';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { Component, ExtractPropTypes, PropType } from 'vue-demi';
import type { ComponentType } from '../share';

export interface GroupHookOption {
    /** 组件创建前触发的钩子, 可在内部监听生命周期, 获取实例, 以及操作该组件内的各种属性 */
    created?: (options: { props: ExtractPropTypes<ReturnType<typeof groupPropsGeneric>> }) => void;
}

/** 组件传参 - 私有 */
export function groupPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    return {
        ...{} as unknown as Record<'class' | 'style', { type: PropType<string | Record<string, any> | any[]> }>,
        /** 当前组件类型(防止被继承, 主动声明) */
        t: { type: String },
        /** 提交字段 */
        field: { type: String },
        /** 当前条件对象 */
        query: { type: Object as PropType<Query>, required: true },
        /** 渲染的标签 */
        tag: { type: [Object, String, Array, Function] as PropType<any>, default: 'div' },
        /** 渲染的子条件 */
        config: { type: [Object, Array, Function] as PropType<any> },
        /** 传递给组件的插槽 */
        slots: { type: Object as PropType<GroupSlots<Query, OptionQuery>>, default: () => ({}) },
        /** 组件额外的钩子() */
        hooks: { type: [Object] as PropType<GroupHookOption>, default: undefined },
        /** 获取表单组件实例 */
        getFormRef: { type: Function as PropType<() => any> },
    } as const;
}
/** 组件传参 - 私有 */
export const groupPropsPrivate = groupPropsGeneric();
/** 组件传参 - 外部调用 */
export const groupProps = groupPropsPrivate;
export type GroupProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = Partial<ExtractPropTypes<ReturnType<typeof groupPropsGeneric<T, Query, Option, OptionQuery>>>>;

/** 组件事件 - 私有 */
export function groupEmitsGeneric<T>() {
    return {
    };
}
/** 组件事件 - 私有 */
export const groupEmitsPrivate = groupEmitsGeneric();
/** 组件事件 - 外部调用 */
export const groupEmits = groupEmitsPrivate;
export type GroupEmits<T> = ReturnType<typeof groupEmitsGeneric<T>>;

export interface GroupSlots<Query extends Record<string, any> = any, OptionQuery extends Record<string, any> = any> {
    /** 在表单项前渲染 */
    prepend?: ComponentType<{ query: Query; wrapper: ReturnType<typeof getProvideValue> }>;
    /** 自定义表单渲染逻辑 */
    default?: ComponentType<{ config: Record<string, any> | Record<string, any>[]; query: Query; wrapper: ReturnType<typeof getProvideValue> }>;
    /** 在表单项后渲染 */
    append?: ComponentType<{ query: Query; wrapper: ReturnType<typeof getProvideValue> }>;
}
