// 不能直接用 vue-demi 的 ExtractPropTypes, 编译后项目会找不到该类型
import type { ExtractPropTypes, Ref, UnwrapRef } from 'vue-demi';
import type { plainProps, wrapperProps } from './use/index';

export type BuiltInField = 'query' | 'uniqueValue' | 'parentQuery';

/** 获取实际值(去除 ref 引用) */
export type ToRaw<T> = UnwrapRef<T>;

export interface WrapperProps extends Omit<ExtractPropTypes<OmitDefaultKey<typeof wrapperProps>>, BuiltInField> {}
export interface PlainProps extends Omit<Partial<ExtractPropTypes<OmitDefaultKey<typeof plainProps>>>, BuiltInField> {
}
// export interface TreeProps extends Omit<ExtractPropTypes<OmitDefaultKey<typeof treeProps>>, BuiltInField> {}

export type OmitDefaultKey<T> = T extends Record<string | symbol, any>
    ? { [K in keyof T]: T[K] extends { default: any } ? Omit<T[K], 'default'> : T[K]; }
    : T;
