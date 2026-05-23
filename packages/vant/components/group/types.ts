import type { EventsWithoutInstance, getProvideValue } from '@xiaohaih/json-form-core';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import type { ComponentType } from '../share';

export interface GroupHookOption {
    /** 组件创建前触发的钩子, 可在内部监听生命周期, 获取实例, 以及操作该组件内的各种属性 */
    created?: (options: { props: ExtractPublicPropTypes<ReturnType<typeof groupPropsGeneric>>; wrapper: ReturnType<typeof getProvideValue> } & EventsWithoutInstance) => void;
}

/** 组件传参 */
export function groupPropsGeneric<Query extends Record<string, any>, OptionQuery extends Record<string, any>>() {
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
        /** 传递给渲染标签的插槽(默认插槽是渲染的子条件) */
        tagSlots: { type: Object as PropType<Record<string, ComponentType<{ query: Query; wrapper: ReturnType<typeof getProvideValue> }>>> },
        /** 渲染的子条件 */
        config: { type: [Object, Array, Function] as PropType<any> },
        /** 传递给组件的插槽 */
        slots: { type: Object as PropType<GroupSlots<Query, OptionQuery>> },
        /** 组件额外的钩子() */
        hooks: { type: [Object] as PropType<GroupHookOption>, default: undefined },
        /** 获取表单组件实例 */
        getFormRef: { type: Function as PropType<() => any> },
    } as const;
}
/** 组件传参 */
export const groupPropsPrivate = groupPropsGeneric();
/** 组件传参 - 外部调用 */
export const groupProps = groupPropsPrivate;
export type GroupProps<Query extends Record<string, any>, OptionQuery extends Record<string, any>> = ExtractPublicPropTypes<ReturnType<typeof groupPropsGeneric<Query, OptionQuery>>>;

/** 组件事件 */
export function groupEmitsGeneric<T>() {
    return {};
}
/** 组件事件 */
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
