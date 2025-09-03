// #region common
import type { ComputedRef, Ref } from 'vue';
// #endregion common

// #region customRenderSlotOption
export interface CustomRenderSlotOption {
    /**
     * 获取传递给 FormItem props
     * 可参考 https://element-plus.org/zh-CN/component/form.html#formitem-api
     */
    getFormItemProps: () => Record<string, any>;
    /** 获取传递给当前组件 props */
    getProps: () => Record<string, any>;
    /** 封装给组件的通用选项 */
    plain: PlainReturnValue;
}
// #endregion customRenderSlotOption

// #region slotProps
export interface SlotProps {
    /**
     * 获取传递给 FormItem props
     * 可参考 https://element-plus.org/zh-CN/component/form.html#formitem-api
     */
    getFormItemProps: () => Record<string, any>;
    /** 获取传递给当前 ElementPlus 组件 props */
    getItemProps: () => Record<string, any>;
    /** 获取传递给当前组件 props */
    getProps: () => Record<string, any>;
    /** 额外的参数(纯纯的语法糖配置) */
    extraOptions: {
        /** 传递给组件的值 */
        modelValue: any;
        /** 数据源 */
        options: any;
        /** 更新值 */
        onChange: (value: any) => void;
    };
    /** 封装给组件的通用选项 */
    plain: PlainReturnValue;
}
// #endregion slotProps

// #region plain
/** usePlain 的返回值 */
export interface PlainReturnValue {
    /** 覆盖 props 的最新的值(defaultValue, initialValue) */
    coverProps: Record<'defaultValue' | 'initialValue', any>;
    /** HForm 暴露给组件的选项 */
    wrapper: WrapperProvideValue;
    /** 在特定时机中 HForm 会调用该选项下的方法 */
    option: CommonMethod;
    /** 数据加载状态 */
    loading: Ref<boolean>;
    /** 可主动获取远程数据 */
    getOptions: (trigger: 'initial' | 'depend' | 'other', option?: {
        /** 筛选值 */
        filterValue?: string;
    }) => Promise<void>;
    /** 当前组件的值 */
    checked: Ref<any>;
    /** 获取当前组件提交给后端的值 */
    getQuery: () => Record<string, any>;
    /** 远程数据(getOptions 返回的数据) */
    remoteOption: Ref<Record<string, any>[]>;
    /** 优先返回 remoteOption, 其次返回外部传递的 options */
    finalOption: ComputedRef<Record<string, any>[]>;
    /** 是否隐藏组件 */
    insetHide: ComputedRef<boolean>;
    /** 更新值但不触发外部的搜索事件 */
    updateCheckedValue: (value: any) => void;
    /**
     * 更新值并根据 HForm realtime 状态判断
     * - realtime: true 则触发搜索事件
     * - realtime: false 则仅更新值(等同于 updateCheckedValue 函数)
     */
    change: (value: any) => void;
    /** 等同于 updateCheckedValue, 只是可以选择不传值(用来兼容低版本) */
    trigger: (value?: any) => void;
    /** 触发搜索事件 */
    search: () => void;
    /** 重置 */
    reset: () => void;
    /** 传递给 HForm 的 readonly 属性 */
    globalReadonly: Ref<boolean>;
    /** 传递给 HForm 的 disabled 属性 */
    globalDisabled: Ref<boolean>;
}

/** 组件提供给 HForm 的选项 */
export interface CommonMethod {
    /** 重置 */
    reset: () => void;
    /** 更新 HForm 中 query 的值 */
    updateWrapperQuery: () => void;
    /** 校验方法 */
    validator?: (query: Record<string, string>) => Promise<any> | any;
    /** 获取该组件拼接的参数 */
    getQuery: () => Record<string, any>;
    /** 在 watch 中 backfill 改变后, 需要执行回调 */
    onChangeByBackfill?: () => void;
}

/** HForm 暴露给组件的选项 */
export interface WrapperProvideValue {
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
    /**
     * 子组件通知父级更新 query 中的值 - 静默修改, 不触发搜索事件
     * @param {string} field 更新的字段
     * @param {*} value 更新的值
     * @param {string} nativeField 原始提供的字段(不受 as, fields 等属性的影响)
     */
    updateQueryValue: (field: string, value: any, nativeField: string) => void;
    /**
     * 子组件内部值发生了变动, 由父级决定是否触发搜索事件(实时搜索时需要区分这两种方式)
     * @param {string | string[]} [tryFields] 比较 query[tryFields] 与 backfill[tryFields]是否一致, 不一致时才触发搜索
     */
    insetSearch: (tryFields?: string | string[]) => void;
    /**
     * 提供给组件内部的直接触发到外部的搜索事件
     */
    search: () => Promise<string | void>;
    /** 删除内部无引用的字段 */
    removeUnreferencedField: (field: string) => void;
    /** 所有条件的 options 数据 */
    options: Record<string, any[]>;
}
// #endregion plain

// #region wrapper
export interface SlotProps {
    /** 获取传递给当前组件 props */
    getProps: () => Record<string, any>;
    /** 封装给 HForm 的通用选项 */
    wrapper: WrapperReturnValue;
}

/** useWrapper 的返回值 */
export interface WrapperReturnValue {
    /** 所有表单项集合 */
    child: CommonMethod[];
    /** 暴露给 usePlain 的信息 */
    wrapperInstance: ProvideValue;
    /** 表单的值集合, 类似 ElForm 的 model */
    query: Record<string, any>;
    /** 获取 query 的值 */
    getQuery: () => Record<string, any>;
    /** 触发搜索事件 */
    search: () => void;
    /** 重置所有条件的值 */
    reset: () => void;
    /** 自定义校验条件的值并弹出提示 */
    validateToast: () => void;
};

/** 组件提供给 HForm 的选项 */
export interface CommonMethod {
    /** 重置 */
    reset: () => void;
    /** 更新 HForm 中 query 的值 */
    updateWrapperQuery: () => void;
    /** 校验方法 */
    validator?: (query: Record<string, string>) => Promise<any> | any;
    /** 获取该组件拼接的参数 */
    getQuery: () => Record<string, any>;
    /** 在 watch 中 backfill 改变后, 需要执行回调 */
    onChangeByBackfill?: () => void;
}

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
    /**
     * 子组件通知父级更新 query 中的值 - 静默修改, 不触发搜索事件
     * @param {string} field 更新的字段
     * @param {*} value 更新的值
     * @param {string} nativeField 原始提供的字段(不受 as, fields 等属性的影响)
     */
    updateQueryValue: (field: string, value: any, nativeField: string) => void;
    /**
     * 子组件内部值发生了变动, 由父级决定是否触发搜索事件(实时搜索时需要区分这两种方式)
     * @param {string | string[]} [tryFields] 比较 query[tryFields] 与 backfill[tryFields]是否一致, 不一致时才触发搜索
     */
    insetSearch: (tryFields?: string | string[]) => void;
    /**
     * 提供给组件内部的直接触发到外部的搜索事件
     */
    search: () => Promise<string | void>;
    /** 删除内部无引用的字段 */
    removeUnreferencedField: (field: string) => void;
    /** 所有条件的 options 数据 */
    options: Record<string, any[]>;
}
// #endregion wrapper
