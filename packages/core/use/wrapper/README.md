### `useWrapper` 组合式 API

`useWrapper` 是 json-form 库的容器逻辑层, 用于管理整个表单的状态、校验、搜索事件和子组件注册。它通过组合式 API 实现, 支持 Vue 2.7+ 和 Vue 3。

#### 功能特性

- **状态管理**: 管理表单的 query 对象, 支持 backfill 和 model 双模式
- **子组件注册**: 提供注册机制管理所有表单项
- **搜索控制**: 支持实时搜索和手动搜索模式
- **校验机制**: 内置校验流程, 支持异步校验
- **生命周期管理**: 自动处理子组件的注册和卸载

#### Props 参数

基于 `wrapperPropsGeneric()` 定义：

| 属性名                 | 类型                                                     | 默认值      | 必填 | 描述                                                    |
| :--------------------- | :------------------------------------------------------- | :---------- | :--- | :------------------------------------------------------ |
| realtime               | `boolean`                                                | `undefined` | 否   | 是否在数据发生变动后实时触发搜索事件（仅针对 backfill） |
| backfill               | `Record<string, any>`                                    | -           | 否   | 回填信息                                                |
| onBackfillChange       | `WrapperArrayable<onBackfillChange>`                     | -           | 否   | 回填信息发生变化时触发（仅针对 backfill）               |
| model             | `Record<string, any>`                                    | -           | 否   | 表单形式的双向绑定值                                    |
| shallowWatchModel | `boolean`                                                | `false`      | 否   | 是否浅监听 model, 批量赋值时启用以规避 depend 重置 |
| validator              | `(query: Record<string, any>) => any \| Promise<any>`    | `undefined` | 否   | 自定义校验函数（内部校验通过后触发）                    |
| toast                  | `(msg: string) => void`                                  | `undefined` | 否   | 校验失败时产生的提示                                    |
| readonly               | `boolean`                                                | `undefined` | 否   | 表单是否只读                                            |
| disabled               | `boolean`                                                | `undefined` | 否   | 表单是否禁用                                            |
| onSearch               | `WrapperArrayable<(query: Record<string, any>) => void>` | -           | 否   | 搜索事件触发回调（仅针对 backfill）                     |

#### 返回值 (Expose)

`useWrapper` 返回以下对象：

| 属性名          | 类型                                     | 描述                                                 |
| :-------------- | :--------------------------------------- | :--------------------------------------------------- |
| child           | `CommonMethod[]`                         | 已注册的所有子组件实例数组                           |
| wrapperInstance | `ProvideValue`                           | 提供给子组件的注入实例, 包含 register、search 等方法 |
| query           | `Ref<Record<string, any>>`               | 内部表单查询对象                                     |
| getQuery        | `() => Record<string, any>`              | 获取当前查询对象的副本                               |
| search          | `() => Promise<void>`                    | 触发搜索事件（包含校验逻辑）                         |
| reset           | `(target?: Record<string, any>) => void` | 重置所有表单项                                       |
| validateToast   | `() => Promise<any> \| any`              | 执行校验并返回错误信息                               |

#### 使用示例

```typescript
import { useWrapper } from '@json-form/core';

const props = {
    backfill: { username: 'admin', status: 'active' },
    realtime: true,
    validator: (query) => {
        if (!query.username) return '用户名不能为空';
    },
    toast: (msg) => console.error(msg),
    onSearch: (query) => {
        console.log('搜索条件:', query);
    // 执行搜索逻辑
    }
};

const {
    query,
    search,
    reset,
    validateToast
} = useWrapper(props);

// 手动触发搜索
await search();

// 重置表单
reset();

// 单独校验
const error = await validateToast();
if (error) {
    console.log('校验失败:', error);
}
```

#### 工作模式

##### Backfill 模式

当使用 `backfill` 属性时：

- 表单值存储在内部的 `query` 中
- 支持实时搜索（`realtime: true`）
- 搜索事件通过 `onSearch` 回调触发
- 回填数据变化时触发 `onBackfillChange`

##### Model 模式

当使用 `model` 属性时：

- 表单值直接与外部 `model` 同步
- 不支持实时搜索
- 搜索逻辑由外部控制

#### 提供给子组件的接口 (ProvideValue)

`useWrapper` 通过 `provide` 向子组件注入以下接口：

| 属性名                 | 类型                                              | 描述                        |
| :--------------------- | :------------------------------------------------ | :-------------------------- |
| realtime               | `Ref<boolean \| undefined>`                       | 是否实时触发搜索            |
| readonly               | `Ref<boolean \| undefined>`                       | 表单只读状态                |
| disabled               | `Ref<boolean \| undefined>`                       | 表单禁用状态                |
| register               | `(config: CommonMethod) => () => void`            | 注册子组件, 返回注销函数    |
| beforeUpdateQueryValue | `() => void`                                      | 更新 query 前调用, 暂停监听 |
| afterUpdateQueryValue  | `() => void`                                      | 更新 query 后调用, 恢复监听 |
| search                 | `() => Promise<string \| void> \| string \| void` | 触发搜索事件                |
| options                | `Record<string, any[]>`                           | 所有子组件的数据源集合      |

#### 子组件注册机制

子组件通过 `inject` 获取 `ProvideValue`, 然后调用 `register` 方法注册自身：

```typescript
const wrapper = inject<ProvideValue>(provideKey);
const unregister = wrapper?.register({
    field: 'username',
    reset: (query) => { /* 重置逻辑 */ },
    validator: (query) => { /* 校验逻辑 */ },
    // ... 其他方法
});

// 组件卸载时自动注销
onBeforeUnmount(unregister);
```

#### 校验流程

1. **字段级校验**: 遍历所有已注册的子组件, 调用各自的 `validator` 方法
2. **表单级校验**: 如果字段级校验都通过, 调用 `props.validator` 进行表单级校验
3. **错误处理**: 第一个返回字符串的校验结果作为错误信息, 通过 `toast` 回调显示

---

**注意**: 该 API 主要用于框架内部实现, UI 组件通常通过 `packages/element-plus` 或 `packages/element-ui` 中的适配组件使用。
