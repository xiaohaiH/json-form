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

// /**
//  * 对树节点做过滤, 优先过滤子级, 过滤后子级还有剩余时, 自身不再做过滤处理
//  * @param {Array} data 数据源
//  * @param {Function} callback 执行的回调
//  * @param {string | Function} [childrenKey] 子级键, 默认 children
//  * @param {string | Function} [childrenKey] 子级键, 默认 children
//  */
// export function treeNodeFilter<T extends Record<string, any>, V extends Record<string, any>, K extends string | ((v: T) => string)>(
//     data: T[],
//     callback: (v: T) => boolean | null | undefined,
//     childrenKey: K = 'children' as K,
// ) {
//     let _children: string;
//     return data.reduce<T[]>((acc, item, idx) => {
//         _children = typeof childrenKey === 'function' ? childrenKey(item) : childrenKey;
//         const children = item[_children] as T[] | undefined;
//         const result = { ...item };
//         delete result[_children];

//         if (children?.length) {
//             const resultChildren = treeNodeFilter(children, callback, childrenKey);
//             // @ts-expect-error 忽视声明报错
//             resultChildren.length && (result[_children] = resultChildren);
//         }
//         if (result[_children]?.length) {
//             acc.push(result);
//         }
//         else {
//             const r = callback(result);
//             r && acc.push(result);
//         }
//         return acc;
//     }, []);
// }
