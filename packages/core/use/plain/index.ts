import type { ExtractPropTypes, PropType, Ref } from 'vue-demi';
import {
    computed,
    inject,
    nextTick,
    onBeforeUnmount,
    onMounted,
    ref,
    set,
    toRaw,
    unref,
    watch,
} from 'vue-demi';
import { get, isArray, isEmptyValue, isNotEmptyValue, noop } from '../../utils/index';
import { useFlag, vueSet } from '../assist';
import type { ProvideValue } from '../constant';
import { defineCommonMethod, provideKey } from '../constant';
import type { HookOption, plainProps, PlainProps } from './types';

/** 外部需传递的 props */
type _PlainProps<T, Query, Option, OptionQuery> = ExtractPropTypes<PlainProps<T, any, Option, any>>;

type ValueType = string | number | boolean | null | undefined | Record<string, any> | any[];

type MaybeRef<T> = T | Ref<T>;

/** 封装扁平组件必备的信息 */
export function usePlain<T, Query, Option = Record<string, any>, OptionQuery = Record<string, any>>(props: MaybeRef<_PlainProps<T, Query, Option, OptionQuery>>) {
    /** 初始 props */
    const initialProps = unref(props);
    /** 字段信息 */
    const fieldInfo = computed(() => {
        const { fields, field } = unref(props);
        const _field = (fields || field) as string | string[];
        const isFieldPath = ((fields && fields[0] as string) || field!).includes('.');
        const getValueFunc = isFieldPath ? get : (target: Record<string, any>, key: string) => target[key];
        const setValueFunc = isFieldPath ? vueSet : (target: Record<string, any>, key: string, value: any) => set(target, key, value);
        // const getValue = isFieldPath ? (target: Record<string, any>, path: string) => fields!.map((k) => getValueFunc(target, k as string)).filter(isNotEmptyValue) : getValueFunc;
        // const setValue = isFieldPath ? (target: Record<string, any>, key: string, value: any, emptyValue: any) => fields!.map((k, i) => setValueFunc(target, k as string, emptyToValue(value[i], emptyValue))) : setValueFunc;
        return {
            /** 最终的字段 */
            field: _field,
            /** 是否是路径集 */
            isFieldPath,
            // /** 获取 query 中该字段的值 */
            // getValue,
            // /** 设置 query 中该字段的值 */
            // setValue,
            /** 获取指定对象中指定字段的值 */
            getValueFunc,
            /** 设置指定对象中指定字段的值 */
            setValueFunc,
        };
    });
    function getValueInObject(query: Record<string, any>) {
        const { fields } = unref(props);
        const { field, getValueFunc } = fieldInfo.value;
        return fields ? fields.map((k) => getValueFunc(query, k as string)).filter(isNotEmptyValue) : getValueFunc(query, field as string);
    }
    function setValueInObject(value: any, query: Record<string, any>) {
        // 去除空值, 后续如要加上, 应加在 wrapper 上
        // 而不是 plain props 中
        const { fields } = unref(props);
        const { field, setValueFunc } = fieldInfo.value;
        fields ? fields.forEach((o, i) => setValueFunc(query, o as string, value?.[i])) : setValueFunc(query, field as string, value);
        // const { fields, emptyValue } = unref(props);
        // const { field, setValueFunc } = fieldInfo.value;
        // fields ? fields.forEach((o, i) => setValueFunc(query, o as string, emptyToValue(value?.[i], emptyValue))) : setValueFunc(query, field as string, emptyToValue(value, emptyValue));
        return true;
    }
    /** 获取 query 中该字段的值 */
    function getValueInQuery() {
        return getValueInObject(unref(props).query);
    }
    /** 设置 query 中该字段的值 */
    function setValueInQuery(value: any) {
        const _value = checked.value;
        // 当结果为空值或者空数组时,
        // 且默认值不为空, 用默认值替代
        let defaultValue;
        // eslint-disable-next-line no-cond-assign
        const result = (isEmptyValue(value) || (isArray(value) && !value.length)) && !isEmptyValue(defaultValue = getAppointProp('defaultValue'))
            ? defaultValue
            : value;
        result === _value ? unref(props).defaultValueConflictCallback(result, checked) : setValueInObject(result, unref(props).query);
        return true;
    }

    const unwatchs: (() => void)[] = [];
    /** 容器注入值 */
    const wrapper = inject<ProvideValue>(provideKey);
    /** 覆盖 props 的值 */
    const coverProps = ref({ } as Record<'initialValue' | 'defaultValue', any>);
    watch(() => unref(props).initialValue, (val) => coverProps.value.initialValue = val, { immediate: true });
    watch(() => unref(props).defaultValue, (val) => coverProps.value.defaultValue = val, { immediate: true });
    /** 获取指定属性 */
    const getAppointProp = (value: keyof typeof coverProps['value']) => {
        const _value = coverProps.value[value];
        const { query } = unref(props);
        return typeof _value === 'function' ? _value({ query }) : _value;
    };
    /** 当前选中值 */
    const checked = computed({ get: getValueInQuery, set: setValueInQuery });
    /** 初始是否存在回填值 */
    const initialBackfillValue = initialProps.fields?.length
        // 防止回填值不存在时产生一个空数组(undefined[])
        ? emptyArr2Undef(getValueInObject(initialProps.query)) as ValueType[]
        : getValueInObject(initialProps.query) as ValueType;
    /** 不存在回填值且存在默认值或初始值时更新父级中的值 */
    // 此处只需要获取初始值, 如果初始值不符合要求, 自动会获取默认值
    (initialBackfillValue === undefined || initialBackfillValue === null) && (initialProps.defaultValue !== undefined || initialProps.initialValue !== undefined) && setValueInQuery(getAppointProp('initialValue'));

    /** 远程获取的数据源 */
    const remoteOption = ref<Option[]>([]) as Ref<Option[]>;
    const loading = ref(false);
    /** 渲染的数据源(远程数据源 > 本地数据源) */
    const finalOption = computed(() => (remoteOption.value.length ? remoteOption.value : unref(props).options));
    unwatchs.push(
        watch(finalOption, (value) => wrapper && (wrapper.options[unref(props).field!] = value), { immediate: true }),
    );
    const insetHide = computed(() => {
        const _props = unref(props);
        return typeof _props.hide === 'boolean' ? _props.hide : _props.hide?.({ query: _props.query }) || false;
    });

    const option = defineCommonMethod({
        get field() {
            return unref(props).field;
        },
        reset(this: void, query?: Record<string, any>) {
            const itValue = getAppointProp('initialValue');
            query
                ? setValueInObject(itValue === undefined ? getAppointProp('defaultValue') : itValue, query)
                : checked.value = itValue;
            updateAllowDependChangeValue();
        },
        get validator() {
            const _props = unref(props);
            return _props.validator;
        },
        onBackfillChange: (backfill, oldBackfill, isChange) => {
            isChange && unref(props).hooks?.backfillChange?.(backfill, oldBackfill, { plain: expose, props: unref(props) });
        },
        onModelChange: (model, oldModel) => {
            // unref(props).hooks?.modelChange?.(model, oldModel, { plain: expose, props: unref(props) });
            updateAllowDependChangeValue();
        },
        trySetDefaultValue(_query: Record<string, any>) {
            let defaultValue: any;
            // eslint-disable-next-line no-cond-assign
            if (isEmptyValue(getValueInObject(_query)) && !isEmptyValue(defaultValue = getAppointProp('defaultValue'))) {
                setValueInObject(defaultValue, _query);
                return true;
            }
            return false;
        },
    });

    wrapper?.register(option);
    onBeforeUnmount(() => {
        unwatchs.forEach((v) => v());
        const { field } = fieldInfo.value;
        const { query, parentQuery } = unref(props);
        typeof field === 'string' ? removeAttr(field, query, parentQuery) : field.forEach((k) => removeAttr(k, query, parentQuery));
    });
    /** 获取指定路径的父级对象, 方便删除属性 */
    function removeAttr(path: string, obj: Record<string, any>, obj2?: Record<string, any>) {
        if (!path.includes('.')) {
            delete obj[path];
            return;
        }
        if (!obj2) return;
        // 如果是动态数组, 整租都被删除时不做处理(通过 get 获取到的值肯定跟 obj2 不一致)
        const pathArr = path.split('.');
        const target = get(obj, pathArr.slice(0, -1).join('.'));
        if (target !== obj2) return;
        delete obj2[pathArr[pathArr.length - 1]];
    }

    /** 是否允许依赖变动时, 重置值(外部通过 search, change 主动改变值时, 内部应取消重置) */
    const { flag: allowDependChangeValue, updateFlag: updateAllowDependChangeValue } = useFlag(true);
    // 初次渲染情况下, 如果 query 给了依赖字段值, 但没给被依赖字段赋值
    // 但被依赖字段却有默认值的情况下, 此时会重置 query 中依赖的字段
    // 此处禁用上述逻辑, 即被依赖字段应用默认值却不触发依赖事件
    // ```ts
    // query = { input: 'aaa' };
    // config = {
    //     input: { depend: true, defaultValue: '666', dependFields: 'select' },
    //     select: { defaultValue: '999' },
    // };
    // 执行 updateAllowDependChangeValue 前, 预期 query = { input: 'aaa', select: '999' }, 实际 query = { input: '666', select: '999' }
    // 执行 updateAllowDependChangeValue 后, 与预期一致
    // ```
    updateAllowDependChangeValue();
    // 这块逻辑的作用是防止在测试代码中初始渲染后立即调用 change 来改变值
    // 但由于执行了 updateAllowDependChangeValue 导致 change 不生效(实际场景中极少出现)
    // 但有个问题是如果前后两个配置项依赖中间的配置项, 会导致下方的逻辑有的生效, 有的不生效
    // 在没有好方法前先全部注释, 测试代码中在渲染完成后先 nextTick 再执行后续的逻辑(可以考虑在注册组件时, 记录已加载的字段
    // 但考虑实际应用中, 这种场景基本不会出现, 暂时先不做)
    // let initialDependFlag = allowDependChangeValue.value;
    // initialDependFlag && nextTick(() => initialDependFlag = true);
    // 存在依赖项
    unwatchs.push(
        watch(
            () => {
                const _props = unref(props);
                if (!_props.depend) return [false] as const;
                const dependFields = _props.dependFields;
                if (!dependFields?.length) return [false] as const;
                const query = _props.query;
                // 只依赖一个值时, 不返回数组, 避免引用不一致(做的优化)
                const field = typeof dependFields === 'string' ? dependFields : dependFields.length === 1 ? dependFields[0] : null;
                return [true, _props.uniqueValue, field ? get(query, field) : (dependFields as string[]).map((k) => get(query, k)), field || dependFields] as const;
            },
            ([_depend, _uniqueValue, _dependValues, _dependFields], oldVal) => {
                const [__depend, __uniqueValue, __dependValues] = oldVal || [];
                if (_uniqueValue !== __uniqueValue) return;
                if (!_depend) return;
                const _props = unref(props);
                // dependFields 由于是字符串, 可以做拼接
                // 但如果是遍历 dependFields 的会返回一个新数组
                // 导致引用发生变化, 所以需要做值比较
                // 判断新的 value 与旧 value 是否一致, 一致则不更新
                if (typeof _dependFields === 'string' ? _dependValues === __dependValues : (_dependValues as any[]).every((o, i) => o === (__dependValues as any[])[i])) return;
                if (allowDependChangeValue.value && (typeof _props.resetByDependValueChange === 'boolean' ? _props.resetByDependValueChange : _props.resetByDependValueChange(_props.query))) {
                    change(undefined);
                }

                // 异步触发回调, 某些场景得先清空值, 再清空数据源
                // 否则会导致数据源来回切换时, 其选中状态未被消除
                nextTick(getOption.bind(null, 'depend'));
                _props.hooks?.dependChange?.({ plain: expose, props: _props });
                // 如果初始不允许依赖发生改变, 却主动改变了值, 那此时依赖应该生效
                // 实际场景一般不会出现, 主要是应对测试代码
                // if (!initialDependFlag) {
                //     allowDependChangeValue.value = initialDependFlag = true;
                // }
            },
            // 禁用 flush 之类新增的属性, 兼容低版本
            initialProps.dependWatchOption,
        ),
    );
    // 存在选项变动依赖项时
    unwatchs.push(
        watch(
            () => {
                const _props = unref(props);
                if (!(_props.optionsDepend && wrapper)) return [false, _props.uniqueValue] as const;
                let _dependFields = _props.optionsDependFields || _props.dependFields;
                typeof _dependFields === 'object' && _dependFields.length === 1 && (_dependFields = _dependFields[0]);
                if (!_dependFields?.length) return [false, _props.uniqueValue] as const;
                return [true, _props.uniqueValue, typeof _dependFields === 'string' ? wrapper.options[_dependFields] : _dependFields.map((k) => wrapper.options[k]), _dependFields] as const;
            },
            ([_depend, _uniqueValue, _val, _dependFields], [__depend, __uniqueValue, __val]) => {
                if (_uniqueValue !== __uniqueValue) return;
                if (!_depend) return;
                // 依赖为单个值时, 直接比较值是否一致
                if (typeof _dependFields === 'string' && _val !== __val) return;
                // 依赖为多个值时, 遍历比较值是否一致
                else if (_val.length === __val?.length && _val.every((o, i) => o === __val[i])) return;
                // 异步触发回调, 某些场景得先清空值, 再清空数据源
                // 否则会导致数据源来回切换时, 其选中状态未被消除
                nextTick(getOption.bind(null, 'depend'));
                initialProps.hooks?.optionsDependChange?.({ plain: expose, props: unref(props) });
            },
            // 不需要 immediate, 因为 getOption 初始会执行一次
        ),
    );

    // 监听 getOptions 选项
    unwatchs.push(watch(() => unref(props).getOptions, async () => getOption('initial')));
    // 由于存在默认值等属性, 所以需要异步触发
    nextTick(getOption.bind(null, 'initial'));

    /** 获取数据源发生变化事件 */
    async function getOption(trigger: 'initial' | 'depend' | 'other', option?: { filterValue?: string; callback?: (data: any[]) => void }) {
        const _props = unref(props);
        if (!_props.getOptions) return;
        loading.value = true;
        const maybePromise = _props.getOptions(
            (data) => {
                option?.callback?.(data);
                remoteOption.value = (data) || [];
                loading.value = false;
            },
            _props.query || {},
            {
                trigger,
                ...option,
                options: toRaw(wrapper?.options) || {},
                changeInitialValue(value) {
                    coverProps.value.initialValue = value;
                    return this;
                },
                changeDefaultValue(value) {
                    coverProps.value.defaultValue = value;
                    return this;
                },
                change(value, option) {
                    option?.updateDefaultValue && (coverProps.value.defaultValue = value);
                    option?.updateInitialValue && (coverProps.value.initialValue = value);
                    updateAllowDependChangeValue();
                    change(value);
                    return this;
                },
                search(value, option) {
                    option?.updateDefaultValue && (coverProps.value.defaultValue = value);
                    option?.updateInitialValue && (coverProps.value.initialValue = value);
                    updateAllowDependChangeValue();
                    change(value);
                    !wrapper?.realtime.value && wrapper?.search();
                    return this;
                },
            },
        );
        if (maybePromise) {
            await maybePromise;
            loading.value = false;
        }
    }
    /**
     * 更新选中值并触发内部搜索事件
     * @param {*} value 待更改的值
     */
    function change(value: any) {
        checked.value = value;
    }

    const expose = {
        /** 覆盖 props 的最新的值(defaultValue, initialValue) */
        coverProps,
        /**
         * 内部表单实例, 包含了更新表单值, 触发搜索事件等方法
         */
        wrapper,
        /**
         * 表单项实例, 包含了重置, 更新表单值, 获取表单值等方法
         */
        option,
        /** 数据源获取状态 */
        loading,
        /** 主动更新数据源 */
        getOptions: getOption,
        /** 当前表单项的值 */
        checked,
        /** 远程获取的数据源 */
        remoteOption,
        /** 获取最终渲染的数据源 */
        finalOption,
        /** 是否隐藏 */
        insetHide,
        /** 更新值并触发搜索事件(为实时搜索时, 会触发搜索事件) */
        change,
        /** 搜索事件(直接触发搜索事件, 不受实时搜索影响) */
        search: wrapper?.search || noop,
        /** 重置表单字段 */
        reset: option.reset,
        /** 表单级别的只读 */
        globalReadonly: wrapper?.readonly || ref(false),
        /** 表单级别的禁用 */
        globalDisabled: wrapper?.disabled || ref(false),
    };

    initialProps.hooks?.created?.({ plain: expose, props: unref(props) });

    return expose;
}

function emptyArr2Undef<T>(arr: T[]): T[] | undefined {
    return arr.length ? arr : undefined;
}

type Primitive = string | number | boolean | bigint | symbol | undefined | null;
// eslint-disable-next-line ts/no-unsafe-function-type
type Builtin = Primitive | Function | Date | Error | RegExp;
type DeepReadonly<T> = T extends Builtin ? T : T extends Map<infer K, infer V> ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>> : T extends ReadonlyMap<infer K, infer V> ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>> : T extends WeakMap<infer K, infer V> ? WeakMap<DeepReadonly<K>, DeepReadonly<V>> : T extends Set<infer U> ? ReadonlySet<DeepReadonly<U>> : T extends ReadonlySet<infer U> ? ReadonlySet<DeepReadonly<U>> : T extends WeakSet<infer U> ? WeakSet<DeepReadonly<U>> : T extends Promise<infer U> ? Promise<DeepReadonly<U>> : T extends Ref<infer U> ? Readonly<Ref<DeepReadonly<U>>> : T extends {} ? {
    readonly [K in keyof T]: DeepReadonly<T[K]>;
} : Readonly<T>;
