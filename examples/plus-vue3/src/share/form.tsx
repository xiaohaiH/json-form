import { defineOption } from '@xiaohaih/json-form-plus';
import { ElFormItem } from 'element-plus';
import { defineComponent, markRaw } from 'vue';

export function conditionFactory() {
    return {
        condition: defineOption({
            '布局组件': {
                t: 'dynamic-group',
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
                    prepend: () => <div>444</div>,
                    append: ({ query }) => <div><span class="cursor-pointer" tabindex="0" onClick={() => (query.布局组件 ||= []) && query.布局组件.push({ 对象布局组件_输入框: '555' })}>添加</span></div>,
                },
                itemSlots: {
                    prepend: () => <div>啦啦啦~</div>,
                    append: ({ checked, index }) => (
                        <div class="flex items-center">
                            <div class="cursor-pointer" tabindex="0" onClick={() => checked.splice(index + 1, 0, { 对象布局组件_输入框: '啦啦啦啦啦', 对象布局组件_下拉框: '3' })}>添加</div>
                            <div class="cursor-pointer ml-10px" tabindex="0" onClick={() => checked.splice(index, 1)}>删除</div>
                        </div>
                    ),
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
            '上传': {
                t: 'upload',
                label: '上传',
                staticProps: { class: 'flex' },
                itemSlots: {
                    default: () => <div>sss</div>,
                    trigger: () => <div>点我</div>,
                },
                autoUpload: false,
            },
            '自动完成': {
                t: 'autocomplete',
                label: '自动完成',
                placeholder: '请输入',
                // fetchSuggestions: [{ value: 'aa' }, { value: 'bb' }],
                itemSlots: {
                    header: '666',
                    footer: '444',
                    suffix: markRaw(defineComponent({ setup: () => () => <div>22</div> })),
                },
                remoteFilter: true,
                filterMethod: (value, item) => item.value.includes(value) || item.id.includes(value),
                async getOptions(cb, query, { filterValue }) {
                    if (filterValue) return cb([{ value: `${filterValue}123`, id: `${filterValue}123` }, { value: `${filterValue}222`, id: `${filterValue}222` }]);
                    cb([{ value: 'a1', id: 'aa1' }, { value: 'b1', id: 'bb1' }, { value: 'cc2', id: 'bb2' }]);
                },
                onSelect: (item: any, { props, plain }) => {
                    props.query.input1 = item.id;
                },
            },
            '虚下拉框': {
                t: 'select-v2',
                label: '虚下拉框',
                // style: { width: '240px' },
                placeholder: '虚拟列表下拉框',
                // options: [
                //     { label: '第一', value: '1' },
                //     { label: '第二', value: '2' },
                //     { label: '第三', value: '3' },
                // ],
                remote: true,
                getOptions(cb, query, { filterValue }) {
                    if (!filterValue) return cb([]);
                    setTimeout(() => {
                        cb(Array.from({ length: ~~(Math.random() * 6) + 1 }, (_, i) => ({
                            label: `${filterValue}-${i + 1}`,
                            value: `${filterValue}-${i + 1}`,
                        })));
                    }, 1000);
                },
            },
            '颜色': {
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
            'rate': {
                t: 'rate',
                label: 'rate',
                colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
                allowHalf: true,
                showScore: true,
                scoreTemplate: '{value} 分',
            },
            'slider': {
                t: 'slider',
                // style: { width: '400px' },
                label: 'slider',
                showInput: true,
                // range: true,
            },
            '切换器': {
                t: 'switch',
                label: '切换器',
                activeValue: '1',
                inactiveValue: '0',
                defaultValue: '0',
            },
            '时间': {
                t: 'time-picker',
                label: '时间',
                placeholder: '快选择时间',
                depend: true,
                dependFields: '时2',
                initialValue: '08:00:00',
            },
            '时2': {
                t: 'time-select',
                label: '时2',
                placeholder: '时间二',
                defaultValue: '09:00',
                // style: { width: '160px' },
            },
            'input1': {
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
            'input2': {
                t: 'input',
                label: 'input2',
                placeholder: '666',
                rules: [{ required: true, message: '必填项' }],
            },
            'sel1': {
                t: 'select',
                label: 'sel1',
                placeholder: '哈哈哈',
                options: [
                    { label: '第一', value: '1' },
                    { label: '第二', value: '2' },
                    { label: '第三', value: '3' },
                ],
            },
            'sel2': {
                t: 'select',
                label: 'sel2',
                placeholder: '远程搜索',
                labelKey: 'dictLabel',
                valueKey: 'dictValue',
                multiple: true,
                remote: true,
                getOptions(cb, query, { filterValue }) {
                    if (!filterValue) return cb([]);
                    setTimeout(() => {
                        cb(Array.from({ length: ~~(Math.random() * 6) + 1 }, (_, i) => ({
                            dictLabel: `${filterValue}-${i + 1}`,
                            dictValue: `${filterValue}-${i + 1}`,
                        })));
                    }, 1000);
                },
                rules: [{ required: true, message: '必填项' }],
            },
            'date1': {
                t: 'date-picker',
                label: 'date1',
                placeholder: 'fff',
                // format: 'MM-DD',
                // valueFormat: 'YYYY-MM-DD',
            },
            'date2': {
                t: 'date-picker',
                type: 'daterange',
                label: 'date2',
                fields: ['date11', 'date22'],
                placeholder: '999',
                startPlaceholder: '起',
                endPlaceholder: '止',
                rules: [{ required: true, message: '必填项' }],
            },
            'tree': {
                t: 'tree-select',
                label: 'tree',
                placeholder: '999',
                rules: [{ required: true, message: '必填项' }],
                filterNodeMethod: (value, item) => {
                    return !value || (item.label2.includes(value) || item.value2.includes(value));
                },
                // remote: true,
                // remoteMethod: console.log,
                props: { label: 'label2', children: 'children2' },
                nodeKey: 'value2',
                getOptions(cb, query, { filterValue }) {
                    // cb(filterValue ? Array.from({ length: 4 }, (v, i) => ({ label2: `${filterValue}-${i + 1}`, value2: `${filterValue}-${i + 1}` })) : []);
                    cb([
                        {
                            label2: 'cas2aa',
                            value2: 'cas2aa',
                            children2: [
                                { label2: 'cas2埃安1', value2: 'cas2AA1' },
                                { label2: 'cas2埃安2', value2: 'cas2AA2' },
                            ],
                        },
                        {
                            label2: 'cas2bb',
                            value2: 'cas2bb',
                            children2: [
                                { label2: 'cas2BB1', value2: 'cas2BB1' },
                                { label2: 'cas2BB2', value2: 'cas2BB2' },
                            ],
                        },
                    ]);
                },
            },
            'cas1': {
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
            'cas2': {
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
                getOptions(cb) {
                    setTimeout(() => {
                        cb([
                            { label: 'che1', value: '1' },
                            { label: 'che2', value: '2' },
                        ]);
                    }, 1000);
                },
            },
            '多选框': {
                t: 'checkbox',
                label: '多选框',
                staticProps: { label: '男生' },
                // type: 'button',
                trueValue: '1',
                falseValue: '2',
                defaultValue: '1',
                rules: [{ required: true, message: '必填项' }],
            },
            'radio-group1': {
                t: 'radio-group',
                label: 'radio-group1',
                type: 'button',
                defaultValue: '1',
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
                getOptions(cb) {
                    setTimeout(() => {
                        cb([
                            { label: 'rad1', value: '1' },
                            { label: 'rad2', value: '2' },
                        ]);
                    }, 1000);
                },
            },
            'radio1': {
                t: 'radio',
                label: 'radio1',
                value: '1',
                staticProps: { label: '男生' },
                // defaultValue: '1',
                cancelable: true,
                // type: 'button',
                initialValue: '1',
            },
            '@提及': {
                t: 'mention',
                label: '@提及',
                placeholder: '请输入@',
                rules: [{ required: true, message: '必填项' }],
                getOptions(cb) {
                    setTimeout(() => {
                        cb([
                            { label: 'rad1', value: 'rad1' },
                            { label: 'rad2', value: 'rad2' },
                        ]);
                    }, 1000);
                },
                clearable: true,
            },
            '标签框': {
                t: 'input-tag',
                label: '标签框',
                placeholder: '标签输入框',
                tagType: 'success',
                itemSlots: {
                    tag: ({ value, index }) => (
                        <div>
                            {value}
                            -
                            {index}
                        </div>
                    ),
                },
                rules: [{ required: true, message: '必填项' }],
                clearable: true,
            },
            '分段控制器': {
                t: 'segmented',
                label: '分段控制器',
                rules: [{ required: true, message: '必填项' }],
                options: [
                    { label: 'aaa', value: 'aaa' },
                    { label: 'bbb', value: 'bbb' },
                    { label: 'ccc', value: 'ccc' },
                ],
            },
        }),
    };
}
