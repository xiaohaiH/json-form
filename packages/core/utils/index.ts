import type { VNode } from 'vue-demi';
import type { Hyphenate } from './base';

/** 空函数 */
export function loop() {}

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
    // 不做引用类型的比较, 防止引用地址不同 导致无法赋值
    return (isEmptyValue(x) && isEmptyValue(y)); // || isEqual(x, y);
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
    return typeof node === 'function' ? node : typeof node === 'object' ? node : () => node;
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
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-ignore 忽视vue2版本报目标库错误
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

/**
 * 版本比较, 比较两个语义化版本号(支持预发布标签: alpha/beta/rc 等; 支持 `v` 前缀)
 * @param {string} version1 待比较版本1
 * @param {string} version2 待比较版本2
 * @returns {number} 比较结果: -1 表示 version1 < version2, 0 表示相等, 1 表示 version1 > version2
 * @example
 * ```ts
 * compareVersion('1.1.0-beta.16', '1.1.0') // -1
 * compareVersion('2.10.7', '2.9.9') // 1
 * compareVersion('v1.0.0', '1.0.0') // 0
 * ```
 */
export function compareVersion(version1: string, version2: string): number {
    // 移除前缀 'v' 如果存在
    const v1 = version1.charAt(0) === 'v' ? version1.slice(1) : version1;
    const v2 = version2.charAt(0) === 'v' ? version2.slice(1) : version2;

    // 分割版本号
    const parts1 = v1.split(/[.-]/);
    const parts2 = v2.split(/[.-]/);

    // 获取最大长度
    const maxLength = Math.max(parts1.length, parts2.length);

    for (let i = 0; i < maxLength; i++) {
        const part1 = parts1[i] || '0';
        const part2 = parts2[i] || '0';

        // 检查是否为预发布版本(如 beta, alpha, rc 等)
        const isPreRelease1 = /[a-z]/i.test(part1);
        const isPreRelease2 = /[a-z]/i.test(part2);

        // 如果一个是预发布版本, 另一个不是, 则非预发布版本更大
        if (isPreRelease1 && !isPreRelease2) {
            return -1;
        }
        if (!isPreRelease1 && isPreRelease2) {
            return 1;
        }

        // 如果都是预发布版本, 按字母顺序比较
        if (isPreRelease1 && isPreRelease2) {
            if (part1 < part2) return -1;
            if (part1 > part2) return 1;
            continue;
        }

        // 数字比较
        const num1 = Number.parseInt(part1, 10);
        const num2 = Number.parseInt(part2, 10);

        if (num1 < num2) return -1;
        if (num1 > num2) return 1;
    }

    return 0;
}

/**
 * 检查版本是否满足条件
 * @param {string} currentVersion 当前版本
 * @param {string} requiredVersion 要求的版本
 * @param {string} operator 比较操作符 ('>=', '>', '<=', '<', '=', '==')
 */
export function checkVersion(currentVersion: string, requiredVersion: string, operator: '>=' | '>' | '<=' | '<' | '=' | '=='): boolean {
    const comparison = compareVersion(currentVersion, requiredVersion);

    if (operator === '>=') return comparison >= 0;
    if (operator === '>') return comparison > 0;
    if (operator === '<=') return comparison <= 0;
    if (operator === '<') return comparison < 0;
    if (operator === '=' || operator === '==') return comparison === 0;
    return false;
}
