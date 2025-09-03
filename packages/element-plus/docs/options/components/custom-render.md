# CustomRender 自定义渲染

`CustomRender` 组件是一个特殊的封装组件, 允许您完全自定义组件的渲染逻辑.

## 基本用法

```tsx
import { defineOption } from '@xiaohaih/json-form-plus';

defineOption({
    custom: {
        t: 'custom-render',
        label: '自定义组件',
        render: (props) => () => h('div', '自定义内容'),
    },
});
```

## Props

除了[共享 Props](../shares/share-props.md)外, `CustomRender` 组件还支持以下特定属性:

### renderFormItem

- 类型: `boolean`
- 默认: `true`

是否渲染 `ElFormItem`

### render

- 类型: `(option: CustomRenderSlotOption<T, Query, Option, OptionQuery>) => () => any`
- 默认: `-`
- 必填: `true`

自定义渲染逻辑

::: details CustomRenderSlotOption 声明如下

<<< ../declaration.ts#customRenderSlotOption

---

<<< ../declaration.ts#plain
:::

## 示例

<script setup>
import Iframe from '../../vue-components/iframe.vue';
</script>

### 基础渲染输入框

```tsx
import { ElButton, ElInput } from 'element-plus';

defineOption({
    custom: {
        t: 'custom-render',
        label: '自定义输入框',
        render: ({ plain }) => {
            return () => h('div', h(ElInput, { 'modelValue': plain.checked.value, 'onUpdate:modelValue': plain.change, 'placeholder': '请输入...' }));
        },
    },
    // 纯分隔符
    inline: {
        t: 'custom-render',
        renderFormItem: false,
        render: (props) => () => h('hr'),
    },
    icon: {
        t: 'custom-render',
        label: '菜单图标',
        render(option) {
            const { checked, change } = option.plain;
            // const popupIcons = useComponent(DialogIcons, ins);
            function clickHandle() {
                checked.value = 'plus';
                // popupIcons({
                //     defaultSelected: checked.value as string,
                //     onSuccess: change,
                // }).show();
            }
            function clear() {
                change('');
            }

            return () => (
                <div class="relative">
                    <div class="size-50px center border b-current b-dashed text-24px op-60 hover:c-primary" tabindex="0" onClick={clickHandle}>
                        {checked.value ? <i class={`${checked.value as string} c-primary`}></i> : <i class="i-pure:plus" />}
                    </div>

                    {!!checked.value && (
                        <div class="absolute right-0 top-0 size-14px center translate-x-50% translate-y--50% rd-50% bg-text-primary text-10px c-page-color op-80" tabindex="0" onClick={clear}><i class="i-pure:times"></i></div>
                    )}
                </div>
            );
        },
    },
});
```

::: details [点我查看在线示例](https://code.juejin.cn/pen/7545061415170605110)

<Iframe src="https://code.juejin.cn/pen/7545061415170605110" />
:::

## 注意事项

1. CustomRender 组件允许您完全控制渲染逻辑
2. 通过 `props.plain.checked.value` 访问当前值
3. 通过 `props.plain.change()` 更新数据
4. 可以通过 `renderFormItem` 控制是否渲染表单项
5. 可以渲染任何 Vue 组件或 HTML 元素
6. 可以处理任何用户交互事件
