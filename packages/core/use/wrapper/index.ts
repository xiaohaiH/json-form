import type { ExtractPropTypes } from 'vue-demi';
import {
    computed,
    del,
    getCurrentInstance,
    nextTick,
    onBeforeUnmount,
    onMounted,
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

/** 用来给 v2 版本做兼容 */
interface Config {
    /** modelValue 的字段 */
    modelValueField?: string;
    /** backfill 发生变化后的回调 */
    onBackfillChange?: (backfill: Record<string, any>, oldBackfill: Record<string, any>, expose: ReturnType<typeof useWrapper>) => void;
    /** 搜索回调 */
    onSearch?: (query: Record<string, any>) => void;
}

/** 封装 wrapper 组件必备的信息(config 用来给 v2版本做兼容) */
export function useWrapper(props: WrapperProps, config?: Config) {
    /** 兼容 v2版本的 value */
    const MODEL_VALUE = (config?.modelValueField || 'modelValue') as 'modelValue';

    const child: CommonMethod[] = [];
    onBeforeUnmount(() => child.splice(0));

    /** 记录所有条件项的字段 */
    const allFields = new Set<string>();
    /** 记录所有条件的 options */
    const optionsObj = reactive<Record<string, any>>({});
    /** 提供给子条件组件的方法 */
    const wrapperInstance = defineProvideValue({
        readonly: toRef(props, 'readonly', false),
        disabled: toRef(props, 'disabled', false),
        realtime: toRef(props, 'realtime', false),
        register(compOption) {
            compOption.field && allFields.add(compOption.field);
            child.push(compOption);
            const unregister = () => {
                compOption.field && allFields.delete(compOption.field);
                const idx = child.indexOf(compOption);
                idx !== -1 && child.splice(idx, 1);
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
        beforeUpdateQueryValue() {
            queryWatchFlag = false;
        },
        afterUpdateQueryValue() {
            nextTick(() => {
                queryWatchFlag = true;
            });
        },
        search,
        options: optionsObj,
    });
    provide<ProvideValue>(provideKey, wrapperInstance);

    /**
     * 内部条件的值
     * 传 backfill 时, 在没触发搜索按钮前, 不会同步到外部
     * 传 modelValue 时, query 与 modelValue 是一致的
     * backfill 或 modelValue 必须要传一个
     */
    const query = ref<Record<string, string>>(props[MODEL_VALUE] || { ...props.backfill });
    let queryWatchFlag = true;
    // 在 mounted 内监听, 防止初始设置默认值时触发监听回调
    onMounted(() => {
        watch(
            () => props.realtime && !props[MODEL_VALUE] && ({ ...query.value }),
            (val) => {
                val && queryWatchFlag && wrapperInstance.search();
            },
        );
    });

    const getQuery = () => ({ ...(oldQuery = { ...query.value }) });
    /** 记录旧的 query */
    let oldQuery: Record<string, any> | null = null;
    /** 记录上一次的 backfill, 防止相同 */
    let oldBackfill: Record<string, any> = {};
    watch(
        // 扩大 backfill 的监听层级
        // 以便直属子属性发生变化时也可触发
        // 再深层的无需处理(存在引用关系)
        // 兼容低版本, 所以不用 deep: 1
        () => {
            const { backfill } = props;
            if (!backfill) return [oldBackfill = {} as Record<string, any>, false] as const;
            const backfillEntries = Object.entries(backfill);
            // 记录当前 backfill 与之前的 backfill 是否一致
            // 相同则不处理, 防止 backfill 与 query.value 同时更新(backfill 只改引用而不改值)
            // 如果值为空, 则跳过判断, 防止外部直接赋予空对象来重置时, 多次重置导致失败
            // 导致 query.value 的值被覆盖
            let backfillFlag = !!oldBackfill && Object.keys(oldBackfill).length === backfillEntries.length && !!backfillEntries.length;
            // 判断 backfill 与旧的 query 是否一致
            // 一致说明是重置或者空对象赋值, 内部赋了默认/初始值
            let oldQueryFlag = !!oldQuery && Object.keys(oldQuery).length === backfillEntries.length;
            return [oldBackfill = backfillEntries.reduce((p, [k, v]) => {
                p[k] = v;
                backfillFlag &&= (p[k] === oldBackfill[k]);
                oldQueryFlag &&= (p[k] === oldQuery![k]);
                return p;
            }, {} as Record<string, any>), backfillFlag || oldQueryFlag, oldQuery = null] as const;
        },
        ([val, flag], [oldVal]) => {
            if (flag) return;
            const backfillKeys = Object.keys(val);
            const queryKeys = Object.keys(query.value);
            let isExtractBackfill = queryKeys.length === backfillKeys.length;
            // 手动处理 query 的值与 backfill 保持一致
            // 防止 query.value 对象改变导致内部监听误触发
            queryKeys.forEach((k) => {
                isExtractBackfill &&= query.value[k] === val[k];
                hasOwn(val, k) || delete query.value[k];
            });
            // 如果是空对象, 理解为重置
            if (!backfillKeys.length) return reset();
            // query 与 backfill 重复时, 不触发变动
            // 不能在 watch 第一个参数中比较, 会导致 query 被收集到依赖中
            if (isExtractBackfill) return;
            // #fix 只合并有变化, 且与 query.value[field] 不同的字段, 防止子级 watch 监听时误触发
            // 如果与 query.value 相同, 说明是内部触发的事件
            const newQuery = {} as Record<string, any>;
            let isChanged = false;
            backfillKeys.forEach((k) => {
                if (val[k] !== query.value[k]) {
                    newQuery[k] = val[k];
                    isChanged = true;
                }
            });
            isChanged && Object.assign(query.value, newQuery);
            let isUpdatedDefaultValue = false;
            let tempFlag: boolean;
            child.forEach((o) => {
                o.onBackfillChange?.(val, oldVal, isChanged);
                tempFlag = o.trySetDefaultValue(query.value);
                isUpdatedDefaultValue ||= tempFlag;
            });
            if (isChanged) {
                (props.onBackfillChange || config?.onBackfillChange) && execOnCallback(props.onBackfillChange || config!.onBackfillChange, val, oldVal, expose);
            }
            if (!isUpdatedDefaultValue) {
                wrapperInstance.beforeUpdateQueryValue();
                wrapperInstance.afterUpdateQueryValue();
            }
        },
        // 取消深度监听, 只监听直属属性
        // 因为第二层的值是直接赋值的
        // { deep: true },
    );

    watch(
        () => props[MODEL_VALUE],
        (val, oldVal) => {
            // modelValue 不允许重置为空, 为空说明外部的代码逻辑有问题
            if (!val) return;
            query.value = val;
            // modelValue 为空或是空对象时, 重置整个表单(由于 query.value 异步更新的, 因此得传递新的 query)
            if (!Object.keys(val).length) return reset(query.value);
            child.forEach((o) => {
                o.onModelValueChange?.(val, oldVal);
                o.trySetDefaultValue(query.value);
            });
        },
    );
    // 此 watch 是兼容 Object.assign 赋值整个对象
    // 而非 query.value = { 字段1, 字段2 } 形式赋值
    watch(
        [
            () => props.shallowWatchModelValue && props[MODEL_VALUE] && ({ ...props[MODEL_VALUE] }),
            () => props.shallowWatchModelValue && props[MODEL_VALUE],
        ],
        ([val, mv], [oldVal, oldMv]) => {
            // 如果 val, oldVal 不全为对象, 忽略后续逻辑
            // 如果 modelValue 引用发生变化(上一个 watch 中会处理), 忽略后续逻辑
            if (!(val && oldVal) || mv !== oldMv) return;
            // 统计哪些字段进行了更新, 更新数量超过 1 个, 说明是批量更新, 不触发 depend 相关的逻辑
            let count = 0;
            // 多字段的只算为一个字段
            // 假设两个条件项都是多字段的, 也只算一个字段, 衍生出一种极端情况下才产生的 bug
            // 整个表单只有两个条件项, 且均为多字段, 此时无法触发批量更新的逻辑, 此种情况需自行处理
            let flag = 0;
            Object.keys(val).forEach((k) => {
                val[k] !== oldVal[k] && (allFields.has(k) ? ++count : flag || (flag = ++count));
            });
            // 如果更新数量大于 1, 说明是 assign 赋值, 视同为批量赋值, 此时不应该重置值
            count > 1 && child.forEach((o) => o.onModelValueChange?.(val, oldVal));
        },
    );

    /**
     * 搜索计数(当验证结果出来前再次触发了搜索事件时, 前一次的事件不再处理)
     * 限制: 同一个事件循环内只会触发一次(依赖项发生改变时不再触发多次搜索)
     */
    let searchFlag = 0;
    /** 搜索事件 */
    async function search() {
        const _searchFlag = ++searchFlag;
        const msg = validateToast();
        // 转为异步处理, 确保一个事件循环内只触发一次搜索事件
        const _msg = await (typeof msg?.then === 'function' ? msg : Promise.resolve(msg));
        if (_searchFlag !== searchFlag) return;

        if (_msg) {
            props.toast?.(_msg);
        }
        else {
            (props.onSearch || config?.onSearch) && execOnCallback(props.onSearch || config!.onSearch, getQuery());
        }
    }
    /**
     * 重置所有条件
     * @param {object} [target] 重置后默认值(初始值)所挂载的对象 - 默认取 query
     */
    function reset(target?: Record<string, any>) {
        child.forEach((v) => v.reset(target));
    }
    /** 自定义校验条件的值并弹出提示 */
    function validateToast(): Promise<any> | any {
        let isPromise = false;
        let temp: any;
        let r = child.map((v) => {
            temp = v.validator?.(query.value);
            isPromise || (isPromise = typeof temp?.then === 'function');
            return temp;
        });
        return isPromise ? Promise.all(r).then(validateByArr) : validateByArr(r);
    }
    /** 对校验结果进行处理, 单个检验项通过时, 执行表单级别的验证 */
    function validateByArr(result: any[]): Promise<any> | any {
        return result.find((v) => v && typeof v === 'string') || props.validator?.(query.value);
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
