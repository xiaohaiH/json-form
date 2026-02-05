### `usePlain` 组合式 API

`usePlain` 是 json-form 库的核心逻辑层，用于管理单个表单项的状态、校验、依赖关系和数据源。它通过组合式 API 实现，支持 Vue 2.7+ 和 Vue 3。

#### 功能特性

- **响应式状态管理**: 自动同步表单值到 query 对象
- **依赖追踪**: 支持字段间的级联清空和重新加载
- **数据源管理**: 支持静态和动态数据源，优先级：远程数据源 > 本地数据源
- **生命周期钩子**: 提供丰富的钩子函数用于自定义逻辑
- **校验支持**: 内置校验机制，支持异步校验

#### Props 参数

基于 `plainPropsGeneric<T, Query, Option, OptionQuery>` 定义：

| 属性名                       | 类型                                               | 默认值      | 必填 | 描述                                                                    |
| :--------------------------- | :------------------------------------------------- | :---------- | :--- | :---------------------------------------------------------------------- |
| field                        | `string`                                           | -           | 是   | 提交的字段名                                                            |
| fields                       | `string[]`                                         | -           | 否   | 字段集（多选时，每个下标对应的字段可能不一样）                          |
| query                        | `Record<string, any>`                              | -           | 是   | 当前条件对象                                                            |
| parentQuery                  | `Record<string, any>`                              | -           | 否   | 父级查询对象（内部处理，外部无需传递）                                  |
| hide                         | `boolean \| (option: { query: Query }) => boolean` | -           | 否   | 是否隐藏，可根据 query 动态隐藏                                         |
| depend                       | `boolean`                                          | `undefined` | 否   | 是否依赖其它字段                                                        |
| resetByDependValueChange     | `boolean \| (query: Query) => boolean`             | `true`      | 否   | 依赖字段发生变化后是否重置值                                            |
| dependFields                 | `string \| string[]`                               | -           | 否   | 依赖字段集合                                                            |
| dependWatchOption            | `WatchOptions`                                     | -           | 否   | 依赖字段监听选项                                                        |
| optionsDepend                | `boolean`                                          | -           | 否   | 是否依赖其它字段的数据源                                                |
| optionsDependFields          | `string \| string[]`                               | -           | 否   | 数据源依赖字段（不传则取 dependFields）                                 |
| validator                    | `(query: Query) => any \| Promise<any>`            | -           | 否   | 校验函数，返回非空字符串代表失败                                        |
| initialValue                 | `T \| (option: { query: Query }) => T`             | `undefined` | 否   | 初始值，优先级高于 defaultValue, 重置时取该字段, 依赖变化后的重置默认值 |
| defaultValue                 | `T \| (option: { query: Query }) => T`             | `undefined` | 否   | 默认值，当字段为空值时使用                                              |
| defaultValueConflictCallback | `(value: any, checked: Ref<any>) => void`          | `noop`      | 否   | 重置时当前值与默认值/初始值相同时, 自定义赋值逻辑(默认不改变)           |
| options                      | `Option[]`                                         | `[]`        | 否   | 静态数据源                                                              |
| getOptions                   | `GetOptions<Query, OptionQuery>`        | -           | 否   | 动态获取数据源的函数                                                    |
| uniqueValue                  | `string \| number`                                 | -           | 否   | 唯一值标识（根据数组值动态生成的组件中使用）                                            |
| hooks                        | `HookOption<Query, OptionQuery>`        | `undefined` | 否   | 生命周期钩子选项                                                        |

#### 返回值 (Expose)

`usePlain` 返回以下对象：

| 属性名         | 类型                                                                                                                                | 描述                                                   |
| :------------- | :---------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------- |
| coverProps     | `Ref<Record<'initialValue' \| 'defaultValue', any>>`                                                                                | 覆盖的 props 值（最新的 defaultValue 和 initialValue） |
| wrapper        | `ProvideValue \| undefined`                                                                                                         | 父级表单容器实例                                       |
| option         | `CommonMethod`                                                                                                                      | 当前表单项实例，包含 reset、validator 等方法           |
| loading        | `Ref<boolean>`                                                                                                                      | 数据源加载状态                                         |
| getOptions     | `(trigger: 'initial' \| 'depend' \| 'other', option?: { filterValue?: string; callback?: (data: any[]) => void }) => Promise<void>` | 主动更新数据源                                         |
| checked        | `ComputedRef<any>`                                                                                                                  | 当前表单项的值（双向绑定到 query[field]）              |
| remoteOption   | `Ref<Option[]>`                                                                                                                     | 远程获取的数据源                                       |
| finalOption    | `ComputedRef<Option[]>`                                                                                                             | 最终渲染的数据源（remoteOption 优先）                  |
| insetHide      | `ComputedRef<boolean>`                                                                                                              | 是否隐藏（计算属性）                                   |
| change         | `(value: any) => void`                                                                                                              | 更新值并触发搜索事件（实时搜索时生效）                 |
| search         | `() => void`                                                                                                                        | 直接触发搜索事件                                       |
| reset          | `(query?: Record<string, any>) => void`                                                                                             | 重置表单字段                                           |
| globalReadonly | `Ref<boolean>`                                                                                                                      | 表单级别的只读状态                                     |
| globalDisabled | `Ref<boolean>`                                                                                                                      | 表单级别的禁用状态                                     |

#### 使用示例

```typescript
import { usePlain } from '@json-form/core';

const props = {
    field: 'username',
    query: reactive({ username: '' }),
    options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' }
    ],
    validator: (query) => {
        if (!query.username) return '用户名不能为空';
    }
};

const {
    checked,
    loading,
    finalOption,
    change,
    reset
} = usePlain(props);

// 获取当前值
console.log(checked.value);

// 改变值
change('new value');

// 重置
reset();
```

#### 钩子函数

通过 `hooks` 属性可以监听组件生命周期：

```typescript
const plain = usePlain({
    // ... 其他 props
    hooks: {
        created: ({ plain, props }) => {
            // 组件创建时
            console.log('组件创建', plain.checked.value);
        },
        dependChange: ({ plain, props }) => {
            // 依赖项改变时
            console.log('依赖改变');
        },
        backfillChange: (backfill, oldBackfill, { plain, props }) => {
            // 回填数据改变时
            console.log('回填改变', backfill, oldBackfill);
        }
    }
});
```

#### 依赖关系

当设置 `depend: true` 时，组件会监听 `dependFields` 指定的字段变化：

- 当依赖字段值改变时，会重置当前字段值（如果 `resetByDependValueChange` 为 true）
- 如果设置了 `optionsDepend: true`，还会重新获取数据源

```typescript
const plain = usePlain({
    field: 'city',
    depend: true,
    dependFields: 'province',
    getOptions: (cb, query) => {
        // 根据省份获取城市列表
        fetchCities(query.province).then(cb);
    }
});
```

#### 数据源管理

支持静态和动态数据源：

- **静态数据源**: 通过 `options` 属性设置
- **动态数据源**: 通过 `getOptions` 函数获取，函数接收回调、当前 query 和额外选项

`getOptions` 函数可以返回 Promise，支持异步获取：

```typescript
const plain = usePlain({
    field: 'city',
    getOptions: async (cb, query, option) => {
        const cities = await fetchCities(query.province);
        cb(cities);

        // 可以通过 option 改变默认值等
        if (option.trigger === 'initial') {
            option.changeDefaultValue(cities[0]?.value);
        }
    }
});
```

---

**注意**: 该 API 主要用于框架内部实现，UI 组件通常通过 `packages/element-plus` 或 `packages/element-ui` 中的适配组件使用。
