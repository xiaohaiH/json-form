import { version } from 'vue-demi';
import type { Ref } from 'vue-demi';

/** 判断是否是 2.7.* 版本, 监听生命周期需对该版本做处理 */
export const IS_COMPOSITION_VERSION = version.slice(0, 3) === '2.7';

/** 容器注入的 key */
export const provideKey = 'json-form-wrapper';

/** 容器注入值的类型 */
export interface ProvideValue {
    /** 表单是否只读 */
    readonly?: Ref<boolean | undefined>;
    /** 表单是否禁用 */
    disabled?: Ref<boolean | undefined>;
    /**
     * 是否实时触发
     */
    realtime: Ref<boolean | undefined>;
    /**
     * 子组件需主动注册组件, 否则不会生效
     * @param {CommonMethod} config 提供父组件校验, 重置等方法
     *
     * @returns {() => void} 取消注册 - 默认会自动取消, 如果是异步任务内注册, 需自己手动取消
     */
    register: (config: CommonMethod) => () => void;
    /** 子组件更新 query 前调用函数 */
    beforeUpdateQueryValue: () => void;
    /** 子组件更新 query 后调用函数 */
    afterUpdateQueryValue: () => void;
    /**
     * 提供给组件内部的直接触发到外部的搜索事件
     */
    search: () => Promise<string | void> | string | void;
    /** 所有条件的 options 数据 */
    options: Record<string, any[]>;
}
export function defineProvideValue<T extends ProvideValue>(option: T) {
    return option;
}

/** 子组件需暴露出来的公共属性 */
export interface CommonMethod {
    /** 当前条件项的字段 */
    field?: string;
    /** 重置 */
    reset: (query?: Record<string, any>) => void;
    /** 校验方法 */
    validator?: (query: Record<string, any>) => Promise<any> | any;
    /** 在 watch 中 backfill 改变后, 需要执行回调 */
    onBackfillChange?: (backfill: Record<string, any>, oldBackfill: Record<string, any>, isChange: boolean) => void;
    /** model 引用发生变化后, 需要执行的回调 */
    onModelChange?: (model: Record<string, any>, oldModel: Record<string, any> | undefined) => void;
    /** 尝试设置默认值 */
    trySetDefaultValue: (query: Record<string, any>) => boolean;
}
export function defineCommonMethod<T extends CommonMethod>(option: T): T {
    return option;
}
