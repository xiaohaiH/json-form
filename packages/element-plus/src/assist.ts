import type { CoreOption } from '@xiaohaih/json-form-core';
import type { ExtractPublicPropTypes, PropType, Ref } from 'vue';
import { ref } from 'vue';
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

/** 定义配置项 */
export function defineOption<T extends Record<string, any>, O extends Partial<Record<keyof T, any>> = Partial<Record<keyof T, any>>>(config: (AssistOptionArr<T, O> | FalsyType)[]): Ref<AssistOptionArr<T, O>[]>;
export function defineOption<T extends Record<string, any>, O extends Partial<Record<keyof T, any>> = Partial<Record<keyof T, any>>>(config: AssistOption<T, O>): Ref<AssistOption<T, O>>;
export function defineOption(config: any) {
    return ref(config);
}

// /* 使用示例 - start
// ------------------------------------------ */
// // 对象形式定义
// defineOption({
//     ab: {
//         t: 'input',
//         // defaultValue: '123,',
//         // placeholder: '',
//         options: [{ label: '' }],
//         // itemSlots: {},
//         getOptions(cb, query, option) {
//             const r = option.options.ab; // ab 的类型
//             console.log(r);
//         },
//     },
//     cc: {
//         t: 'custom-render',
//         // defaultValue: 111,
//         // getOptions(cb, query, option) {
//         // },
//         render() {
//             return () => {};
//         },
//     },
//     test: {
//         t: 'group',
//         config: [
//             {
//                 field: '自定义',
//                 t: 'date-picker',
//                 getOptions(cb, query, option) {
//                 },
//             },
//         ],
//     },
//     test2: {
//         t: 'dynamic-group',
//         config: () => [
//             {
//                 field: '强啊',
//                 t: 'color-picker',
//                 getOptions(cb, query, option) {
//                 },
//             },
//             {
//                 field: 'test',
//                 t: 'group',
//                 config: [
//                     {
//                         field: '强化版',
//                         t: 'date-picker',
//                         getOptions(cb, query, option) {
//                         },
//                     },
//                 ],
//             },
//         ],
//     },
// });
// defineOption<{ ab: string; cc: number; bb: string }>({
//     ab: {
//         t: 'input',
//         fields: [],
//         defaultValue: '123,',
//         placeholder: '',
//         options: [{ label: 123, value: 123 }],
//         itemSlots: {},
//         getOptions(cb, query, option) {
//             const r = option.options.ab; // ab 的类型
//             console.log(r);
//         },
//     },
//     cc: {
//         t: 'custom-render',
//         defaultValue: 111,
//         getOptions(cb, query, option) {
//             const r = option.options.cc; // cc 的类型
//             console.log(r);
//         },
//         render() {
//             return () => {};
//         },
//     },
// });
// defineOption<
//     { ab: string; cc: number },
//     { ab: { label: number; value: number }[]; cc: string[]; bb: Record<string, string>[] }
// >({
//     ab: {
//         t: 'input',
//         fields: [],
//         defaultValue: '123,',
//         placeholder: '',
//         options: [{ label: 123, value: 123 }],
//         itemSlots: {},
//         getOptions(cb, query, option) {
//             const r = option.options.ab; // ab 的类型
//             console.log(r);
//         },
//     },
//     cc: {
//         t: 'custom-render',
//         defaultValue: 111,
//         getOptions(cb, query, option) {
//             const r = option.options.cc; // ab 的类型
//             console.log(r);
//         },
//         render() {
//             return () => {};
//         },
//     },
// });
// // 数组形式定义
// defineOption([
//     {
//         field: 'ab',
//         t: 'input',
//         // defaultValue: '123,',
//         // placeholder: '',
//         options: [{ label: '' }],
//         // itemSlots: {},
//         getOptions(cb, query, option) {
//             const r = option.options.ab; // ab 的类型
//             console.log(r);
//         },
//     },
//     {
//         field: 'cc',
//         t: 'custom-render',
//         // defaultValue: 111,
//         // getOptions(cb, query, option) {
//         // },
//         render() {
//             return () => {};
//         },
//     },
//     {
//         field: 'test',
//         t: 'group',
//         config: [
//             {
//                 field: '自定义',
//                 t: 'date-picker',
//                 getOptions(cb, query, option) {
//                 },
//             },
//         ],
//     },
//     {
//         field: 'test2',
//         t: 'dynamic-group',
//         config: () => [
//             {
//                 field: '强啊',
//                 t: 'color-picker',
//                 getOptions(cb, query, option) {
//                 },
//             },
//             {
//                 field: 'test',
//                 t: 'group',
//                 config: [
//                     {
//                         field: '强化版',
//                         t: 'date-picker',
//                         getOptions(cb, query, option) {
//                         },
//                     },
//                 ],
//             },
//         ],
//     },
// ]);
// defineOption<{ ab: string; cc: number }>([
//     {
//         field: 'ab',
//         t: 'input',
//         defaultValue: '123,',
//         placeholder: '',
//         options: [{ label: 123, value: 123 }],
//         itemSlots: {},
//         getOptions(cb, query, option) {
//             const r = option.options.ab; // ab 的类型
//             console.log(r);
//         },
//     },
//     {
//         field: 'cc',
//         t: 'custom-render',
//         defaultValue: 111,
//         getOptions(cb, query, option) {
//             const r = option.options.cc; // cc 的类型
//             console.log(r);
//         },
//         render() {
//             return () => {};
//         },
//     },
// ]);
// defineOption<
//     { ab: string; cc: number },
//     { ab: { label: number; value: number }[]; cc: string[]; bb: Record<string, string>[] }
// >([
//     {
//         field: 'ab',
//         t: 'input',
//         defaultValue: '123,',
//         placeholder: '',
//         options: [{ label: 123, value: 123 }],
//         itemSlots: {},
//         getOptions(cb, query, option) {
//             const r = option.options.ab; // ab 的类型
//             console.log(r);
//         },
//     },
//     {
//         field: 'cc',
//         t: 'custom-render',
//         defaultValue: 111,
//         getOptions(cb, query, option) {
//             const r = option.options.cc; // ab 的类型
//             console.log(r);
//         },
//         render() {
//             return () => {};
//         },
//     },
// ]);
// /* 使用示例 - end
// ------------------------------------------ */

