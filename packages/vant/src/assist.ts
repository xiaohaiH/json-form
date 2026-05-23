import type { CoreOption, getProvideValue } from '@xiaohaih/json-form-core';
import type { Form as VanForm } from 'vant';
import type { ExtractPublicPropTypes, PropType, Ref } from 'vue';
import { ref } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import type * as JSONFormTs from './interface';

/** 对对象类型的泛型进行解析 - 推断出 query 和 optionsQuery */
type AssistOption<T extends Record<string, any>, O extends Partial<Record<keyof T, any>>> = {
    /** 添加问号是允许泛型声明的字段可以多过配置项内的字段 */
    [K in keyof T]?: JSONFormTs.JSONFormOption<T[K], T & TypeAll, O[K], O & TypeAll> | FalsyType;
};
/** 对数组类型的泛型进行解析 - 推断出 query 和 optionsQuery */
type AssistOptionArr<T extends Record<string, any>, O extends Record<keyof T, any>> = JSONFormTs.JSONFormOption<keyof T, CoreOption.Merge<T> & TypeAll, O[keyof O], CoreOption.Merge<Required<O>> & TypeAll>;
/** 假值类型 */
type FalsyType = number | boolean | string | null | undefined;
/** 允许调用任意字段 */
type TypeAll = Record<string | symbol | number, any>;

/**
 * 定义配置项
 * 未补充泛型声明时, 不建议通过函数返回对象形式的配置项(声明会报错)
 */
export function defineOption<T extends Record<string, any>, O extends Partial<Record<keyof T, any>> = Partial<Record<keyof T, any>>>(config: (AssistOptionArr<T, O> | FalsyType)[]): AssistOptionArr<T, O>[];
export function defineOption<T extends Record<string, any>, O extends Partial<Record<keyof T, any>> = Partial<Record<keyof T, any>>>(config: (opt: DefineOptionParams<T, O>) => (AssistOptionArr<T, O> | FalsyType)[]): AssistOptionArr<T, O>[];
export function defineOption<T extends Record<string, any>, O extends Partial<Record<keyof T, any>> = Partial<Record<keyof T, any>>>(config: AssistOption<T, O>): AssistOption<T, O>;
export function defineOption<T extends Record<string, any>, O extends Partial<Record<keyof T, any>> = Partial<Record<keyof T, any>>>(config: (opt: DefineOptionParams<T, O>) => AssistOption<T, O>): AssistOption<T, O>;
export function defineOption(config: any) {
    return config;
}

/** defineOption 为函数时所携带的参数 */
export interface DefineOptionParams<Query extends Record<string, any>, Options extends Record<string, any>> {
    /** 表单 model 对象 */
    query: Query;
    /** 表单封装的一些参数 */
    wrapper: Pick<NonNullable<ReturnType<typeof getProvideValue<Query, Options>>>, 'disabled' | 'readonly' | 'options' | 'reset'> | undefined;
    /** 表单实例 */
    formRef: ComponentExposed<typeof VanForm> | undefined;
}
