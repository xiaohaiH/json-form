import type { VNode } from 'vue';

/**
 * 选取对象中指定属性
 */
export function pick<T extends object, TKeys extends keyof T>(obj: T, keys: TKeys[]): Pick<T, TKeys>;
export function pick<T extends object, TKeys extends string>(obj: T, keys: TKeys[]): T;
export function pick<T extends object, TKeys extends keyof T>(obj: T, keys: TKeys[]): Pick<T, TKeys> {
    if (!obj) return {} as Pick<T, TKeys>;
    return keys.reduce((acc, key) => {
        if (Object.prototype.hasOwnProperty.call(obj, key)) acc[key] = obj[key];
        return acc;
    }, {} as Pick<T, TKeys>);
}

/**
 * 获取渲染节点
 * @param {object | Function} node 需渲染元素
 * @param {any} props 当 node 为普通函数时, 传递的属性
 * @example
 * ```ts
 * node 仅支持以下三种类型之一
 * // 基于 defineComponent 定义
 * defineComponent({ render: () => node });
 * // 基于 Vue.extends 扩展
 * Vue.extend({ render: () => node });
 * // 函数返回值为上述两种类型之一
 * (props: Record<string, any>) => defineComponent({ render: () => node });
 * ```
 */
export function getNode(node: Record<string, any> | ((...args: any[]) => VNode) | undefined | null, props?: Record<string, any>) {
    // 直接抛出 null, template 中会报错
    if (!node) return null as unknown as {};
    if (typeof node === 'object') return node;
    return (node as any).mixin ? node : node(props);
}
