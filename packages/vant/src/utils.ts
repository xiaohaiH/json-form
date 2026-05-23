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
 * 数组扁平化
 */
export function flat<T>(lists: readonly T[][]): T[] {
    return lists.reduce((acc, list) => {
        acc.push(...list);
        return acc;
    }, []);
}
