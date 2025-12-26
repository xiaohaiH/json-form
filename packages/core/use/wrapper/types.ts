import type { PropType } from 'vue-demi';
import type { useWrapper } from './index';

export interface onBackfillChange {
    (backfill: Record<string, any>, oldBackfill: Record<string, any>, expose: ReturnType<typeof useWrapper>): void;
}
export type WrapperArrayable<T> = T | T[];

/** 容器类 props - 泛型 */
export function wrapperPropsGeneric() {
    return {
        /** 是否在数据发生变动后实时触发搜索事件 */
        realtime: { type: Boolean as PropType<boolean>, default: undefined },
        /** 是否在数据源发生改变后触发一次搜索事件 */
        searchAtDatumChanged: { type: Boolean as PropType<boolean>, default: undefined },
        /** 回填信息 */
        backfill: { type: Object as PropType<Record<string, any>> },
        /** 回填信息发生变化时触发(由外部触发才会发生改变, 内部搜索然后默认同步时, 不触发该事件) */
        onBackfillChange: { type: [Function, Array] as PropType<WrapperArrayable<onBackfillChange>> },
        /** 自定义校验函数(内部校验通过后会触发此函数) */
        validator: { type: Function as PropType<(query: Record<string, any>) => any | Promise<any>>, default: undefined },
        /** 校验失败时产生的提示 */
        toast: { type: Function as PropType<(msg: string) => void>, default: undefined },
        /** 配置空值 */
        emptyValues: { type: Array as PropType<any[]>, default: () => ['', null, undefined] },
        /** 设置空值时返回的值 */
        emptyValue: { type: Function as PropType<() => any>, default: undefined },
        /** 表单是否只读(元素没有只读属性的直接禁用) */
        readonly: { type: Boolean as PropType<boolean>, default: undefined },
        /** 表单是否禁用 */
        disabled: { type: Boolean as PropType<boolean>, default: undefined },
        /** 搜索事件 - 触发内部 query 对象更新 */
        onSearch: { type: [Function, Array] as PropType<WrapperArrayable<(query: Record<string, any>) => void>> },
        /** 重置事件 - 重置表单数据时触发 */
        onReset: { type: [Function, Array] as PropType<WrapperArrayable<(query: Record<string, any>) => void>> },
        /**
         * 字段值发生改变时触发
         * @param {object} option 提供的
         * @param {string} option.field 实际改变的键
         * @param {*} option.value
         * @param {object} option.query
         * @param {string} option.nativeField 原始健(不受 as, fields 等属性影响)
         */
        onFieldChange: { type: [Function, Array] as PropType<WrapperArrayable<(option: { field: string; value: any; query: Record<string, any>; nativeField: string }) => void>> },
    } as const;
}
/** 容器类 props */
export const wrapperProps = wrapperPropsGeneric();
export type WrapperProps = ReturnType<typeof wrapperPropsGeneric>;
