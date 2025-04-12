import type { ExtractPropTypes, MaybeRef } from 'vue-demi';
import {
    computed,
    inject,
    nextTick,
    onBeforeUnmount,
    ref,
    toRaw,
    unref,
    watch,
} from 'vue-demi';
import { clone, emptyToValue, get, getChained, isEmptyValue, isEqualExcludeEmptyValue } from '../../utils/index';
import { useDisableInCurrentCycle, useValue } from '../assist';
import type { ProvideValue } from '../constant';
import { defineCommonMethod, provideKey } from '../constant';
import type { plainProps } from './types';

/** 外部需传递的 props */
type PlainProps<T, Query, Option, OptionQuery> = ExtractPropTypes<typeof plainProps>;

type ValueType = string | number | boolean | null | undefined | Record<string, any>;

/** 封装扁平组件必备的信息 */
export function usePlain<T, Query, Option, OptionQuery>(props: MaybeRef<PlainProps<T, Query, Option, OptionQuery>>) {
    /** 初始 props */
    const initialProps = unref(props);

    const unwatchs: (() => void)[] = [];
    /** 容器注入值 */
    const wrapper = inject<ProvideValue>(provideKey);
    /** 初始值 - 初始或重置时设置的值, 优先级高于 defaultValue, 可被清空 */
    const insetInitialValue = useValue(() => {
        const _props = unref(props);
        return { value: _props.initialValue, query: _props.query };
    });
    /** 默认值 - 初始或重置时设置的值, 当对应字段的值为空值时, 会用该值替换 */
    const insetDefaultValue = useValue(() => {
        const _props = unref(props);
        return { value: _props.defaultValue, query: _props.query };
    });
    const getResetValue = (defValue?: any) => !isEmptyValue(insetInitialValue.value)
        ? clone(insetInitialValue.value)
        : !isEmptyValue(insetDefaultValue.value) ? clone(insetDefaultValue.value) : defValue;
    /** 初始是否存在回填值 */
    const initialBackfillValue = initialProps.fields?.length
        // 防止回填值不存在时产生一个空数组(undefined[])
        ? (initialProps.fields as string[]).map((key) => initialProps.query[key]).filter(Boolean) as ValueType[]
        : initialProps.query[initialProps.field] as ValueType;
    /** 当前选中值 */
    const checked = ref<ValueType | ValueType[]>(initialBackfillValue !== undefined ? initialBackfillValue : getResetValue());
    /** 远程获取的数据源 */
    const remoteOption = ref<Option[]>([]);
    /** 渲染的数据源(远程数据源 > 本地数据源) */
    const finalOption = computed(() => (remoteOption.value.length ? remoteOption.value : unref(props).options));
    unwatchs.push(
        watch(finalOption, (value) => wrapper && (wrapper.options[unref(props).field] = value), { immediate: true }),
    );
    const getQuery = () => {
        const _props = unref(props);
        if (_props.customGetQuery) return _props.customGetQuery(checked.value, emptyToValue, _props);
        const _checked = clone(checked.value);
        return _props.fields
            ? (_props.fields as string[]).reduce(
                    // eslint-disable-next-line no-sequences
                    (p, k, i) => ((p[k] = emptyToValue((_checked as ValueType[])?.[i], _props.emptyValue)), p),
                    {} as Record<string, any>,
                )
            : { [_props.field]: emptyToValue(_checked, _props.emptyValue) };
    };
    const insetHide = computed(() => {
        const _props = unref(props);
        return typeof _props.hide === 'boolean' ? _props.hide : _props.hide?.({ query: _props.query }) || false;
    });

    const option = defineCommonMethod({
        reset(this: void) {
            const _props = unref(props);
            checked.value = getResetValue(_props.emptyValue);
        },
        updateWrapperQuery(this: void) {
            const _props = unref(props);
            wrapper && Object.entries(getQuery()).forEach(([k, v]) => wrapper.updateQueryValue(k, v, _props.field));
        },
        get validator() {
            const _props = unref(props);
            return _props.validator;
        },
        getQuery,
        onChangeByBackfill: () => isSyncedQueryValue = false,
    });

    wrapper?.register(option);
    /** 不存在回填值且存在默认值或初始值时更新父级中的值 */
    if (initialBackfillValue === undefined && (initialProps.defaultValue !== undefined || initialProps.initialValue !== undefined)) {
        option.updateWrapperQuery();
    }

    onBeforeUnmount(() => unwatchs.forEach((v) => v()));

    // 提交字段发生改变时, 删除原有字段并更新最新值
    unwatchs.push(
        watch(
            () => unref(props).field,
            (val, oldVal) => {
                val !== oldVal && wrapper?.removeUnreferencedField(oldVal);
                option.updateWrapperQuery();
            },
        ),
    );
    /**
     * checked.value 是否同步了 query 的值
     * 在 wrapper.backfill 中批量更新值时, 禁止依赖做处理
     */
    let isSyncedQueryValue = false;
    // 实时值发生变化时触发更新 - 共享同一个字段
    unwatchs.push(
        watch(
            [
                () => (unref(props).fields as string[]) || unref(props).field,
                () => {
                    const _props = unref(props);
                    return _props.fields ? (_props.fields as string[]).map((k) => _props.query[k]).filter(Boolean) : _props.query[_props.field];
                },
            ],
            ([_field, val], [__field]) => {
                const _props = unref(props);
                const _val = _props.backfillToValue(val, _field, _props.query);
                if (
                    checked.value === _val
                    || _field.toString() !== __field.toString()
                    || isEqualExcludeEmptyValue(_val, checked.value)
                ) {
                    return;
                }
                // 实时值改变先判断值是否为空
                // 为空且存在初始值, 用初始值替代, 且通知上层组件
                // 否则直接更新值即可
                if (checked.value !== _val) {
                    isSyncedQueryValue = true;
                    isEmptyValue(_val) && !isEmptyValue(insetDefaultValue.value)
                        ? change(_val as T)
                        : (checked.value = _val);
                }
            },
            { flush: 'sync' },
        ),
    );

    /** 是否允许依赖变动时, 重置值(外部通过 search, change 主动改变值时, 内部应取消重置) */
    const { flag: allowDependChangeValue, updateFlag: updateAllowDependChangeValue } = useDisableInCurrentCycle(true);
    // 存在依赖项
    unwatchs.push(
        watch(
            [
                () => unref(props).depend,
                () => unref(props).dependFields,
                () => {
                    const _props = unref(props);
                    return _props.dependFields && ([] as string[]).concat(_props.dependFields).map((k) => get(_props.query, k));
                },
            ],
            ([_depend, _dependFields], [__depend, __dependFields]) => {
                // 是否启用依赖, 相同时启用才走后续逻辑, 不同时直接走后续逻辑
                if (_depend === __depend && !_depend) return;
                const _props = unref(props);
                getOption('depend');
                // 类空值时, 不触发 change 事件
                // 防止表单类监测值发生改变时触发校验
                // 或内部不允许重置时直接返回
                const isNeedReset = typeof _props.resetByDependValueChange === 'boolean' ? _props.resetByDependValueChange : _props.resetByDependValueChange(_props.query);
                if (isSyncedQueryValue || !isNeedReset || isEmptyValue(checked.value) || !allowDependChangeValue.value) return;
                change(clone(insetDefaultValue.value));
                // change(isEmptyValue(initialValue.value) ? (_props.multiple ? [] : '') : clone(initialValue.value));
            },
            { flush: 'sync', ...unref(props).dependWatchOption },
        ),
    );

    // 存在选项变动依赖项时
    unwatchs.push(
        watch(
            [
                () => unref(props).optionsDepend,
                () =>
                    wrapper
                    && (unref(props).optionsDependFields || unref(props).dependFields)
                    && ([] as string[])
                        .concat(unref(props).optionsDependFields || unref(props).dependFields!)
                        .map((k) => wrapper.options[k]),
            ],
            ([_depend], [__depend]) => {
                // 是否启用依赖, 相同时启用才走后续逻辑, 不同时直接走后续逻辑
                if (_depend === __depend && !_depend) return;
                getOption('depend');
            },
            // 不需要 immediate, 因为 getOption 初始会执行一次
        ),
    );

    // 监听 getOptions 选项
    unwatchs.push(watch(() => unref(props).getOptions, getOption.bind(null, 'initial')));
    nextTick(getOption.bind(null, 'initial'));

    /** 获取数据源发生变化事件 */
    function getOption(trigger: 'initial' | 'depend') {
        const _props = unref(props);
        _props.getOptions?.(
            (data) => {
                const _checked = checked.value;
                // 重置 checked, 防止增加 option 后, select 值没更新的问题
                checked.value = undefined as any;
                remoteOption.value = (data as Option[]) || [];
                checked.value = _checked;
            },
            _props.query || {},
            {
                trigger,
                options: toRaw(wrapper?.options) || {},
                changeInitialValue(value) {
                    insetInitialValue.value = value;
                    return this;
                },
                changeDefaultValue(value) {
                    insetDefaultValue.value = value;
                    return this;
                },
                change(value, option) {
                    option?.updateDefaultValue && (insetDefaultValue.value = value);
                    option?.updateInitialValue && (insetInitialValue.value = value);
                    updateAllowDependChangeValue();
                    change(value as T);
                    return this;
                },
                search(value, option) {
                    option?.updateDefaultValue && (insetDefaultValue.value = value);
                    option?.updateInitialValue && (insetInitialValue.value = value);
                    updateAllowDependChangeValue();
                    updateCheckedValue(value as T);
                    wrapper?.search();
                    return this;
                },
            },
        );
    }
    /**
     * 更新选中值(父级也同步更改)
     * @param {*} value 待更改的值
     */
    function updateCheckedValue(value: T) {
        // updateWrapperQuery 必须要执行, 防止在 custom-render 中改变了
        // checked.value 深层次内的值, 由于引用相同导致父级未更新的情况
        if (value !== checked.value) {
            // 为空时, 存在初始值时, 用初始值替代
            checked.value = isEmptyValue(value) && !isEmptyValue(insetDefaultValue.value)
                ? clone(insetDefaultValue.value)
                : value;
        }
        option.updateWrapperQuery();
    }
    /**
     * 更新选中值并触发内部搜索事件
     * @param {*} value 待更改的值
     */
    function change(value: T) {
        updateCheckedValue(value);
        wrapper?.insetSearch();
    }

    return {
        wrapper,
        option,
        checked,
        getQuery,
        finalOption,
        insetHide,
        updateCheckedValue,
        change,
        reset: option.reset,
    };
}
