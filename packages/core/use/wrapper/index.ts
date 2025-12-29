import type { ExtractPropTypes } from 'vue-demi';
import {
    computed,
    del,
    getCurrentInstance,
    nextTick,
    onBeforeUnmount,
    provide,
    reactive,
    ref,
    set,
    toRef,
    watch,
} from 'vue-demi';
import { hasOwn } from '../../utils/index';
import type { CommonMethod, ProvideValue } from '../constant';
import { defineProvideValue, IS_COMPOSITION_VERSION, provideKey } from '../constant';
import type { wrapperProps } from './types';

/** 外部需传递的 props */
type WrapperProps = ExtractPropTypes<typeof wrapperProps>;

/** 封装 wrapper 组件必备的信息(events 用来兼容 v2版本的事件) */
export function useWrapper(props: WrapperProps, listeners?: Record<string, any>) {
    const child: CommonMethod[] = [];
    onBeforeUnmount(() => child.splice(0));
    const emptyValue = computed(() => props.emptyValue?.());

    // backfill 改变时, 逐字段比对赋值
    // 该变量不再需要
    // /**
    //  * #fix 修复初始 backfill 存在值时
    //  * query 未保持一致的问题
    //  * 解决方案:
    //  * query 本身逻辑和作用不变
    //  * 新增一个对象用来缓存更改的值
    //  * 并在获取 query 时, 将该对象作为
    //  * 最后一个合并项
    //  */
    // const changedQueryObj = {} as Record<string, any>;
    /** 是否标记更新的字段, 防止卸载后的空字段占位 */
    let isLogField = false;
    let logFields: string[] = [];
    /** 记录所有条件的 options */
    const optionsObj = reactive<Record<string, any>>({});
    /** 提供给子条件组件的方法 */
    const wrapperInstance = defineProvideValue({
        readonly: toRef(props, 'readonly', false),
        disabled: toRef(props, 'disabled', false),
        realtime: toRef(props, 'realtime', false),
        register(compOption) {
            child.push(compOption);
            const unregister = () => {
                isLogField = true;
                compOption.reset();
                compOption.updateWrapperQuery();
                const idx = child.indexOf(compOption);
                idx !== -1 && child.splice(idx, 1);
                props.searchAtDatumChanged && search();
                // TODO 不确定的一点, 数据源更改后是否需要重置整个数据
                // 如果需要重置, 得更新后第一次搜索事件时传递的搜索值
                isLogField = false;
                logFields.forEach((k) => {
                    del(query.value, k);
                    // delete changedQueryObj[k];
                });
                logFields = [];
            };
            const childInstance = getCurrentInstance();
            // vue2.7 实例挂载在 proxy 上, 内部逻辑取的 proxy 上的值
            // 虽然 @vue/composition-api 实例挂载在 proxy 上
            // 但是内部逻辑取的是整个 getCurrentInstance
            // eslint-disable-next-line ts/ban-ts-comment
            // @ts-ignore vue2.7中取proxy属性
            childInstance && onBeforeUnmount(unregister, IS_COMPOSITION_VERSION ? childInstance.proxy : childInstance);
            return unregister;
        },
        updateQueryValue(field, value, nativeField) {
            props.emptyValues.includes(value) && value !== emptyValue.value && (value = emptyValue.value);
            if (isLogField) logFields.push(field);
            set(query.value, field, value);
            // changedQueryObj[field] = value;
            props.onFieldChange && execOnCallback(props.onFieldChange, { field, value, query: query.value, nativeField });
            listeners?.fieldChange?.({ field, value, query: query.value, nativeField });
        },
        insetSearch(tryFields?: string | string[]) {
            if (!props.realtime) return;
            const { backfill } = props;
            const { value: _query } = query;
            // query.value[tryFields]与props.backfill?.[tryFields]不一致时
            // 说明是 query.value 更新了且未同步到外面
            // 因此需要触发事件
            if (tryFields
                && (typeof tryFields === 'string'
                    ? backfill?.[tryFields] === _query[tryFields]
                    : tryFields.every((k) => backfill?.[k] === _query[k]))) {
                return;
            }
            search();
        },
        search,
        removeUnreferencedField(field: string) {
            let sameFieldCount = 0;
            child.some((v) => {
                hasOwn(v.getQuery(), field) && (sameFieldCount += 1);
                return sameFieldCount;
            });
            if (!sameFieldCount) {
                del(query.value, field);
                // delete changedQueryObj[field];
            }
        },
        options: optionsObj,
    });
    provide<ProvideValue>(provideKey, wrapperInstance);

    /** 内部条件最新的值, 在没触发搜索按钮前, 不会同步到外部 */
    const query = ref<Record<string, string>>({ ...props.backfill });
    // 由于 watch 主动处理了 backfill
    // 所以覆盖就没有存在的必要了
    // const getQuery = () => ({ ...query.value, ...props.backfill, ...changedQueryObj });
    const getQuery = () => ({ ...query.value });
    watch(
        // 扩大 backfill 的监听层级
        // 以便直属子属性发生变化时也可触发
        // 再深层的无需处理(存在引用关系)
        () => {
            const { backfill } = props;
            if (!backfill) return {};
            return Object.entries(backfill).reduce((p, [k, v]) => {
                p[k] = v;
                return p;
            }, {} as Record<string, any>);
        },
        (val, oldVal) => {
            // 手动处理 query 的值与 backfill 保持一致
            // 防止 query.value 对象改变导致内部监听误触发
            Object.keys(query.value).forEach((k) => {
                (val && hasOwn(val, k)) || delete query.value[k];
            });
            // #fix 只合并有变化, 且与 query.value[field] 不同的字段, 防止子级 watch 监听时误触发
            // 如果与 query.value 相同, 说明是内部触发的事件
            const newQuery = {} as Record<string, any>;
            let isChanged = false;
            Object.keys(val).forEach((k) => {
                if (val[k] !== oldVal[k] && val[k] !== query.value[k]) {
                    newQuery[k] = val[k];
                    isChanged = true;
                }
            });
            isChanged && Object.assign(query.value, newQuery);
            child.forEach((o) => o.onChangeByBackfill?.(val, oldVal, isChanged));
            if (isChanged) {
                props.onBackfillChange && execOnCallback(props.onBackfillChange, val, oldVal, expose);
                listeners?.backfillChange?.(val, oldVal, expose);
            }
        },
        // 取消深度监听, 只监听直属属性
        // 因为第二层的值是直接赋值的
        // { deep: true },
    );

    async function search() {
        const msg = await validateToast();
        if (msg) {
            props.toast?.(msg);
        }
        else {
            props.onSearch && execOnCallback(props.onSearch, getQuery());
            listeners?.search?.(getQuery());
        }
    }
    /** 重置所有条件的值 */
    function reset() {
        child.forEach((v) => {
            v.reset();
            v.updateWrapperQuery();
        });
        props.onReset && execOnCallback(props.onReset, getQuery());
        listeners?.reset?.(getQuery());
    }
    /** 自定义校验条件的值并弹出提示 */
    async function validateToast() {
        const r = await Promise.all(child.map((v) => v.validator?.(query.value)));
        return (r.find((v) => v && typeof v === 'string') as string) || props.validator?.(query.value);
    }

    const expose = {
        child,
        wrapperInstance,
        query,
        getQuery,
        search,
        reset,
        validateToast,
    };
    return expose;
}

/**
 * 执行 on 相关的回调事件
 * @param {Function} events 待执行的回调
 * @param {any[]} args 传递的参数
 */
export function execOnCallback<T extends (...args: any[]) => any>(events: undefined | T | T[], ...args: Parameters<T>) {
    if (!events) return;
    return typeof events === 'function' ? events(...args) : events.forEach((cb) => cb(...args));
}
