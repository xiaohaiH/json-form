import { defineOption } from '@xiaohaih/json-form-vant';
import { Field as VanField } from 'vant';
import { defineComponent, markRaw, ref } from 'vue';

export function conditionFactory() {
    return {
        condition: defineOption(({ query, formRef }) => [
            // {
            //     field: 'group',
            //     t: 'group',
            //     label: 'group带插槽',
            //     placeholder: '哈哈哈',
            //     tag: VanField,
            //     tagSlots: {
            //         extra: () => '123',
            //     },
            // },
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
                // contentProps: { class: 'flex' },
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
                        defaultValue: () => ['2'],
                        options: [
                            { text: '第一', value: '1' },
                            { text: '第二', value: '2' },
                            { text: '第三', value: '3' },
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
                            <div class="cursor-pointer" tabindex="0" onClick={() => checked.splice(index + 1, 0, { 对象布局组件_输入框: '啦啦啦啦啦', 对象布局组件_下拉框: ['3'] })}>添加</div>
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
            {
                t: 'custom-render',
                field: '自定义',
                label: '自定义',
                render({ plain }) {
                    const checked = plain.checked as { value?: number };

                    function onClick() {
                        plain.change(checked.value ? checked.value + 1 : 1);
                    }
                    return () => (
                        <div onClick={onClick}>
                            自定义渲染
                            {checked.value || 0}
                        </div>
                    );
                },
            },
            {
                t: 'cell-group',
                field: 'cellGroup',
                title: '单元格组',
                inset: true,
                // slots: { title: '哈哈哈哈' },
                config: [
                    {
                        t: 'input',
                        field: 'cellGroupInput1',
                        label: '单元格组input',
                        placeholder: '快写快写',
                        slots: { extra: '666' },
                    },
                    {
                        t: 'number-keyboard',
                        field: 'cellGroupNumKey',
                        label: '单元格组数字',
                        placeholder: '快啊',
                    },
                ],
            },
            {
                t: 'input',
                field: 'input1',
                label: 'input1',
                placeholder: 'input2在我有值后显示',
                required: true,
                rules: [{ required: true, message: '必填项' }, { validator: (value, rule) => value === '123', message: '必须输入123' }] as const,
                slots: {
                    label: '哇哈哈',
                    extra: '1111',
                    errorMessage: ({ message }) => `${message}-11111`,
                },
            },
            {
                t: 'input',
                field: 'input2',
                label: 'input2',
                placeholder: '666',
                hide: !query.input1,
                // disabled: true,
                // defaultValue: '12333333',
                // rules: [{ required: true, message: '必填项' }],
            },
            {
                t: 'number-keyboard',
                field: 'num-key',
                label: '数字键盘',
                placeholder: '请选择',
            },
            {
                t: 'password-input',
                field: 'pwd',
                label: '密码输入框',
                placeholder: '请输入密码',
            },
            {
                t: 'cascader',
                field: 'cas1',
                label: 'cas1',
                placeholder: '请选择',
                // fields: ['cas1', 'cas1_1'],
                slots: {
                    label: () => <div>级联</div>,
                    errorMessage: ({ message }) => `${message}-11111`,
                },
                checkStrictly: true,
                options: [
                    {
                        text: 'aa文字',
                        value: 'aa',
                        children: [
                            { text: 'AA1文字', value: 'AA1' },
                            { text: 'AA2文字', value: 'AA2' },
                        ],
                    },
                    {
                        text: 'bb文字',
                        value: 'bb',
                        children: [
                            { text: 'BB1文字', value: 'BB1' },
                            { text: 'BB2文字', value: 'BB2' },
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
                placeholder: '请选择',
                emitPath: true,
                showAllLevels: true,
                // rules: [{ required: true, message: '必填项' }],
                // type: 'textarea',
                // disabled: true,
                // defaultValue: 'cas2AA2',
                getOptions(cb) {
                    cb([
                        {
                            text: 'cas2aa文本',
                            value: 'cas2aa',
                            children: [
                                { text: 'cas2AA1文本', value: 'cas2AA1' },
                                { text: 'cas2AA2文本', value: 'cas2AA2' },
                            ],
                        },
                        {
                            text: 'cas2bb文本',
                            value: 'cas2bb',
                            children: [
                                { text: 'cas2BB1文本', value: 'cas2BB1' },
                                { text: 'cas2BB2文本', value: 'cas2BB2' },
                            ],
                        },
                    ]);
                },
            },
            {
                t: 'picker',
                field: 'picker',
                label: '选择框',
                placeholder: '请选择',
                // pickerProps: {
                //     columns: [
                //         { text: '杭州', value: 'Hangzhou' },
                //         { text: '宁波', value: 'Ningbo' },
                //         { text: '温州', value: 'Wenzhou' },
                //         { text: '绍兴', value: 'Shaoxing' },
                //         { text: '湖州', value: 'Huzhou' },
                //     ],
                // },
                separator: '-',
                pickerProps: { columnsFieldNames: { text: 'label' } },
                options: [
                    {
                        label: '安安',
                        value: 'aa',
                        children: [
                            { label: '啊啊1', value: 'AA1' },
                            { label: '啊啊2', value: 'AA2' },
                        ],
                    },
                    {
                        label: '宝宝',
                        value: 'bb',
                        children: [
                            { label: '版本1', value: 'BB1' },
                            { label: '版本2', value: 'BB2' },
                        ],
                    },
                ],
                // getOptions(cb) {
                //     cb([
                //         // { text: '杭州', value: 'Hangzhou' },
                //         // { text: '宁波', value: 'Ningbo' },
                //         // { text: '温州', value: 'Wenzhou' },
                //         // { text: '绍兴', value: 'Shaoxing' },
                //         // { text: '湖州', value: 'Huzhou' },

                //         // 第一列
                //         [
                //             { text: '周一', value: 'Monday', children: [{ text: '周一1', value: 'Monda4y1' }] },
                //             { text: '周二', value: 'Tuesday', children: [{ text: '周二1', value: 'Monday41' }]  },
                //             { text: '周三', value: 'Wednesday', children: [{ text: '周三1', value: 'Mond3ay1' }]  },
                //             { text: '周四', value: 'Thursday', children: [{ text: '周四1', value: 'Monda2y1' }]  },
                //             { text: '周五', value: 'Friday', children: [{ text: '周五1', value: 'Monda1y1' }]  },
                //         ],
                //         // 第二列
                //         [
                //             { text: '上午', value: 'Morning' },
                //             { text: '下午', value: 'Afternoon' },
                //             { text: '晚上', value: 'Evening' },
                //         ],
                //     ]);
                // },
            },
            {
                t: 'tree-select',
                field: 'treeSelect',
                label: '分类选择器',
                placeholder: '快选择, 快快快',
                defaultValue: () => ['BB2', 'AA1'],
                options: [
                    {
                        text: 'aa文字',
                        id: 'aa',
                        children: [
                            { text: 'AA1文字', id: 'AA1' },
                            { text: 'AA2文字', id: 'AA2' },
                        ],
                    },
                    {
                        text: 'bb文字',
                        id: 'bb',
                        children: [
                            { text: 'BB1文字', id: 'BB1' },
                            { text: 'BB2文字', id: 'BB2' },
                        ],
                    },
                ],
            },
            {
                t: 'area',
                field: 'area',
                label: '区域',
                placeholder: '请选择',
                defaultValue: '110201',
                // areaProps: { areaList: { province_list: {110000: '北京'}, city_list: {110011: '朝阳区'}, county_list: {} } },
                options: { province_list: { 110000: '北京' }, city_list: { 110100: '朝阳区', 110200: '光子区' }, county_list: {} },
                // depend: true,
                // dependFields: ['date11', 'date22'],
                // getOptions(cb, query) {
                //     console.log(query, 111, query.date11, query.date22);
                // },
            },
            {
                t: 'checkbox',
                field: '多选框',
                label: '多选框',
                checkboxSlots: { default: () => '男生' },
                defaultValue: true,
                // rules: [{ required: true, message: '必填项' }],
            },
            {
                t: 'checkbox-group',
                field: 'che-g2',
                label: 'che-g2',
                defaultValue: ['2'],
                // rules: [{ required: true, message: '必填项' }],
                checkboxSlots: { default: ({ item }) => `选项${item.label}` },
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
                t: 'radio',
                field: 'rad',
                label: '单选框',
                radioProps: { name: '111' },
                radioSlots: { default: () => '男生' },
                // rules: [{ required: true, message: '必填项' }],
            },
            {
                t: 'radio-group',
                field: 'radio-g',
                label: '单选框组',
                // defaultValue: '2',
                // rules: [{ required: true, message: '必填项' }],
                cancelable: true,
                radioSlots: { default: ({ item }) => `选项${item.label}` },
                getOptions(cb) {
                    setTimeout(() => {
                        cb([
                            { label: 'radio1', value: '1' },
                            { label: 'radio2', value: '2' },
                        ]);
                    }, 1000);
                },
            },
            {
                t: 'switch',
                field: 'switch',
                label: '开关',
                switchSlots: { background: 'pink' },
            },
            {
                t: 'date-picker',
                field: 'date1',
                label: 'date1',
                placeholder: '请选择',
                // defaultValue: '2026-05-09',
                format: (o) => {
                    const [year, month, day] = o;
                    return `${year}年${month}月${day}日`;
                },
            },
            {
                t: 'time-picker',
                field: 'time',
                label: '时间',
                placeholder: '快选择时间',
                timePickerProps: {
                    columnsType: ['hour', 'minute', 'second'],
                },
                defaultValue: '08:04:52',
                format: (o) => {
                    const [hour, minute, second] = o;
                    return `${hour}时${minute}分${second}秒`;
                },
            },
            {
                t: 'date-time-picker-group',
                field: 'dateTimePickerGroup',
                label: '日期时间组',
                placeholder: '请输入',
                defaultValue: '2026-05-09 12:20:20',
                pickerGroupProps: { tabs: ['选择日期', '选择时间'] },
                timePickerProps: { columnsType: ['hour', 'minute', 'second'] },
            },
            // {
            //     t: 'datetime-picker',
            //     field: 'datetimePicker',
            //     format: (date) => date.valueOf(),
            //     label: '日期时间',
            //     placeholder: '请输入',
            //     defaultValue: new Date(),
            // },
            {
                t: 'rate',
                field: 'rate',
                label: '评分',
                rateProps: { allowHalf: true },
            },
            {
                t: 'signature',
                field: 'sig',
                label: '签名',
                renderField: false,
                signatureProps: { backgroundColor: '#f5f5f5', penColor: '#000', lineWidth: 2 },
            },
            {
                t: 'slider',
                field: 'slider',
                label: '滑块',
                sliderProps: { reverse: true },
            },
            {
                t: 'stepper',
                field: 'stepper',
                label: '步进器',
                stepperProps: { theme: 'round', buttonSize: '22', disableInput: true },
            },
            {
                t: 'upload',
                field: 'upload',
                label: '上传',
            },
        ]),
    };
}
