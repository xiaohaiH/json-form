import type { UnionToIntersection } from 'utility-types';
import type { PropType } from 'vue-demi';
import { camelize } from 'vue-demi';

/**
 * 将 emits 转为 props
 * @param {object | undefined | null} props 待合并的 props
 * @param {(string[] | object | null)[]} emits 待转换的 emits
 * @tip
 * props 尽量用 as const, 防止内部的 required 选项无法被识别
 * 当 emits 为数组时, 需要用 as const, 否则无法识别出事件名称
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
        : { [P in keyof T as CamelCase<`on-${string & P}`>]: T extends Record<string, (...args: any) => any> ? { type: PropType<(...args: Parameters<T[P]>) => void> } : never }
>;

/**
 * 将数组类型 emits 转为对象
 * @param {(string[] | object | null)[]} emits 待转换的 emits
 * @tip
 * 当 emits 为数组时, 需要用 as const, 否则无法识别出事件名称
 */
export function emits2obj<E extends (string[] | Record<string, any> | null | undefined), R = E extends string[] ? { [P in E[number] as CamelCase<string & P>]: () => true } : E extends null | undefined ? {} : E>(emits: E): Partial<R> {
    if (!Array.isArray(emits)) return (emits || {}) as R;
    const r: Record<string, any> = {};
    const loop = () => true;
    emits.forEach((key) => r[camelize(key)] = loop);
    return r as Partial<R>;
}

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
