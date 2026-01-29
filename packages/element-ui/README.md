# @xiaohaih/json-form-el

[![npm version](https://img.shields.io/npm/v/@xiaohaih/json-form-el.svg)](https://www.npmjs.com/package/@xiaohaih/json-form-el)
[![npm downloads](https://img.shields.io/npm/dm/@xiaohaih/json-form-el.svg)](https://www.npmjs.com/package/@xiaohaih/json-form-el)

`@xiaohaih/json-form-el` 是基于 Element UI 的 json-form 适配层，提供开箱即用的表单组件。通过 JSON 配置即可渲染完整的表单，支持表单项间的依赖关系、数据校验等高级功能。

## ✨ 特性

- 🎨 **Element UI 集成**: 深度集成 Element UI 组件库
- 📋 **JSON 配置**: 通过 JSON 对象配置表单结构
- 🔗 **依赖关系**: 支持表单项间的复杂依赖关系
- ✅ **表单校验**: 内置校验机制，支持同步和异步校验
- 🎯 **类型安全**: 完整的 TypeScript 类型定义
- 🔧 **高度可定制**: 支持所有 Element UI 组件属性和插槽
- 📱 **响应式**: 支持响应式表单配置
- 🚀 **开箱即用**: 无需额外配置，开箱即用

## 📦 安装

```bash
# 使用 pnpm
pnpm add @xiaohaih/json-form-el

# 或使用 npm
npm install @xiaohaih/json-form-el

# 或使用 yarn
yarn add @xiaohaih/json-form-el
```

## 🏗️ 架构设计

### 设计理念

Element UI 适配层基于 `@xiaohaih/json-form-core` 核心模块实现，将纯逻辑层与 UI 层完美结合：

```
JSON 配置 ──► 适配层解析 ──► Element UI 组件
     │              │
     └──────────────┼──────────────► 核心逻辑层
                    │
                    ▼
              依赖管理、校验、状态同步
```

### 核心组件

### HForm (主表单组件)

表单容器组件，负责：

- 解析 JSON 配置
- 管理表单状态
- 协调组件间通信
- 处理表单提交和校验

#### 表单项组件

支持的所有表单项类型：

- **基础输入**: `input`, `input-number`, `textarea`
- **选择器**: `select`, `cascader`, `radio-group`, `checkbox-group`
- **日期时间**: `date-picker`, `time-picker`, `datetime-picker`
- **其他**: `switch`, `slider`, `rate`, `color-picker`, `upload`

## 🚀 快速开始

### 基础用法

```vue
<template>
    <HForm :value="formData" :config="formConfig" label-width="120px">
        <ElButton @click="submit">
            提交
        </ElButton>
    </HForm>
</template>

<script setup>
import { defineOption, HForm } from '@xiaohaih/json-form-el';
import { ref } from 'vue';

const formData = ref({
    username: '',
    email: '',
    password: '',
});

/** 数组形式定义 */
const formConfig = defineOption([
    {
        field: 'username',
        t: 'input',
        label: '用户名',
        placeholder: '请输入用户名',
        rules: [
            { required: true, message: '请输入用户名' },
        ],
    },
    {
        field: 'email',
        t: 'input',
        label: '邮箱',
        placeholder: '请输入邮箱',
    },
    {
        field: 'password',
        t: 'input',
        label: '密码',
        type: 'password',
        placeholder: '请输入密码',
        showPassword: true,
    },
]);

function handleInput(data) {
    formData.value = data;
}

function submit() {
    console.log('提交数据:', formData.value);
}
</script>
```

### 依赖关系

```typescript
/** 对象形式定义 */
const formConfig = defineOption({
    province: {
        t: 'select',
        label: '省份',
        options: [
            { label: '北京市', value: 'beijing' },
            { label: '上海市', value: 'shanghai' },
        ],
    },
    city: {
        t: 'select',
        label: '城市',
        depend: true,
        dependFields: 'province',
        getOptions(cb, query) {
            const cities = await fetchCities(query.province);
            cb(cities);
        },
    },
});
```

## 📚 API 参考

### HForm Props

| 属性名      | 类型                                                                         | 默认值  | 描述           |
| :---------- | :--------------------------------------------------------------------------- | :------ | :------------- |
| value       | `Record<string, any>`                                                        | -       | 表单数据       |
| config      | `() => ReturnType<typeof defineOption>` \| `ReturnType<typeof defineOption>` | -       | 表单配置对象   |
| label-width | `string \| number`                                                           | -       | 标签宽度       |
| readonly    | `boolean`                                                                    | `false` | 是否只读       |
| disabled    | `boolean`                                                                    | `false` | 是否禁用       |
| rules       | `Record<string, Rule[]>`                                                     | -       | 表单级校验规则 |

### HForm Events

| 事件名 | 参数                                  | 描述     |
| :----- | :------------------------------------ | :------- |
| search | `(data: Record<string, any>) => void` | 搜索事件 |

### HForm Methods

| 方法名        | 参数                                               | 描述         |
| :------------ | :------------------------------------------------- | :----------- |
| validate      | `() => Promise<boolean>`                           | 校验表单     |
| validateField | `(fields: string \| string[]) => Promise<boolean>` | 校验指定字段 |
| clearValidate | `(fields?: string \| string[]) => void`            | 清空校验     |
| reset         | `() => void`                                       | 重置表单     |

### defineOption

用于创建响应式表单配置的函数。

- 推荐用数组形式, 能推断出子级 `config` 下的字段

```typescript
// 数组形式创建配置项
function defineOption<T extends Record<string, any>, O extends Partial<Record<keyof T, any>> = Partial<Record<keyof T, any>>>(
    config: JSONFormOption[]
): Ref<JSONFormOption[]>;
// 对象形式创建配置项
function defineOption<T extends Record<string, any>, O extends Partial<Record<keyof T, any>> = Partial<Record<keyof T, any>>>(
    config: Record<string, JSONFormOption>
): Ref<Record<string, JSONFormOption>>;
```

### 字段配置结构

```typescript
interface BaseFieldConfig {
    // 组件类型标识
    t: string;

    // 显示标签
    label?: string;

    // 默认值
    defaultValue?: any;

    // 占位符
    placeholder?: string;

    // 是否必填
    required?: boolean;

    // 校验规则
    rules?: Rule[];

    // 是否隐藏(v-if隐藏 form-item)
    hide?: boolean;

    // 依赖配置
    depend?: boolean;
    dependFields?: string | string[];

    // 数据源
    options?: any[];
    getOptions?: (cb: (data: any) => void, query: Record<string, any>) => void;

    // 静态属性（直接传递给 Element UI 组件）
    staticProps?: Record<string, any>;

    // 动态属性（函数形式，返回组件属性）
    dynamicProps?: (query: Record<string, any>) => Record<string, any>;

    // 插槽配置
    slots?: Record<string, any>;
    itemSlots?: Record<string, any>;

    // 其他配置
    [key: string]: any;
}
```

## 🎛️ 支持的组件类型

### 基础输入

#### `input` - 文本输入框

```typescript
const formConfig = defineOption([
    {
        field: 'username',
        t: 'input',
        label: '用户名',
        placeholder: '请输入用户名',
        clearable: true,
        maxlength: 20,
        showWordLimit: true,
        rules: [
            { required: true, message: '请输入用户名' },
        ],
    },
]);
```

#### `input-number` - 数字输入框

```typescript
const formConfig = defineOption([
    {
        field: 'age',
        t: 'input-number',
        label: '年龄',
        min: 0,
        max: 120,
        step: 1,
        precision: 0,
    },
]);
```

#### `autocomplete` - 自动补全输入框

```tsx
const formConfig = defineOption([
    {
        field: 'city',
        t: 'autocomplete',
        label: '城市',
        placeholder: '请输入城市',
        getOptions(cb) {
            const { status, data } = fetchData();
            cb(status ? data : []);
        },
        itemSlots: {
            suffix: { render: (h: any) => <ElIcon><Search /></ElIcon> },
        },
    },
]);
```

### 选择器

#### `select` - 下拉选择

```typescript
const formConfig = defineOption([
    {
        field: 'status',
        t: 'select',
        label: '状态',
        options: [
            { label: '启用', value: 1 },
            { label: '禁用', value: 0 },
        ],
        clearable: true,
        filterable: true,
    },
]);
```

#### `cascader` - 级联选择

```typescript
const formConfig = defineOption([
    {
        field: 'region',
        t: 'cascader',
        label: '地区',
        options: regionData,
        props: { value: 'code', label: 'name', children: 'children' },
        filterable: true,
        showAllLevels: false,
    },
]);
```

#### `radio-group` - 单选框组

```typescript
const formConfig = defineOption([
    {
        field: 'gender',
        t: 'radio-group',
        label: '性别',
        options: [
            { label: '男', value: 'male' },
            { label: '女', value: 'female' },
        ],
    },
]);
```

#### `checkbox-group` - 多选框组

```typescript
const formConfig = defineOption([
    {
        field: 'hobbies',
        t: 'checkbox-group',
        label: '兴趣爱好',
        options: [
            { label: '阅读', value: 'reading' },
            { label: '运动', value: 'sports' },
            { label: '音乐', value: 'music' },
        ],
    },
]);
```

### 日期时间

#### `date-picker` - 日期选择

```typescript
const formConfig = defineOption([
    {
        field: 'birthday',
        t: 'date-picker',
        label: '生日',
        type: 'date',
        placeholder: '选择日期',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
    },
]);
```

#### `time-picker` - 时间选择

```typescript
const formConfig = defineOption([
    {
        field: 'meetingTime',
        t: 'time-picker',
        label: '会议时间',
        placeholder: '选择时间',
        format: 'HH:mm:ss',
        valueFormat: 'HH:mm:ss',
    },
]);
```

### 其他组件

#### `switch` - 开关

```typescript
const formConfig = defineOption([
    {
        field: 'enabled',
        t: 'switch',
        label: '启用',
        activeText: '开',
        inactiveText: '关',
        activeValue: 1,
        inactiveValue: 0,
    },
]);
```

#### `slider` - 滑块

```typescript
const formConfig = defineOption([
    {
        field: 'volume',
        t: 'slider',
        label: '音量',
        min: 0,
        max: 100,
        step: 1,
        showInput: true,
    },
]);
```

#### `rate` - 评分

```typescript
const formConfig = defineOption([
    {
        field: 'rating',
        t: 'rate',
        label: '评分',
        max: 5,
        allowHalf: true,
        showScore: true,
    },
]);
```

#### `color-picker` - 颜色选择

```typescript
const formConfig = defineOption([
    {
        field: 'themeColor',
        t: 'color-picker',
        label: '主题色',
        showAlpha: true,
        predefine: ['#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585'],
    },
]);
```

#### `upload` - 文件上传

```typescript
const formConfig = defineOption([
    {
        field: 'files',
        t: 'upload',
        label: '附件',
        action: '/api/upload',
        multiple: true,
        limit: 5,
        accept: '.jpg,.jpeg,.png,.gif',
        listType: 'picture-card',
    },
]);
```

#### `custom-render` - 自定义渲染

```tsx
const formConfig = defineOption([
    {
        field: 'customField',
        t: 'custom-render',
        render: {
            props: { plain: { type: Object } },
            methods: {
                onClick() {
                    const val = this.plain.checked.value;
                    this.plain.change((val + 1) || 1);
                },
            },
            render(this: any) {
                return (
                    <div onClick={this.onClick}>
                        自定义内容
                        <span>{this.plain.checked.value || 0}</span>
                        <ElButton onClick={this.onClick}>自增</ElButton>
                    </div>
                );
            },
        },
    },
]);
```

## 🔧 高级用法

### 动态属性

```typescript
const formConfig = defineOption([
    {
        field: 'email',
        t: 'input',
        label: '邮箱',
        placeholder: '请输入邮箱',
        // 静态属性
        clearable: true,
        // 动态属性，根据表单其他字段的值动态设置
        dynamicProps: (query) => ({
            disabled: !query.username,
            placeholder: query.username ? '请输入邮箱' : '请先输入用户名',
        }),
    },
]);
```

### 插槽使用

```tsx
const formConfig = defineOption([
    {
        field: 'password',
        t: 'input',
        label: '密码',
        type: 'password',
        showPassword: true,
        // 表单项插槽
        itemSlots: {
            label: {
                render(this: any) {
                    return (
                        <span class="custom-label">
                            密码
                            <ElIcon><Star /></ElIcon>
                        </span>
                    );
                },
            },
            suffix: {
                render(this: any) {
                    return (<ElButton text type="primary">生成密码</ElButton>);
                },
            },
        },
    },
]);
```

### 异步数据源

```typescript
const formConfig = defineOption([
    {
        field: 'city',
        t: 'select',
        label: '城市',
        depend: true,
        dependFields: 'province',
        getOptions: async (cb, query) => {
            try {
                const cities = await fetchCities(query.province);
                cb(cities);
            }
            catch (error) {
                console.error('获取城市数据失败:', error);
                cb([]);
            }
        },
    },
]);
```

### 表单分组

```typescript
const formConfig = defineOption([
    {
        field: 'userInfo',
        t: 'group',
        label: '用户信息',
        config: [
            {
                field: 'username',
                t: 'input',
                label: '用户名',
            },
            {
                field: 'email',
                t: 'input',
                label: '邮箱',
            },
        ],
    },
]);
```

### 动态列表

```tsx
const formConfig = defineOption([
    {
        field: 'users',
        t: 'dynamic-group',
        label: '用户列表',
        config: ({ item, index }) => ({
            name: {
                t: 'input',
                label: '姓名',
                placeholder: '请输入姓名',
            },
            age: {
                t: 'input-number',
                label: '年龄',
                min: 0,
                max: 120,
            }
        }),
        itemSlots: {
            append: ({ checked, index }) => (
                <ElButton onClick={() => checked.splice(index, 1)} type="danger" size="small">
                    删除
                </ElButton>
            ),
        },
        slots: {
            append: ({ query }) => (
                <ElButton onClick={() => query.users.push({ name: '', age: 0 })} type="primary">
                    添加用户
                </ElButton>
            ),
        },
    },
]);
```

### 表单联动

```typescript
const formConfig = defineOption([
    {
        field: 'country',
        t: 'select',
        label: '国家',
        options: countryList,
    },
    {
        field: 'province',
        t: 'select',
        label: '省份',
        depend: true,
        dependFields: 'country',
        getOptions: async (cb, query) => {
            const provinces = await fetchProvinces(query.country);
            cb(provinces);
        },
    },
]);
```

### 自定义校验

```typescript
const formConfig = defineOption([
    {
        field: 'password',
        t: 'input',
        label: '密码',
        rules: [
            { required: true, message: '密码不能为空' },
            { min: 6, message: '密码不能少于6位' },
            {
                validator: async (rule, value, callback) => {
                    const response = await checkPasswordStrength(value);
                    if (!response.strong) {
                        callback(new Error('密码强度不够'));
                    }
                    else {
                        callback();
                    }
                },
            },
        ],
    },
]);
```

## 🗂️ 目录结构

```
packages/element-ui/
├── index.ts              # 入口文件
├── components/           # 组件实现
│   ├── index.ts          # 组件导出
│   ├── wrapper/          # 表单容器
│   ├── input/            # 输入框组件
│   ├── select/           # 下拉框组件
│   ├── cascader/         # 级联选择组件
│   └── ...               # 其他组件
├── docs/                 # 文档
│   ├── index.md          # 文档首页
│   ├── examples/         # 示例
│   └── options/          # 配置选项
├── src/                  # 源码
│   ├── index.ts          # 源码入口
│   └── utils.ts          # 工具函数
└── README.md             # 文档
```

## 🔧 开发指南

### 环境要求

- Vue 2.7+
- Element UI 2.x
- TypeScript 4.0+

### 添加新组件

1. 在 `components/` 目录下创建组件目录
2. 实现组件逻辑，继承基础属性
3. 在 `components/index.ts` 中导出
4. 更新文档和示例

### 自定义主题

```javascript
import '@xiaohaih/json-form-el/dist/style.css';
// 自定义样式覆盖
```

## 🌟 在线示例

- [Vue 2 + Element UI 示例](https://xiaohaih.github.io/json-form/example-el-vue2/index.html)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🔗 相关链接

- [项目主页](https://github.com/xiaohaih/json-form)
- [核心模块](https://github.com/xiaohaiH/json-form/tree/master/packages/core/README.md)
- [Element Plus 版本](https://github.com/xiaohaiH/json-form/tree/master/packages/element-plus/README.md)
