import type { PropType, Ref, WatchOptions } from 'vue-demi';
import { nextTick } from 'vue-demi';
import { noop } from '../../utils/index';
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
        /** 提交的字段 */
        field: { type: String as PropType<string>, required: true },
        /** 字段集(多选时, 每个下标对应的字段可能不一样) */
        fields: { type: [Array] as PropType<T[]> },
        /** 当前条件对象 */
        query: { type: Object as PropType<Query>, required: true },
        /**
         * 该配置项根据 query[field] 的值动态生成时, 传递的属性((内部处理, 外部无需传递))
         * 应用场景, 比如表单通过 query[field].splice(0, 1) 删除时, 由于卸载会重置字段
         * 但是根据引用会找到 query[field][1] 的值, 导致操作错误的对象
         */
        parentQuery: { type: Object as PropType<Query> },
        /** 是否隐藏 -> 如果是函数, 需传递依赖项, 可根据依赖项动态隐藏 */
        hide: { type: [Boolean, Function] as PropType<boolean | ((option: { query: Query }) => boolean)> },
        /** 是否依赖其它字段 */
        depend: { type: Boolean as PropType<boolean>, default: undefined },
        /** 依赖字段发生变化后是否重置值 */
        resetByDependValueChange: { type: [Boolean, Function] as PropType<boolean | ((query: Query) => boolean)>, default: true },
        /** 依赖字段 */
        dependFields: { type: [String, Array] as PropType<string | string[]> },
        /** 依赖字段监听选项 */
        dependWatchOption: { type: [Object] as PropType<WatchOptions> },
        /** 是否依赖其它字段的数据源 - 数据发生变动时触发 getOptions */
        optionsDepend: { type: Boolean as PropType<boolean> },
        /** 数据源依赖字段 - 不传取 dependFields */
        optionsDependFields: { type: [String, Array] as PropType<string | string[]> },
        /** 校验函数, 返回字符串不通过, 会触发提示 - 提交时触发 */
        validator: { type: [Function] as PropType<(query: Query) => any | Promise<any>> },
        /** 初始值 - 初始或重置时设置的值, 优先级高于 defaultValue(重置时取该字段, 依赖变化后的重置默认值), 可被清空 */
        initialValue: {
            type: [String, Number, Boolean, Function, Array, Object] as PropType<((option: { query: Query }) => any) | any>,
            default: undefined,
        },
        /** 默认值 - 初始或重置时设置的值, 当对应字段的值为空值时, 会用该值替换 */
        defaultValue: {
            type: [String, Number, Boolean, Function, Array, Object] as PropType<((option: { query: Query }) => any) | any>,
            default: undefined,
        },
        /** 重置时当前值与默认值/初始值相同时, 自定义赋值逻辑(默认不改变) */
        defaultValueConflictCallback: { type: Function as PropType<(value: any, checked: Ref<any>) => void>, default: noop },
        /** 数据源 */
        options: { type: Array as PropType<Option[]>, default: () => [] },
        /** 动态获取数据源 */
        getOptions: { type: Function as PropType<GetOptions<T, Query, Option, OptionQuery>> },
        /**
         * 如果是组件是存在于数组中的, 需要传递一个唯一值(内部处理, 外部无需传递)
         * 防止依赖本数组其它下标中的值时, 如果前一项被删除, 导致依赖误触发
         */
        uniqueValue: { type: [String, Number] as PropType<string | number> },
        /** 组件额外的钩子() */
        hooks: { type: [Object] as PropType<HookOption<T, Query, Option, OptionQuery>>, default: undefined },
    } as const;
}
/** 扁平条件类 props */
export const plainProps = plainPropsGeneric();
/** 扁平条件类 props */
export type PlainProps<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any> = Record<string, any>> = OmitFieldRequired<ReturnType<typeof plainPropsGeneric<T, Query, Option, OptionQuery>>>;

/** 取消 field 的必填声明(暴露给用户是可选的, 框架层才是必填的, 防止框架层改动过大, 故在此调整) */
export type OmitFieldRequired<T> = {
    [K in keyof T]: K extends 'field' ? Omit<T[K], 'required'> : T[K]
};

/** 当新的赋值与当前值相等时异步赋值 */
export function defaultValueConflictCallback(checked: Ref<any>, value: any) {
    // 可直接置空, 如果是数组, 两者值肯定不等
    // 如果是普通值, undefined 不会报错
    checked.value = undefined;
    nextTick(() => checked.value = value);
}

/** 获取远程数据源 */
export interface GetOptions<T, Query extends Record<string, any>, Option, OptionQuery extends Record<string, any>> {
    (
        /** 数据执行后的回调 */
        cb: (data: Option[]) => void,
        /** 当前 query 对象 */
        query: Query,
        /** 额外的配置项 */
        option: TriggerOption<T, Query, OptionQuery>,
    ): any;
}

/** 改变当前条件值触发方式 */
export interface TriggerOption<T, Query extends Record<string, any>, OptionQuery extends Record<string, any>> {
    /**
     * 触发来源
     * @enum {('initial'|'depend'|'other')} initial(初始化), depend(依赖项改变)
     */
    trigger: string;
    /** 用于下拉框等存在筛选值的组件 */
    filterValue?: string;
    /**
     * 所有条件的数据源
     * @enum {Record<string, Record<string, any>[]>}
     */
    options: OptionQuery;
    /** 仅更改默认值 */
    changeDefaultValue: (value: T) => this;
    /** 仅更改初始值 */
    changeInitialValue: (value: T) => this;
    /**
     * 仅改变内部的值, 不触发搜索事件
     * @param {*} value 需改变的值
     * @param {object} [option]
     * @param {boolean} [option.updateInitialValue] 是否将该值设为初始值
     * @param {boolean} [option.updateDefaultValue] 是否将该值设为默认值
     */
    change: (value: T, option?: Partial<Record<'updateInitialValue' | 'updateDefaultValue', boolean>>) => this;
    /**
     * 触发搜索事件
     * @param {*} value 需改变的值
     * @param {object} [option]
     * @param {boolean} [option.updateInitialValue] 是否将该值设为初始值
     * @param {boolean} [option.updateDefaultValue] 是否将该值设为默认值
     */
    search: (value: T, option?: Partial<Record<'updateInitialValue' | 'updateDefaultValue', boolean>>) => this;
    [index: string]: any;
}
