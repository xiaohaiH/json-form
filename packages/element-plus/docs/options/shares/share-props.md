# 共享 props

所有组件都可定义的 `props`

## field

- 类型: `string`
- 默认: `-`

当前选项提交给后端的字段(由于是对象形式配置的, 因此自动取对象的键, 不需要传递)

## fields

- 类型: `string[]`
- 默认: `-`

当前选项提交给后端的字段,优先级比 `field` 高,根据数组成员来匹配字段
::: details 点我查看示例

```tsx
// 比如日期区间, 后端需要两个字段
// 按如下配置后, 提交时的 query 为 { beginDate: '2023-09-13', endDate: '2025-09-13' }
// 注意: 此时日期不能为必填项
defineOption({
    date: {
        t: 'date-picker',
        type: 'daterange',
        fields: ['beginDate', 'endDate'],
        defaultValue: ['2023-09-13', '2025-09-13'],
    },
});
```

:::

## options

- 类型: `any[]`
- 默认: `-`

给类似下拉框的组件传递的数据源, 如果是远程数据, 该选项不需要定义

## getOptions

- 类型: `(callback, query, option) => void`
- 默认: `-`

获取远程数据源提供给类似下拉框的组件

::: warning tips
如果传递的 `getOptions` 不是异步函数, `callback` 函数则必须执行, 否则 `loading` 不会变为 `false`,
`loading` 逻辑请看下方的示例
:::

::: details 点我查看 `getOptions` 的类型定义和示例(包含远程搜索)以及 `loading` 的逻辑

```tsx
// loading 执行逻辑
// 调用 getOption 前, 先置为 true
// 如果 getOption 是异步函数, 等待异步函数执行完成后, 置为 false
// 非异步函数则等 callback 函数执行后, 置为 false

// 示例1: 远程搜索
defineOption({
    operateType: {
        t: 'select',
        label: '操作类型',
        remote: true,
        async getOption(callback, query, { filterValue }) {
        // 如果不存在搜索值, 直接返回
            if (!filterValue) return callback([]);
            // 获取远程数据
            const res = await getRemoteOptions({ filterValue });
            // 将远程数据传递进行
            callback(res.status ? res.data : []);
        },
    },
});
// 示例2: 获取数据源后, 更新当前值并设置默认值
defineOption({
    operateType: {
        t: 'select',
        label: '操作类型',
        async getOption(callback, query, { search }) {
        // 获取远程数据
            const res = await getRemoteOptions();
            // 将远程数据传递进行
            callback(res.status ? res.data : []);
            // 默认选中第 0 条数据, 并设置为默认值(无法被删除)
            search(res.data[0].value, { updateDefaultValue: true });
        },
    },
});

/**
 * getOptions 的类型定义
 * @param {Function} callback 执行 callback 将数据传到内部
 * @param {Record<string, any>} query 为当前字段集合
 * @param {Record<string, any>} option 额外的配置项
 */
type getOptions = (
    callback: (options: any[]) => void,
    query: Record<string, any>,
    option: Option
) => any | Promise<any>;

/** 额外的配置项 */
interface Option {
    /** 用于下拉框等存在筛选值的组件 */
    filterValue?: string;
    /**
     * 触发来源
     * @enum {('initial'|'depend'|'other')} initial(初始化), depend(依赖项改变), other(其它, 比如主动执行或者远程搜索等)
     */
    trigger: string;
    /**
     * 所有条件的数据源
     * @enum {Record<string, Record<string, any>[]>}
     */
    options: Record<string, any[]>;
    /** 获取数据源后更改该选项的默认值 */
    changeDefaultValue: (value: any) => this;
    /** 获取数据源后更改该选项的初始值 */
    changeInitialValue: (value: any) => this;
    /**
     * 仅改变内部的值, 不触发搜索事件(如果是实时搜索, 则会触发搜索事件)
     * @param {*} value 需改变的值
     * @param {object} [option]
     * @param {boolean} [option.updateInitialValue] 是否将该值设为初始值
     * @param {boolean} [option.updateDefaultValue] 是否将该值设为默认值
     */
    change: (value: any, option?: Partial<Record<'updateInitialValue' | 'updateDefaultValue', boolean>>) => this;
    /**
     * 改变内部的值, 并触发搜索事件
     * @param {*} value 需改变的值
     * @param {object} [option]
     * @param {boolean} [option.updateInitialValue] 是否将该值设为初始值
     * @param {boolean} [option.updateDefaultValue] 是否将该值设为默认值
     */
    search: (value: T, option?: Partial<Record<'updateInitialValue' | 'updateDefaultValue', boolean>>) => this;
}
```

