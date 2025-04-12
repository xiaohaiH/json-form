import type { ExtractPublicPropTypes, PropType, WatchOptions } from 'vue-demi';
import type { emptyToValue } from '../utils/index';
import type { CommonMethod } from './constant';

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

/** 条件值可能的类型 */
export type ValueType = number | string | boolean | any[] | Record<string, any>;

/** 改变当前条件值触发方式 */
export interface TriggerOption<T, Query extends Record<string, any>, OptionQuery extends Record<string, any>> {
    /**
     * 触发来源
     * @enum {('initial'|'depend')} initial(初始化), depend(依赖项改变)
     */
    trigger: string;
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
    change: (value: T, option?: Record<'updateInitialValue' | 'updateDefaultValue', boolean>) => this;
    /**
     * 触发搜索事件
     * @param {*} value 需改变的值
     * @param {object} [option]
     * @param {boolean} [option.updateInitialValue] 是否将该值设为初始值
     * @param {boolean} [option.updateDefaultValue] 是否将该值设为默认值
     */
    search: (value: T, option?: Record<'updateInitialValue' | 'updateDefaultValue', boolean>) => this;
}

/** 自定义返回字段 */
export interface GetQuery<T, Query extends Record<string, any>> {
    (value: any | any[], empty2Value: typeof emptyToValue, props: ExtractPublicPropTypes<CommonProps<T, Query>>): Record<string, any>;
}

/** 公共 props - 泛型 */
export function commonPropsGeneric<T, Query extends Record<string, any>>() {
    return {
        /** 提交的字段 */
        field: { type: String as PropType<string>, required: true },
        /** 当前条件对象 */
        query: { type: Object as PropType<Query>, required: true },
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
        /** 空值时提交的值 */
        emptyValue: {
            type: [String, Number, Boolean, null, undefined] as PropType<undefined | null | boolean | string | number>,
            default: undefined,
        },
        /** 校验函数, 返回字符串不通过, 会触发提示 - 提交时触发 */
        validator: {
            type: [Function] as PropType<
                ((query: Query) => any) | ((query: Query) => Promise<any>)
            >,
        },
        /** 自定义返回字段 */
        customGetQuery: { type: Function as PropType<GetQuery<T, Query>> },
        /** 初始值 - 初始或重置时设置的值, 优先级高于 defaultValue, 可被清空 */
        initialValue: {
            type: [String, Number, Boolean, Function, Array, Object] as PropType<T | ((option: { query: Query }) => T)>,
            default: undefined,
        },
        /** 默认值 - 初始或重置时设置的值, 当对应字段的值为空值时, 会用该值替换 */
        defaultValue: {
            type: [String, Number, Boolean, Function, Array, Object] as PropType<T | ((option: { query: Query }) => T)>,
            default: undefined,
        },
    } as const;
}
/** 公共 props */
export const commonProps = commonPropsGeneric();
export type CommonProps<T, Query extends Record<string, any>> = ReturnType<typeof commonPropsGeneric<T, Query>>;
