# 共享 Props

所有表单项组件共享以下公共属性。

## 通用属性

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| field | `string` | - | 提交的字段名 |
| t | `string` | - | 组件类型标识 |
| label | `string` | - | 输入框左侧文本 |
| placeholder | `string` | - | 输入框的提示文字 |
| defaultValue | `any` | - | 默认值 |
| required | `boolean` | `false` | 是否必填 |
| rules | `Rule[]` | - | 校验规则 |
| disabled | `boolean` | `undefined` | 是否禁用 |
| readonly | `boolean` | `undefined` | 是否只读 |
| hide | `boolean` | `undefined` | 是否隐藏表单项（v-if 隐藏 form-item） |
| clearable | `boolean` | `true` | 是否显示清除按钮 |
| slots | `CommonSlots` | - | 组件自身的插槽 |

## 数据源属性

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| options | `any[]` | - | 数据源 |
| getOptions | `(cb, query) => void` | - | 获取数据源的方法（异步） |

## 依赖属性

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| depend | `boolean` | - | 是否开启依赖 |
| dependFields | `string \| string[]` | - | 依赖的字段名 |

## 插槽属性

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| slots | `CommonSlots` | - | 组件自身的插槽 |
| itemSlots | `Record<string, any>` | - | 表单项插槽 |

## 内容属性

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| contentProps | `Record<string, any>` | - | 表单组件属性（直接传递给 Vant 组件），与 FormItem Prop 冲突的属性 |

## 继承的 Vant Field 属性

所有表单项组件都继承了 Vant `Field` 组件的属性，包括但不限于：

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| name | `string` | - | 字段名 |
| label | `string` | - | 输入框左侧文本 |
| placeholder | `string` | - | 输入框占位提示文字 |
| disabled | `boolean` | `false` | 是否禁用 |
| readonly | `boolean` | `false` | 是否只读 |
| clearable | `boolean` | `true` | 是否显示清除按钮 |
| is-link | `boolean` | `false` | 是否展示右侧箭头并开启点击反馈 |
| required | `boolean` | `false` | 是否显示必填星号 |
| rules | `FieldRule[]` | - | 校验规则 |
| label-class | `string \| Array \| object` | - | 左侧文本额外类名 |
| label-width | `string \| number` | - | 左侧文本宽度 |
| label-align | `string` | - | 左侧文本对齐方式 |
| input-align | `string` | - | 输入框对齐方式 |
| error-message | `string` | - | 底部错误提示文案 |
| error-message-align | `string` | - | 底部错误提示文案对齐方式 |
| colon | `boolean` | `false` | 是否在 label 后面添加冒号 |
| show-word-limit | `boolean` | `false` | 是否显示字数统计 |
| maxlength | `number \| string` | - | 输入的最大字符数 |
| autosize | `boolean \| { maxHeight: number; minHeight: number }` | `false` | 是否自适应内容高度 |

更多属性请参考 [Vant Field 组件文档](https://vant.pro/vant/#/zh-CN/field)。