:::

## initialValue

- 类型: `string` | `number` | `boolean` | `any[]` | `Record<string, any>` | `() => any`
- 默认: `-`

初始或重置时设置的值, 优先级高于 `defaultValue`, 可以被清空

## defaultValue

- 类型: `string` | `number` | `boolean` | `any[]` | `Record<string, any>` | `() => any`
- 默认: `-`

默认值, 当对应字段的值为空值时, 会用该值替换

## hide

- 类型: `boolean` | `(option: { query: Record<string, any> }) => boolean`
- 默认: `false`

隐藏组件

## depend

- 类型: `boolean`
- 默认: `false`

是否依赖其它字段, 其它字段发生变化时默认会重置本身的值

## dependFields

- 类型: `string` | `string[]`
- 默认: `-`

depend 为真时, 依赖的字段

## resetByDependValueChange

- 类型: `boolean` | `(query: Record<string, any>) => boolean`
- 默认: `true`

depend 为真时, 依赖字段发生变化后是否重置本身的值

## dependWatchOption

- 类型: `Record<string, any>`
- 默认: `-`

依赖字段监听的配置项(`vue` 的 `WatchOptions`)

## optionsDepend

- 类型: `boolean`
- 默认: `-`

是否依赖其它字段的数据源 - 依赖字段的数据源发生变动时触发自身的 `getOptions`

## optionsDependFields

- 类型: `string` | `string[]`
- 默认: `dependFields`

数据源依赖字段, 默认取 `dependFields` 字段

## validator

- 类型: `(query: Record<string, any>) => any | Promise<any>`
- 默认: `-`

搜索事件触发时调用的校验函数, 返回值为真且是字符串时会执行 `HForm` 组件的 `toast` 函数

## hooks

- 类型: `Hooks`
- 默认: `-`

组件项的钩子函数, 可通过钩子监听组件生命周期等信息

::: details 查看 `Hooks` 类型以及使用方法

```tsx
import { onMounted } from 'vue';

// 示例:
defineOption({
    operateType: {
        t: 'select',
        label: '操作类型',
        options: [
            { label: '新增', value: 'add', children: [{ label: '新增用户', value: 'add-user' }, { label: '新增菜单', value: 'add-menu' }] },
            { label: '编辑', value: 'edit', children: [{ label: '编辑角色', value: 'edit-role' }, { label: '编辑部门', value: 'edit-dept' }] }
        ],
    },
    operateSubType: {
        t: 'select',
        label: '操作子类型',
        depend: true,
        dependFields: 'operateType',
        optionsDepend: true,
        hooks: {
            created() {
                onMounted(console.log.bind(null, '下拉组件已渲染'));
            },
            dependChange({ plain, props }) {
                const option = plain.wrapper.options.operateType.find((v) => v.value === props.query.operateType);
                plain.remoteOption.value = option ? JSON.parse(JSON.stringify(option.children)) : [];
            },
            // 该方法是防止 operateType 赋值在前 options 异步获取值在后
            // 导致 operateType 的 options 有值, 子选项的 options 却为空
            optionsDependChange({ plain, props }) {
                const option = plain.wrapper.options.operateType.find((v) => v.value === props.query.operateType);
                plain.remoteOption.value = option ? JSON.parse(JSON.stringify(option.children)) : [];
            },
        },
    },
});

interface Hooks {
    /** 组件创建后执行, 可在此函数内监听 vue 组件的生命周期 */
    created?: (option: {
        plain: PlainReturnValue;
        props: Record<string, any>;
    }) => void;
    /** 依赖值发生变动后执行 */
    dependChange?: (option: {
        plain: PlainReturnValue;
        props: Record<string, any>;
    }) => void;
    /** 依赖数据源发生变化后执行 */
    optionsDependChange?: (option: {
        plain: PlainReturnValue;
        props: Record<string, any>;
    }) => void;
}
```

---

<<< ../declaration.ts#plain

:::

## emptyValue

- 类型: `string` | `number` | `boolean` | `null` | `undefined`
- 默认: `-`

空值时提交的值

## customGetQuery

- 类型: `(checkedValue: any, emptyToValue: (val: any, defaultValue: any) => any, props: Record<string, any>) => Record<string, any>`
- 默认: `-`

自定义返回该配置项的 `query` 信息, 默认会根据传递的 `field` 或者 `fields` 生成, 一般情况下用不到该函数
