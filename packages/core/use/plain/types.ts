import type { PropType } from 'vue-demi';
import { commonProps } from '../share';
import type { CommonProps, GetOptions } from '../share';

/** 扁平条件类 props - 泛型 */
export function plainPropsGeneric<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any> = Record<string, any>>() {
    return {
        ...commonProps as CommonProps<T, Query>,
        /** 字段集(多选时, 每个下标对应的字段可能不一样) */
        fields: { type: [Array] as PropType<T[]> },
        /** 多字段时转换成选中值 */
        backfillToValue: {
            type: Function as PropType<
                (values: string | string[], fields: string | string[], query?: Record<string, any>) => string | string[]
            >,
            default: (v: any) => v,
        },
        /** 数据源 */
        options: { type: Array as PropType<Option[]>, default: () => [] },
        /** 动态获取数据源 */
        getOptions: { type: Function as PropType<GetOptions<T, Query, Option, OptionQuery>> },
    } as const;
}
/** 扁平条件类 props */
export const plainProps = plainPropsGeneric();
export type PlainProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any> = Record<string, any>> = ReturnType<typeof plainPropsGeneric<T, Query, Option, OptionQuery>>;
