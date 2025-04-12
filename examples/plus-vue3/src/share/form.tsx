const { set, h } = window.Vue;
const { defineOption } = window.JSONForm;
const { ElFormItem } = window.Ui;

export function conditionFactory() {
    return {
        condition: defineOption({
            upload: {
                t: 'upload',
                label: '上传',
                staticProps: { class: 'flex' },
                itemSlots: {
                    default: () => <div>sss</div>,
                    trigger: () => <div>点我</div>,
                },
                autoUpload: false,
            },
            selectV2: {
                t: 'select-v2',
                label: '虚下拉框',
                // style: { width: '240px' },
                placeholder: '虚拟列表下拉框',
                options: [
                    { label: '第一', value: '1' },
                    { label: '第二', value: '2' },
                    { label: '第三', value: '3' },
                ],
            },
            color: {
                t: 'color-picker',
                label: '颜色',
                showAlpha: true,
                colorFormat: 'hsl',
            },
            num: {
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
            switch: {
                t: 'switch',
                label: '切换器',
                activeValue: '1',
                inactiveValue: '0',
                defaultValue: '0',
            },
            time: {
                t: 'time-picker',
                label: '时间',
                placeholder: '快选择时间',
            },
            timeSelect: {
                t: 'time-select',
                label: '时2',
                placeholder: '时间二',
                // style: { width: '160px' },
            },
            input1: {
                t: 'input',
                label: 'input1',
                placeholder: '哈哈哈',
                itemSlots: {
                    append: ({ plain, onChange }) => {
                        return (
                            <div style="cursor: pointer;" onClick={() => onChange('234')}>
                                点我
                            </div>
                        );
                    },
                },
            },
            input2: {
                t: 'input',
                label: 'input2222',
                placeholder: '666',
                rules: [{ required: true, message: '必填项' }],
            },
            select1: {
                t: 'select',
                label: 'sel1',
                placeholder: '哈哈哈',
                options: [
                    { label: '第一', value: '1' },
                    { label: '第二', value: '2' },
                    { label: '第三', value: '3' },
                ],
            },
            select2: {
                t: 'select',
                label: 'sel2',
                placeholder: 'test',
                labelKey: 'dictLabel',
                valueKey: 'dictValue',
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
            datepikcer1: {
                t: 'date-picker',
                label: 'date1',
                placeholder: 'fff',
                // format: 'MM-DD',
                // valueFormat: 'YYYY-MM-DD',
            },
            date11: {
                t: 'date-picker',
                type: 'daterange',
                label: 'date2',
                fields: ['date11', 'date22'],
                placeholder: '999',
                startPlaceholder: '起',
                endPlaceholder: '止',
                rules: [{ required: true, message: '必填项' }],
            },
            tree: {
                t: 'tree-select',
                label: 'tree',
                placeholder: '999',
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
            checkGroup1: {
                t: 'checkbox-group',
                label: 'che-g1',
                type: 'button',
                options: [
                    { label: 'check1', value: 'check1' },
                    { label: 'check2', value: 'check2' },
                ],
            },
            checkGroup2: {
                t: 'checkbox-group',
                label: 'che-g2',
                rules: [{ required: true, message: '必填项' }],
                getOptions(cb) {
                    setTimeout(() => {
                        cb([
                            { label: 'che1', value: 'che1' },
                            { label: 'che2', value: 'che2' },
                        ]);
                    }, 1000);
                },
            },
            check: {
                t: 'checkbox',
                label: '多选框',
                staticProps: { label: '男生' },
                // type: 'button',
                trueValue: '1',
                falseValue: '2',
                defaultValue: '1',
                rules: [{ required: true, message: '必填项' }],
            },
            radioGroup1: {
                t: 'radio-group',
                label: 'radio-group1',
                type: 'button',
                options: [
                    { label: 'radio1', value: 'radio1' },
                    { label: 'radio2', value: 'radio2' },
                ],
            },
            radioGroup2: {
                t: 'radio-group',
                label: 'rdg-cancel',
                rules: [{ required: true, message: '必填项' }],
                cancelable: true,
                getOptions(cb) {
                    setTimeout(() => {
                        cb([
                            { label: 'rad1', value: 'rad1' },
                            { label: 'rad2', value: 'rad2' },
                        ]);
                    }, 1000);
                },
            },
            radio1: {
                t: 'radio',
                label: 'radio',
                value: '1',
                staticProps: { label: '男生' },
                // type: 'button',
                // initialValue: '1',
            },
            radio2: {
                t: 'radio',
                label: '单选框可取消',
                value: '1',
                staticProps: { label: '女生' },
                // type: 'button',
                cancelable: true,
                initialValue: '1',
            },
            aite: {
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
        }),
    };
}
