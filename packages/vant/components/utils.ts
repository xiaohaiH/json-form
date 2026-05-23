/**
 * 根据指定值获取树形链
 * @param {Array} sources 待查找的数据源
 * @param {object} value 匹配值
 * @param {string} childrenKey 子级的 key, 默认 children
 */
export function getChained<T extends Record<string, any>>(
    sources: T[],
    value: Partial<T>,
    childrenKey = 'children',
): T[] {
    const result: T[] = [];
    carryChained(
        sources,
        value,
        (data) => {
            result.unshift(data);
        },
        childrenKey,
    );
    return result;
}

/**
 * 寻找匹配条件值并执行回调
 * @param {Array} sources 待查找的数据源
 * @param {object} value 匹配值
 * @param {Function} callback 执行的回调
 * @param {string} childrenKey 子级的 key, 默认 children
 */
export function carryChained<T extends Record<string, any>>(
    sources: T[],
    value: Partial<T>,
    callback: (data: T, isDeep?: boolean) => void,
    childrenKey = 'children',
): boolean | undefined {
    const conditions = Object.entries(value);
    for (const v of sources) {
        const status = conditions.every(([k, val]) => val === v[k]);
        if (status) {
            callback(v, true);
            return true;
        }
        if (v[childrenKey] && v[childrenKey].length) {
            const result = carryChained(v[childrenKey], value, callback, childrenKey);
            if (result) {
                callback(v);
                return true;
            }
        }
    }
}
