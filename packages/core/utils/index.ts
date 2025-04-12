import type { VNode } from 'vue-demi';
import { markRaw } from 'vue-demi';
import type { Hyphenate } from './base';

/**
 * 空值转为提供的默认值
 * @param {*} val 值为空时转为默认值
 * @param {*} defaultVal
 */
export function emptyToValue<T>(val: any, defaultVal: T) {
    // 数组不应该置为空值, 影响到组件内部逻辑
    // if (Array.isArray(val)) return val.filter(Boolean).length ? val : defaultVal;
    return isEmptyValue(val) ? defaultVal : val;
}

/** 判断两个值是否相等, 排除掉空值 */
export function isEqualExcludeEmptyValue(x: any, y: any) {
    return (isEmptyValue(x) && isEmptyValue(y)) || isEqual(x, y);
}

/** 判断是否是空值(null, undefined, '') */
export function isEmptyValue(val: any) {
    return val === undefined || val === '' || val === null;
}

/** 判断两个值是否一致 */
export function isEqual(x: any, y: any): boolean {
    if (Object.is(x, y)) return true;
    if (x instanceof Date && y instanceof Date) {
        return x.getTime() === y.getTime();
    }
    if (x instanceof RegExp && y instanceof RegExp) {
        return x.toString() === y.toString();
    }
    if (typeof x !== 'object' || x === null || typeof y !== 'object' || y === null) {
        return false;
    }
    const keysX = Reflect.ownKeys(x as unknown as object) as (keyof typeof x)[];
    const keysY = Reflect.ownKeys(y as unknown as object);
    if (keysX.length !== keysY.length) return false;
    for (let i = 0; i < keysX.length; i++) {
        if (!Reflect.has(y as unknown as object, keysX[i])) return false;
        if (!isEqual(x[keysX[i]], y[keysX[i]])) return false;
    }
    return true;
}

/** 判断是否是原始类型(number , string , boolean , symbol, bigint, undefined, null) */
export function isPrimitive(value: any) {
    return value === undefined || value === null || (typeof value !== 'object' && typeof value !== 'function');
}

/** 拷贝 */
export function clone<T>(obj: T, deep?: boolean): T {
    if (isPrimitive(obj)) return obj;
    if (typeof obj === 'function') return obj.bind({});
    const newObj = new ((obj as object).constructor as { new (): T })();
    Object.getOwnPropertyNames(obj).forEach((prop) => {
        (newObj as any)[prop] = deep ? clone((obj as any)[prop]) : (obj as any)[prop];
    });
    return newObj;
}

/**
 * 获取指定层级的父级(包括自身)
 * @param {Record<string, any>[]} data 数据源
 * @param {(item) => boolean} cb 当前数据项是否匹配
 */
export function getChained<T extends Record<string, any>>(
    data: T[],
    cb: (item: T) => boolean,
    childrenKey = 'children',
): T[] {
    for (const item of data) {
        if (cb(item)) {
            return [item];
        }
        else if (item[childrenKey]?.length) {
            const r = getChained(item[childrenKey], cb);
            if (r.length) {
                r.unshift(item);
                return r;
            }
        }
    }
    return [];
}

/**
 * 获取渲染节点
 * @param {string | number | object | Function} node 需渲染元素
 */
export function getNode(node: string | number | Record<string, any> | ((...args: any[]) => VNode) | undefined | null) {
    // 直接抛出 null, template 中会报错
    if (!node && node !== 0) return null as unknown as {};
    return typeof node === 'function' ? node : typeof node === 'object' ? markRaw(node) : () => node;
}

/**
 * 通过字符串路径获取值
 * @example get(person, 'friends[0].name')
 */
export function get<TDefault = unknown>(value: any, path: string, defaultValue?: TDefault): TDefault {
    const segments = path.split(/[.[\]]/);
    let current: any = value;
    for (const key of segments) {
        if (current === null) return defaultValue as TDefault;
        if (current === undefined) return defaultValue as TDefault;
        const dequoted = key.replace(/['"]/g, '');
        if (dequoted.trim() === '') continue;
        current = current[dequoted];
    }
    if (current === undefined) return defaultValue as TDefault;
    return current;
}

/**
 * 判断对象是否存在指定属性
 * @example hasOwn({}, 'a')
 */
export function hasOwn<T extends Record<string, any>, K extends keyof T = keyof T>(obj: T, key: K) {
    // eslint-disable-next-line no-prototype-builtins
    return Object.hasOwn ? Object.hasOwn(obj, key) : obj.hasOwnProperty(key);
}

/** 缓存字符串 */
function cacheStringFunction<T extends (key: string) => any>(fn: T): T {
    const cache: Record<string, any> = {};
    return ((str: string) => {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
    }) as unknown as T;
}

const hyphenateRE = /\B([A-Z])/g;
/** 将驼峰转为 - 连接 */
export const hyphenate = cacheStringFunction(
    <T extends string>(str: T) => str.replace(hyphenateRE, '-$1').toLowerCase() as Hyphenate<T>,
);