// /* 对象类型推断简化实现
// -----------------------------
// */
// // import type { ExtractPublicPropTypes, PropType } from 'vue';
// function inputPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>>() {
//     return {
//         /** 数据源 */
//         options: { type: [Array, Object] as PropType<Option> },
//         getOptions: { type: Function as PropType<(cb: (data: Option) => void, optionQuery: OptionQuery) => void> },
//     };
// }
// interface S<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> extends ExtractPublicPropTypes<ReturnType<typeof inputPropsGeneric<T, Query, Option, OptionQuery>>> {
//     t: 'input';
// }

// type BuildConfig<T extends Record<string, any>, O extends Record<keyof T, any>> = {
//     // 推断出 options 的值
//     [K in keyof T]: S<O[K], O, T[K], T>;
// };
// function defineOp<T extends Record<string, any>, O extends Record<keyof T, any>>(config: BuildConfig<T, O>) {
//     return config;
// }

// defineOp({
//     s: {
//         t: 'input',
//         options: [{ label: 123 }],
//         getOptions(cb, optionQuery) {
//             // cb回调形参或 optionQuery.s 的类型;
//             cb([{ label: '感冒灵' }]);
//         },
//     },
// });

// /* 数组类型推断简化实现
// -----------------------------
// */
// // import type { ExtractPublicPropTypes, PropType } from 'vue';
// function inputPropsGenericArr<T, Query extends Record<string, any>>() {
//     return {
//         /** 字段 */
//         field: { type: String as unknown as PropType<T> },
//         /** 数据源 */
//         options: { type: [Array, Object] as PropType<any[]> },
//         getOptions: { type: Function as PropType<(cb: (data: any[]) => void, optionQuery: Query) => void> },
//     };
// }

// interface InputProps<T, Query extends Record<string, any>> {
//     field: T;
//     options?: any[];
//     getOptions: (cb: (data: any[]) => void, query: Merge<Query>) => void;
// }
// type Merge<T> = {
//     [K in keyof T]: T[K];
// } & {};
// type SArr<T, Query extends Record<string, any>>
//     = | (InputProps<T, Query> & { t: 'input' })
//         | (InputProps<T, Query> & { t: 'select' });
// type BuildConfigArr<T extends Record<string, any>> = SArr<keyof T, T>;
// function defineOpArr<T extends Record<string, any>>(config: BuildConfigArr<T>[]) {
//     return config;
// }
// defineOpArr([
//     {
//         field: 'aaa',
//         t: 'input',
//         getOptions(cb, query) {
//             cb([{ label: '感冒灵' }]);
//         },
//     },
//     {
//         field: 'bbb',
//         t: 'input',
//         getOptions(cb, query) {
//             cb([{ label: '感冒灵' }]);
//         },
//     },
//     {
//         field: 'ccc',
//         t: 'input',
//         getOptions(cb, query) {
//             cb([{ label: '感冒灵' }]);
//         },
//     },
// ]);
