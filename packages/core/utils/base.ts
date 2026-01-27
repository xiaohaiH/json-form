import type { UnionToIntersection } from 'utility-types';
import type { PropType } from 'vue-demi';
// import { camelize } from 'vue-demi';

const wordReg = /-\w/g;
function camelize(name: string) {
    return name.replace(wordReg, ($1) => $1.slice(1).toUpperCase());
}
/**
 * 将 emits 转为 props
 * @param {object | undefined | null} props 待合并的 props
 * @param {(string[] | object | null)[]} emits 待转换的 emits
 * @tip
 * props 尽量用 as const, 防止内部的 required 选项无法被识别
 * 当 emits 为数组时, 需要用 as const, 否则无法识别出事件名称
 * 
 * @example
 * ```ts
 * const typeDef = { type: Function };
 * emits = { click: noop, dataChange: noop }; // return { onClick: typeDef, onDataChange: typeDef }
 * emits = ['click', 'data-change']; // return { onClick: typeDef, onDataChange: typeDef }
 * ```
 */
export function emits2props<T extends Record<string, any> | undefined | null, E extends (string[] | Record<string, any> | null | undefined)[]>(props: T, ...emits: E) {
    const _r = (props || {}) as (T extends undefined | null ? {} : T) & UnionToIntersection<Emits2Props<NonNullable<E[number]>>>;
    const typeFunction = { type: Function };
    // @ts-expect-error 事件补充为 props 属性
    emits.forEach((o) => o && (Array.isArray(o) ? o.forEach((k) => _r[camelize(`on-${k}`)] = typeFunction) : Object.keys(o).forEach((k) => _r[camelize(`on-${k}`)] = typeFunction)));

    return _r;
}
export type Emits2Props<T> = UnionToIntersection<
    T extends string[]
        ? Record<CamelCase<`on-${T[number]}`>, PropType<(...args: any[]) => void>>
        : { [P in keyof T as CamelCase<`on-${string & P}`>]: T extends Partial<Record<string, (...args: any) => any>> ? { type: PropType<(...args: Parameters<NonNullable<T[P]>>) => void> } : never }
>;

/**
 * 将数组类型 emits 转为对象
 * @param {(string[] | object | null)[]} emits 待转换的 emits
 * @tip
 * 当 emits 为数组时, 需要用 as const, 否则无法识别出事件名称
 * 
 * @example
 * ```ts
 * emits = { click: noop, dataChange: noop }; // return { click: noop, dataChange: noop }
 * emits = ['click', 'data-change']; // return { click: noop, dataChange: noop }
 * ```
 */
export function emits2obj<E extends (string[] | Record<string, any> | null | undefined), R = E extends string[] ? { [P in E[number] as CamelCase<string & P>]: () => true } : E extends null | undefined ? {} : E>(emits: E): ExtractEvents<R> {
    if (!Array.isArray(emits)) return (emits || {}) as ExtractEvents<R>;
    const r: Record<string, any> = {};
    const noop = () => true;
    emits.forEach((key) => r[camelize(key)] = noop);
    return r as ExtractEvents<R>;
}

/**
 * 由于高版本 vue 对类型进行了调整
 * 因此抽取一个变量来提取组件中暴露的事件
 * ```typescript
 * // 高版本类型定义
 * type emits = (E | EE[]) & ThisType<void>;
 * // 经过 emits2obj 函数处理但未经改方法调整提取出来的结果
 * type Result1 =
 * | {}
 * | ({
 *   '事件1': (...args: any[]) => void;
 *   '事件2': (...args: any[]) => void;
 * } & ThisType<...>)
 * | {
 *     [x: string]: () => true
 * }
 * type Result2 = {} | Record<'事件1' | '事件2', () => true>;
 * type Result3 = {} | (Record<string, any> & ThisType<void>) | { [x: string]: () => true; }
 *
 * // 经过改方法调整提取出来的结果
 * type Result1 = Record<'事件1' | '事件2', (...args: any) => void> & ThisType<...>;
 * type Result2 = Record<'事件1' | '事件2', () => true>;
 * type Result3 = Partial<Record<string, any> & ThisType<void> & { [x: string]: () => true; }>;
 * ```
 */
export type ExtractEvents<U>
// 由联合类型转为交叉类型
= UnionToIntersection<
    // 如果类型不为 Result2 之类时, 进入判断, 否则直接返回
    FuncNoopType extends U
        // 如果匹配, 说明不是 Result1 类型, 进入判断
        ? Exclude<U, FuncNoopType> extends never
            ? U
            // 排除 Result1 中的 FuncNoopType
            : Exclude<U, FuncNoopType>
        : U
>;

export type FuncNoopType = Record<string, () => true>;

/** 转为小驼峰 */
export type CamelCase<T extends string> = T extends `${infer A}-${infer B}` ? CamelCase<`${A}${Capitalize<B>}`> : T;

/** 转为 - 连接 */
export type Hyphenate<S extends string> = S extends `${infer First}${infer Rest}`
    ? `${Lowercase<First>}${
      Rest extends Uncapitalize<Rest>
          ? Hyphenate<Rest>
          : `-${Hyphenate<Uncapitalize<Rest>>}`
    }`
    : S;

/** 将对象转为 vue props */
export type Obj2Props<T> = {
    [K in keyof T]-?: { type: PropType<NonNullable<T[K]>>; validator: undefined };
};
