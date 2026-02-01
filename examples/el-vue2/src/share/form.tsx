import { defineOption } from '@xiaohaih/json-form-el';
import { FormItem as ElFormItem } from 'element-ui';
import { h, set } from 'vue';

export function conditionFactory() {
    return {
        condition: defineOption([
            {
                t: 'dynamic-group',
                field: '布局组件',
                tag: 'div',
                class: 'w-full',
                // config: {
                //     '对象布局组件_输入框': {
                //         t: 'input',
                //         label: '对象布局组件_输入框',
                //         placeholder: '哈哈哈',
                //     },
                //     '对象布局组件_下拉框': {
                //         t: 'select',
                //         label: '对象布局组件_下拉框',
                //         placeholder: '哈哈哈',
                //         options: [
                //             { label: '第一', value: '1' },
                //             { label: '第二', value: '2' },
                //             { label: '第三', value: '3' },
                //         ],
                //     },
                // },
                itemProps: { class: 'flex' },
                config: ({ item, index }) => ({
                    对象布局组件_输入框: {
                        t: 'input',
                        label: '对象布局组件_输入框',
                        placeholder: '哈哈哈',
                        depend: true,
                        initialValue: '999',
                        dependFields: [`布局组件.${index}.对象布局组件_下拉框`],
                    },
                    对象布局组件_下拉框: {
                        t: 'select',
                        label: '对象布局组件_下拉框',
                        placeholder: '哈哈哈',
                        defaultValue: '1',
                        options: [
                            { label: '第一', value: '1' },
                            { label: '第二', value: '2' },
                            { label: '第三', value: '3' },
                        ],
                    },
                }),
                slots: {
                    prepend: {
                        render(h: any) {
                            return <div>444</div>;
                        },
                    },
                    append: {
                        props: { query: { type: Object, required: true } },
                        render(this: any) {
                            const { query } = this;
                            return <div><span class="cursor-pointer" tabindex="0" onClick={() => (query.布局组件 ||= []) && query.布局组件.push({ 对象布局组件_输入框: '555' })}>添加</span></div>;
                        },
                    },
                },
                itemSlots: {
                    prepend: { render: (h: any) => <div>啦啦啦~</div> },
                    append: {
                        props: { checked: { type: Array }, index: { type: Number } },
                        render(this: any) {
                            const { checked, index } = this;
                            return (
                                <div class="flex items-center">
                                    <div class="cursor-pointer" tabindex="0" onClick={() => checked.splice(index + 1, 0, { 对象布局组件_输入框: '啦啦啦啦啦', 对象布局组件_下拉框: '3' })}>添加</div>
                                    <div class="cursor-pointer ml-10px" tabindex="0" onClick={() => checked.splice(index, 1)}>删除</div>
                                </div>
                            );
                        },
                    },
                },
                // config: [
                //     { t: 'input', field: '数组布局组件_输入框', label: '数组布局组件_输入框', placeholder: '哈哈哈', },
                //     {
                //         t: 'select',
                //         field: '数组布局组件_下拉框',
                //         label: '数组布局组件_下拉框',
                //         placeholder: '哈哈哈',
                //         options: [
                //             { label: '第一', value: '1' },
                //             { label: '第二', value: '2' },
                //             { label: '第三', value: '3' },
                //         ],
                //     },
                // ],
            },
            {
                t: 'custom-render',
                field: '自定义',
                label: '自定义',
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
                                自定义渲染
                                {this.plain.checked.value || 0}
                            </div>
                        );
                    },
                },
                // render({ plain }) {
                //     const checked = plain.checked as { value?: number };

                //     function onClick() {
                //         plain.change(checked.value ? checked.value + 1 : 1);
                //     }
                //     return ({ render: (h) => (
                //         <div onClick={onClick}>
                //             自定义渲染
                //             {checked.value || 0}
                //         </div>
                //     ) });
                // },
            },
            {
                t: 'upload',
                field: '上传',
                label: '上传',
                contentProps: { class: 'flex' },
                itemSlots: {
                    default: () => ({ render: (h: any) => <div>sss</div> }),
                    trigger: { render: (h: any) => <div>点我</div> },
                },
                limit: 2,
                multiple: true,
                override: true,
                autoUpload: false,
            },
            {
                t: 'autocomplete',
                field: '自动完成',
                label: '自动完成',
                placeholder: '请输入',
                // fetchSuggestions: [{ value: 'aa' }, { value: 'bb' }],
                itemSlots: {
                    default: { props: { item: Object }, render(this: any, h: any) { return h('div', this.item.id); } },
                },
                remoteFilter: true,
                filterMethod: (value, item) => item.value.includes(value) || item.id.includes(value),
                async getOptions(cb, query, { filterValue }) {
                    if (filterValue) return cb([{ value: `${filterValue}123`, id: `${filterValue}123` }, { value: `${filterValue}222`, id: `${filterValue}222` }]);
                    cb([{ value: 'a1', id: 'aa1' }, { value: 'b1', id: 'bb1' }, { value: 'cc2', id: 'bb2' }]);
                },
                on: {
                    select(item: any, { props, plain }: any) {
                        props.query.input1 = item.id;
                    },
                },
            },
            {
                t: 'color-picker',
                field: '颜色',
                label: '颜色',
                showAlpha: true,
                colorFormat: 'hsl',
            },
            {
                t: 'input-number',
                field: 'input-num',
                label: 'input-num',
                placeholder: 'gs',
                initialValue: 123,
                defaultValue: 999,
                getOptions(cb, query, option) {
                    option.changeInitialValue(666);
                },
                // stepStrictly: true,
                controlsPosition: 'right',
                // decreaseIcon: <div>123</div>,
                // increaseIcon: <div>456</div>,
            },
            {
                t: 'rate',
                field: 'rate',
                label: 'rate',
                colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
                allowHalf: true,
                showScore: true,
                scoreTemplate: '{value} 分',
            },
            {
                t: 'slider',
                field: 'slider',
                // style: { width: '400px' },
                label: 'slider',
                showInput: true,
                // range: true,
            },
            {
                t: 'switch',
                field: '切换器',
                label: '切换器',
                activeValue: '1',
                inactiveValue: '0',
                defaultValue: '0',
            },
            {
                t: 'time-picker',
                field: '时间',
                label: '时间',
                placeholder: '快选择时间',
            },
            {
                t: 'input',
                field: 'input1',
                label: 'input1',
                placeholder: '哈哈哈',
                // itemSlots: {
                //     append: ({ plain, onChange }) => {
                //         return (
                //             <div style="cursor: pointer;" onClick={() => onChange('234')}>
                //                 点我
                //             </div>
                //         );
                //     },
                // },
            },
            {
                t: 'input',
                field: 'input2',
                label: 'input2',
                placeholder: '666',
                rules: [{ required: true, message: '必填项' }],
            },
            {
                t: 'select',
                field: 'sel1',
                label: 'sel1',
                placeholder: '哈哈哈',
                options: [
                    { label: '第一', value: '1' },
                    { label: '第二', value: '2' },
                    { label: '第三', value: '3' },
                ],
            },
            {
                t: 'select',
                field: 'sel2',
                label: 'sel2',
                placeholder: 'test',
                labelKey: 'dictLabel',
                valueKey: 'dictValue',
                multiple: true,
                defaultValue: () => [],
                options: [] as Record<'dictLabel' | 'dictValue', string>[],
                getOptions(cb) {
                    setTimeout(() => {
                        cb([
                            { dictLabel: '第一一', dictValue: '11' },
                            { dictLabel: '第二二', dictValue: '22' },
                            { dictLabel: '第三三', dictValue: '33' },
                        ]);
                    }, 1000);
                },
                rules: [{ required: true, message: '必填项' }],
            },
            {
                t: 'date-picker',
                field: 'date1',
                label: 'date1',
                placeholder: 'fff',
                // format: 'MM-DD',
                // valueFormat: 'YYYY-MM-DD',
            },
            {
                t: 'date-picker',
                field: 'date2',
                type: 'daterange',
                label: 'date2',
                fields: ['date11', 'date22'],
                placeholder: '999',
                startPlaceholder: '起',
                endPlaceholder: '止',
                rules: [{ required: true, message: '必填项' }],
            },
            {
                t: 'cascader',
                field: 'cas1',
                label: 'cas1',
                placeholder: 'fff',
                fields: ['cas1', 'cas1_1'],
                props: { checkStrictly: true },
                options: [
                    {
                        label: 'aa',
                        value: 'aa',
                        children: [
                            { label: 'AA1', value: 'AA1' },
                            { label: 'AA2', value: 'AA2' },
                        ],
                    },
                    {
                        label: 'bb',
                        value: 'bb',
                        children: [
                            { label: 'BB1', value: 'BB1' },
                            { label: 'BB2', value: 'BB2' },
                        ],
                    },
                ],
                // depend: true,
                // dependFields: ['date11', 'date22'],
                // getOptions(cb, query) {
                //     console.log(query, 111, query.date11, query.date22);
                // },
            },
            {
                t: 'cascader',
                field: 'cas2',
                label: 'cas2',
                placeholder: '999',
                props: { emitPath: false },
                rules: [{ required: true, message: '必填项' }],
                getOptions(cb) {
                    cb([
                        {
                            label: 'cas2aa',
                            value: 'cas2aa',
                            children: [
                                { label: 'cas2AA1', value: 'cas2AA1' },
                                { label: 'cas2AA2', value: 'cas2AA2' },
                            ],
                        },
                        {
                            label: 'cas2bb',
                            value: 'cas2bb',
                            children: [
                                { label: 'cas2BB1', value: 'cas2BB1' },
                                { label: 'cas2BB2', value: 'cas2BB2' },
                            ],
                        },
                    ]);
                },
            },
            {
                t: 'checkbox-group',
                field: 'che-g1',
                label: 'che-g1',
                type: 'button',
                // itemSlots: {
                //     default: ({ option, labelKey}) => ({ render: (h) => <div>6{option[labelKey]}</div> }),
                // },
                defaultValue: ['1'],
                options: [
                    { label: 'check1', value: '1' },
                    { label: 'check2', value: '2' },
                ],
            },
            {
                t: 'checkbox-group',
                field: 'che-g2',
                label: 'che-g2',
                defaultValue: ['2'],
                rules: [{ required: true, message: '必填项' }],
                // itemSlots: {
                //     default: ({ option, labelKey}) => ({ render: (h) => <div>ff{option[labelKey]}</div> }),
                // },
                getOptions(cb) {
                    setTimeout(() => {
                        cb([
                            { label: 'che1', value: '1' },
                            { label: 'che2', value: '2' },
                        ]);
                    }, 1000);
                },
            },
            {
                t: 'checkbox',
                field: '多选框',
                label: '多选框',
                contentProps: { label: '男生' },
                // type: 'button',
                trueLabel: '1',
                falseLabel: '2',
                defaultValue: '1',
                // itemSlots: {
                //     default: { render: (h) => <div>123</div> },
                // },
                rules: [{ required: true, message: '必填项' }],
            },
            {
                t: 'radio-group',
                field: 'radio-group1',
                label: 'radio-group1',
                type: 'button',
                defaultValue: '1',
                // itemSlots: {
                //     default: ({ option, labelKey}) => ({ render: (h) => <div>s_{option[labelKey]}</div> }),
                // },
                options: [
                    { label: 'radio1', value: '1' },
                    { label: 'radio2', value: '2' },
                ],
            },
            {
                t: 'radio-group',
                field: 'rdg-cancel',
                label: 'rdg-cancel',
                rules: [{ required: true, message: '必填项' }],
                cancelable: true,
                // defaultValue: '2',
                initialValue: '2',
                // itemSlots: {
                //     default: ({ option, labelKey}) => ({ render: (h) => <div>g_{option[labelKey]}</div> }),
                // },
                getOptions(cb) {
                    setTimeout(() => {
                        cb([
                            { label: 'rad1', value: '1' },
                            { label: 'rad2', value: '2' },
                        ]);
                    }, 1000);
                },
            },
            {
                t: 'radio',
                field: 'radio1',
                label: 'radio1',
                value: '1',
                contentProps: { label: '男生' },
                // defaultValue: '1',
                cancelable: true,
                // itemSlots: {
                //     default: { render: (h) => <div>123_男生</div> },
                // },
                // type: 'button',
                initialValue: '1',
            },
        ]),
    };
}
