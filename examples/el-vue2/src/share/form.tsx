import { defineOption } from '@xiaohaih/json-form-el';
import { FormItem as ElFormItem } from 'element-ui';
import { h, set } from 'vue';

export function conditionFactory() {
    return {
        condition: defineOption({
            自定义: {
                t: 'custom-render',
                label: '自定义',
                render({ plain }) {
                    const checked = plain.checked as { value?: number };

                    function onClick() {
                        plain.change(checked.value ? checked.value + 1 : 1);
                    }
                    return ({ render: (h) => (
                        <div onClick={onClick}>
                            自定义渲染
                            {checked.value || 0}
                        </div>
                    ) });
                },
            },
            上传: {
                t: 'upload',
                label: '上传',
                // staticProps: { class: 'flex' },
                limit: 2,
                multiple: true,
                override: true,
                // itemSlots: {
                //     // default: () => <div>sss</div>,
                //     trigger: () => ({ render: (h) => <div>点我</div> }),
                // },
                autoUpload: false,
            },
            颜色: {
                t: 'color-picker',
                label: '颜色',
                showAlpha: true,
                colorFormat: 'hsl',
            },
            'input-num': {
                t: 'input-number',
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
            rate: {
                t: 'rate',
                label: 'rate',
                colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
                allowHalf: true,
                showScore: true,
                scoreTemplate: '{value} 分',
            },
            slider: {
                t: 'slider',
                // style: { width: '400px' },
                label: 'slider',
                showInput: true,
                // range: true,
            },
            切换器: {
                t: 'switch',
                label: '切换器',
                activeValue: '1',
                inactiveValue: '0',
                defaultValue: '0',
            },
            时间: {
                t: 'time-picker',
                label: '时间',
                placeholder: '快选择时间',
            },
            input1: {
                t: 'input',
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
            input2: {
                t: 'input',
                label: 'input2',
                placeholder: '666',
                rules: [{ required: true, message: '必填项' }],
            },
            sel1: {
                t: 'select',
                label: 'sel1',
                placeholder: '哈哈哈',
                options: [
                    { label: '第一', value: '1' },
                    { label: '第二', value: '2' },
                    { label: '第三', value: '3' },
                ],
            },
            sel2: {
                t: 'select',
                label: 'sel2',
                placeholder: 'test',
                labelKey: 'dictLabel',
                valueKey: 'dictValue',
                multiple: true,
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
            date1: {
                t: 'date-picker',
                label: 'date1',
                placeholder: 'fff',
                // format: 'MM-DD',
                // valueFormat: 'YYYY-MM-DD',
            },
            date2: {
                t: 'date-picker',
                type: 'daterange',
                label: 'date2',
                fields: ['date11', 'date22'],
                placeholder: '999',
                startPlaceholder: '起',
                endPlaceholder: '止',
                rules: [{ required: true, message: '必填项' }],
            },
            cas1: {
                t: 'cascader',
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
            cas2: {
                t: 'cascader',
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
            'che-g1': {
                t: 'checkbox-group',
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
            'che-g2': {
                t: 'checkbox-group',
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
            多选框: {
                t: 'checkbox',
                label: '多选框',
                staticProps: { label: '男生' },
                // type: 'button',
                trueLabel: '1',
                falseLabel: '2',
                defaultValue: '1',
                // itemSlots: {
                //     default: { render: (h) => <div>123</div> },
                // },
                rules: [{ required: true, message: '必填项' }],
            },
            'radio-group1': {
                t: 'radio-group',
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
            'rdg-cancel': {
                t: 'radio-group',
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
            radio1: {
                t: 'radio',
                label: 'radio1',
                value: '1',
                staticProps: { label: '男生' },
                // defaultValue: '1',
                cancelable: true,
                // itemSlots: {
                //     default: { render: (h) => <div>123_男生</div> },
                // },
                // type: 'button',
                initialValue: '1',
            },
        }),
    };
}
