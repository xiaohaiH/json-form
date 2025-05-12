import type { ExtractPropTypes, PropType, UnwrapNestedRefs } from 'vue-demi';
import { reactive } from 'vue-demi';
import type * as JSONFormTs from './interface';

/** 当泛型为多个参数时, 辅助推断类型 */
type AssistOption<T extends Record<string, any>, O extends Partial<Record<keyof T, any>>> = {
    // 推断出 query 的值(经过 PropType 的转换, 会导致 ts 丢失实际的值)
    // 在不主动补充声明的情况下, 会自动推断 options 值, 因此第一个参数用在 options 上, 第二个参数用在 query 上
    // [K in keyof T]?: JSONFormTs.JSONFormOption<T[K], T, O[K], O>;
    // 推断出 options 的值
    [K in keyof T]?: JSONFormTs.JSONFormOption<O[K], O & Record<string | symbol | number, any>, T[K], objAttr2Arr<T & Record<string | symbol | number, any>>> | FalsyType;
};
/** 将对象中的值转为数组 */
type objAttr2Arr<T> = { [K in keyof T]: T[K][] };
/** 当泛型为一个参数时, 辅助推断类型 */
type Assist2Option<T extends Record<string, Record<'value' | 'options', any>>> = {
    [K in keyof T]?: JSONFormTs.JSONFormOption<T[K]['value'], Option2Obj<T, 'value'>, T[K]['options'], objAttr2Arr<Option2Obj<T, 'options'>>> | FalsyType;
};
/** 提取内部的值 */
type Option2Obj<T extends Record<string, Record<'value' | 'options', any>>, J extends 'value' | 'options'> = {
    [K in keyof T]: T[K][J];
};
/** 假值类型 */
type FalsyType = number | boolean | string | null | undefined;

/** 定义配置项 */
export function defineOption<T extends Record<string, any>, O extends Partial<Record<keyof T, any>>>(config: AssistOption<T, O>): AssistOption<T, O>;
export function defineOption<T extends Record<string, Record<'value' | 'options', any>>>(config: Assist2Option<T>): Assist2Option<T>;
export function defineOption(config: any) {
    return reactive(config);
}

// /* 使用示例 - start
// ------------------------------------------ */
// defineOption({
//     ab: {
//         t: 'input',
//         // defaultValue: '123,',
//         // placeholder: '',
//         // options: [{ label: '123', value: 123 }],
//         // options: [(new Map())],
//         // options: [{ a: 1 }],
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
// });
// defineOption<{
//     ab: { value: string; options: { label: number; value: number } };
//     cc: { value: number; options: string };
//     bb: { value: string; options: Record<string, string> };
// }>({
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
//     { ab: { label: number; value: number }; cc: string; bb: Record<string, string> },
//     { ab: string; cc: number }
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
// /* 使用示例 - end
// ------------------------------------------ */

// /* 类型推断简化实现
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
