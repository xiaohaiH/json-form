import type { PropType } from 'vue-demi';
import { commonProps } from '../share';
import type { CommonProps, GetOptions } from '../share';
import type { usePlain } from './index';

/** 组件额外的钩子选项 */
export interface HookOption<T, Query, Option, OptionQuery> {
    /** 组件创建前触发的钩子, 可在内部监听生命周期, 获取实例, 以及操作该组件内的各种属性 */
    created?: (option: { props: Record<string, any>; plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>> }) => void;
    /** 依赖项发生变化时触发 - 语法糖钩子, 可通过 create 钩子监听指定数据源(watch(() => option.props.query[field], callback))  */
    dependChange?: (option: { props: Record<string, any>; plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>> }) => void;
    /** 依赖项数据源发生变动时触发 - 语法糖钩子, 可通过 create 钩子监听指定数据源(watch(() => option.plain.wrapper.options[field], callback)) */
    optionsDependChange?: (option: { props: Record<string, any>; plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>> }) => void;
    /** 回填对象发生改变时触发(由外部触发才会发生改变, 内部搜索然后默认同步时, 不触发该事件) */
    backfillChange?: (backfill: Record<string, any>, oldBackfill: Record<string, any>, option: { props: Record<string, any>; plain: ReturnType<typeof usePlain<T, Query, Option, OptionQuery>> }) => void;
}

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
        /**
         * 组件额外的钩子
         * 包含
         */
        hooks: { type: [Object] as PropType<HookOption<T, Query, Option, OptionQuery>>, default: undefined },
    } as const;
}
/** 扁平条件类 props */
export const plainProps = plainPropsGeneric();
/** 扁平条件类 props */
export type PlainProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any> = Record<string, any>> = ReturnType<typeof plainPropsGeneric<T, Query, Option, OptionQuery>>;
