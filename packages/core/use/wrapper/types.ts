import type { PropType } from 'vue-demi';

/** 容器类 props - 泛型 */
export function wrapperPropsGeneric() {
    return {
        /** 是否在数据发生变动后实时触发搜索事件 */
        realtime: { type: Boolean as PropType<boolean>, default: undefined },
        /** 是否在数据源发生改变后触发一次搜索事件 */
        searchAtDatumChanged: { type: Boolean as PropType<boolean>, default: undefined },
        /** 回填信息 */
        backfill: { type: Object as PropType<Record<string, any>> },
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
    } as const;
}
/** 容器类 props */
export const wrapperProps = wrapperPropsGeneric();
export type WrapperProps = ReturnType<typeof wrapperPropsGeneric>;
