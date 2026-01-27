import type { PropType } from 'vue-demi';
import type { useWrapper } from './index';

export interface onBackfillChange {
    (backfill: Record<string, any>, oldBackfill: Record<string, any>, expose: ReturnType<typeof useWrapper>): void;
}
export type WrapperArrayable<T> = T | T[];

/** 容器类 props - 泛型 */
export function wrapperPropsGeneric() {
    return {
        /** 是否在数据发生变动后实时触发搜索事件 - 仅针对 backfill, modelValue 不生效 */
        realtime: { type: Boolean as PropType<boolean>, default: undefined },
        /** 回填信息 */
        backfill: { type: Object as PropType<Record<string, any>> },
        /** 回填信息发生变化时触发(由外部触发才会发生改变, 内部搜索然后默认同步时, 不触发该事件) - 仅针对 backfill, modelValue 不生效 */
        onBackfillChange: { type: [Function, Array] as PropType<WrapperArrayable<onBackfillChange>> },
        /** 表单形式的没必要用 backfill, 直接用 modelValue 同步即可 */
        modelValue: { type: Object as PropType<Record<string, any>> },
        /**
         * 是否浅监听 modelValue, 当外部会通过 Object.assign(query.value, { 字段1, 字段2 }) 这种批量赋值时
         * 可启用此属性来规避 depend 重置
         */
        shallowWatchModelValue: { type: Boolean as PropType<boolean>, default: undefined },
        /** 自定义校验函数(内部校验通过后会触发此函数) */
        validator: { type: Function as PropType<(query: Record<string, any>) => any | Promise<any>>, default: undefined },
        /** 校验失败时产生的提示 */
        toast: { type: Function as PropType<(msg: string) => void>, default: undefined },
        /** 表单是否只读(元素没有只读属性的直接禁用) */
        readonly: { type: Boolean as PropType<boolean>, default: undefined },
        /** 表单是否禁用 */
        disabled: { type: Boolean as PropType<boolean>, default: undefined },
        /** 搜索事件, 触发内部 query 对象更新 - 仅针对 backfill, modelValue 不会触发 */
        onSearch: { type: [Function, Array] as PropType<WrapperArrayable<(query: Record<string, any>) => void>> },
        // /** 重置事件, 重置表单数据时触发 - 仅针对 backfill, modelValue 不会触发 */
        // onReset: { type: [Function, Array] as PropType<WrapperArrayable<(query: Record<string, any>) => void>> },
    } as const;
}
/** 容器类 props */
export const wrapperProps = wrapperPropsGeneric();
export type WrapperProps = ReturnType<typeof wrapperPropsGeneric>;
