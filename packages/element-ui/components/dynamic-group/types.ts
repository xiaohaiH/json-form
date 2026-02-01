import type { CamelCase, Obj2Props, PlainProps, usePlain } from '@xiaohaih/json-form-core';
import type { ComponentExposed, ComponentProps } from 'vue-component-type-helpers';
import type { Component, ExtractPropTypes, PropType } from 'vue-demi';
import type { groupPropsGeneric, GroupSlots } from '../group/index';
import { groupProps } from '../group/index';
import type { ComponentType } from '../share';

/** 组件传参 - 私有 */
export function dynamicGroupPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
    return {
        ...groupProps as Omit<ReturnType<typeof groupPropsGeneric<T, Query, Option, OptionQuery>>, 'parseConfig'>,
        /**
         * 如果是组件是存在于数组中的, 需要传递一个唯一键, 读取当前对象中的某个值
         * 防止依赖本数组其它下标中的值时, 如果前一项被删除, 导致依赖误触发
         * 也是作为循环时唯一 key
         *
         * @example
         * ``` ts
         * // 当表单项根据 query.users 动态生成时, 想保证某些情况下依赖不会产生错误
         * // 可传递 uniqueKey: 'id', 此时依赖判断会以条件项的 user[].id 的值做唯一值判断
         * const query = { users: [{ id: '1', name: '', value: '' }, { id: '2', name: '', value: '' }, ...] }
         * ```
         */
        uniqueKey: { type: String },
        /** 传递给每行表单项 DOM 节点的属性 */
        itemProps: { type: Object as PropType<Partial<Record<'class' | 'style', string | Record<string, any> | any[]>>> },
        /** 传递给组件的插槽 - 重写声明 */
        slots: { type: Object as PropType<Omit<DynamicGroupSlots<Query, OptionQuery>, 'default'>>, default: () => ({}) },
        /** 传递给动态渲染组件的插槽 */
        itemSlots: { type: Object as PropType<{
            /** 在动态表单项前渲染 */
            prepend?: ComponentType<{ query: Query; checked: any[]; index: number }>;
            /** 在动态表单项后渲染 */
            append?: ComponentType<{ query: Query; checked: any[]; index: number }>;
        }>, default: () => ({}) },
        /** 校验函数, 返回字符串不通过, 会触发提示 - 提交时触发 */
        validator: { type: [Function] as PropType<(query: Query) => any | Promise<any>> },
        /** 默认值 */
        defaultValue: { type: [Array, Function] as PropType<any[] | (() => any[])> },
    } as const;
}
/** 组件传参 - 私有 */
export const dynamicGroupPropsPrivate = dynamicGroupPropsGeneric();
/** 组件传参 - 外部调用 */

export const dynamicGroupProps = dynamicGroupPropsPrivate;
export type DynamicGroupProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> = Partial<ExtractPropTypes<ReturnType<typeof dynamicGroupPropsGeneric<T, Query, Option, OptionQuery>>>>;

/** 组件事件 - 私有 */
export function dynamicGroupEmitsGeneric<T>() {
    return {
    };
}
/** 组件事件 - 私有 */
export const dynamicGroupEmitsPrivate = dynamicGroupEmitsGeneric();
/** 组件事件 - 外部调用 */
export const dynamicGroupEmits = dynamicGroupEmitsPrivate;
export type DynamicGroupEmits<T> = ReturnType<typeof dynamicGroupEmitsGeneric<T>>;

export interface DynamicGroupSlots<Query extends Record<string, any> = any,  OptionQuery extends Record<string, any> = any> extends GroupSlots<Query, OptionQuery> {
}
