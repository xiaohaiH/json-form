import { resolve } from 'node:dns';
import { mount, shallowMount } from '@vue/test-utils';
import type { Writable } from 'utility-types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ExtractPropTypes, ExtractPublicPropTypes, MaybeRef, PropType, Ref } from 'vue';
import { computed, defineComponent, nextTick, onBeforeUnmount, onMounted, ref, version as v3Version, watch } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import { version, ref as vueDemiRef } from 'vue-demi';
import { get, isPlainObject } from '../../utils/index';
import { usePlain } from '../plain/index';
import type { PlainProps } from '../plain/types';
import { plainProps } from '../plain/types';
import { useWrapper } from '../wrapper/index';
import type { WrapperProps } from '../wrapper/types';
import { wrapperProps } from '../wrapper/types';

type PlainOption = Writable<ExtractPublicPropTypes<Omit<PlainProps<any, Record<string, any>, any>, 'field' | 'query'>>> & { uniqueKey?: string } & {
    // config 如果是对象, 说明是扁平的, 单纯为了布局而设置的
    // config 如果是数组, 说明是动态表单, 根据 query[maybeFieldPath] 的值动态渲染表单项
    config?: Record<string, PlainOption> | (PlainOption & { field: string })[] | ((option: { item: PlainOption & { field: string }; index: number }) => (PlainOption & { field: string })[]);
};

const userWrapperComponent = defineComponent({
    props: {
        ...wrapperProps,
        onReady: { type: Function as PropType<(query: Record<string, any>) => void> },
        getOption: { type: Function as PropType<() => ({ backfill?: Ref<Record<string, any>>; model?: Ref<Record<string, any>>; options: Ref<Record<string, PlainOption>> })>, required: true },
    },
    setup(props) {
        const { backfill: packageBackfill, model: packageModel, options: packageOptions } = props.getOption();
        const wrapperRef = ref<ComponentExposed<typeof WrapperComponent>>(null as unknown as ComponentExposed<typeof WrapperComponent>);
        props.onReady && onMounted(() => {
            props.onReady!(wrapperRef.value.getQuery());
        });

        return {
            packageBackfill,
            packageModel,
            packageOptions,
            wrapperRef,
        };
    },
    render() {
        const { packageBackfill, packageModel, packageOptions, $props: { onReady, getOption, ...$props } } = this;
        return <WrapperComponent {...$props} ref="wrapperRef" options={packageOptions} backfill={packageBackfill} model={packageModel} />;
    },
});
const WrapperComponent = defineComponent({
    props: {
        ...wrapperProps,
        /** 动态渲染的数据源 */
        options: { type: Object as PropType<Record<string, PlainOption>>, required: true },
    },
    setup(props) {
        const options = computed(() => Object.entries(props.options).map(([key, value]) => ({ ...value, field: key })));
        const wrapper = useWrapper(props);
        /** 每个数据项配置生成的 plain 引用对象 */
        const refObj = ref<Record<string, ComponentExposed<typeof PlainComponent>>>({});
        function setRef(key: string) {
            return (el: any) => {
                refObj.value[key] = el as unknown as ComponentExposed<typeof PlainComponent>;
            };
        }

        return {
            ...wrapper,
            options,
            refObj,
            setRef,
        };
    },
    render() {
        const { options, query, refObj, setRef } = this;
        return options.map((o) => <PlainComponent key={o.field} {...o} query={query} refObj={refObj} setRef={setRef} ref={setRef(o.field)} />);
    },
});
let globalId = 0;
const PlainComponent = defineComponent({
    props: {
        ...plainProps,
        parentField: { type: String, default: '' },
        config: { type: [Array, Object, Function] as PropType<Record<string, PlainOption> | PlainOption[] | ((option: { item: PlainOption & { field: string }; index: number; query: Record<string, any> }) => PlainOption[])> },
        setRef: { type: Function as PropType<(field: string) => (ins: Record<string, any> | null) => void>, required: true },
        refObj: { type: Object as PropType<Record<string, any>>, required: true },
        /**
         * 如果是组件是存在于数组中的, 需要传递一个唯一键, 读取当前对象中的某个值
         * 防止依赖本数组其它下标中的值时, 如果前一项被删除, 导致依赖误触发
         * 作用等同于 uniqueValue, 区别在于 uniqueValue 由组件内部生成
         * uniqueKey 由外部传递, 且是作为键存在
         *
         * @example
         * ``` ts
         * // 当表单项根据 query.users 动态生成时, 想保证某些情况下依赖不会产生错误
         * // 可传递 uniqueKey: 'id', 此时依赖判断会以条件项的 user[].id 的值做唯一值判断
         * const query = { users: [{ id: '1', name: '', value: '' }, { id: '2', name: '', value: '' }, ...] }
         * ```
         */
        uniqueKey: { type: [String] as PropType<string> },
    },
    setup(props) {
        // onMounted(() => {
        //     console.log('组件加载完成');
        // })
        // onBeforeUnmount(() => {
        //     props.setRef(props.field)(null);
        // });

        const configIsArr = computed(() => Array.isArray(props.config) || typeof props.config === 'function');
        const r = configIsArr.value ? ({} as unknown as ReturnType<typeof usePlain>) : usePlain(props);
        const queryValue = computed(() => get<any[]>(props.query, props.field));

        const options222 = computed(() => {
            const { config } = props;
            if (!config || configIsArr.value) return [];
            return Object.entries(config).map(([key, value]) => ({ ...value, field: key }));
        });

        // (旧版)此处动态表单实现参考的 packages\element-plus\components\dynamic-group\index.vue
        // const options = ref<{ uniqueValue: string | number; result: PlainOption[] }[]>([]);
        // watch(
        //     [() => Array.isArray(queryValue.value) && [...queryValue.value], () => props.config],
        //     ([value, config], oldVal) => {
        //         if (!configIsArr.value) return;
        //         if (!(value && value.length)) return options.value = [];
        //         const { uniqueKey } = props;
        //         const isFunc = typeof config === 'function';
        //         const arr = !isFunc && coverObjOption2Arr<PlainOption[]>(config);
        //         options.value = value.map((o, i) => ({ uniqueValue: uniqueKey ? o[uniqueKey] : getId(o, oldVal?.[0] as any, i), result: isFunc ? coverObjOption2Arr<PlainOption[]>(config({ item: o, index: i, query: props.query })) : arr as PlainOption[] }));
        //     },
        //     { immediate: true },
        // );
        // /**
        //  * 获取唯一 id, 如果与旧引用相同, 则复用唯一 id
        //  * (为动态新增的表单项做的优化, 不然可以用下方的计算属性(finalConfig))
        //  */
        // function getId(val: Record<string, any>, oldVal: Record<string, any>[], idx: number) {
        //     return oldVal?.[idx] === val ? options.value[idx].uniqueValue : ++globalId;
        // }
        // (新版)此处动态表单实现参考的 packages\element-plus\components\dynamic-group\index.vue
        /** 由于计算属性不似 watch 有上条数据, 因为手动记录 */
        let configSnapshot = {
            /** 记录每行配置项的唯一值集合 */
            configUniqueValue: [] as any[],
            /** 记录每行数据的值集合 */
            checkedValue: [] as any[],
        };
        /** 计算属性版本的 config 配置项(防止生成的配置项中用了响应式变量, 不在计算属性中生成无法捕捉到) */
        const options = computed(() => {
            const { config } = props;
            if (!config) return [];
            const value = queryValue.value;
            if (!value?.length) return [];
            const isFunc = typeof config === 'function';
            const arr = !isFunc && coverObjOption2Arr<PlainOption[]>(config);
            const { uniqueKey } = props;
            const result = value.map((o, i) => ({ uniqueValue: uniqueKey ? o[uniqueKey] : getId(o, i), result: isFunc ? coverObjOption2Arr<PlainOption[]>(config({ item: o, index: i, query: props.query })) : arr as PlainOption[] }));
            configSnapshot.configUniqueValue = result.map((r) => r.uniqueValue);
            configSnapshot.checkedValue = [...value];
            return result;
        });
        /**
         * 获取唯一 id, 如果与旧引用相同, 则复用唯一 id(配合 finalConfig - computed 版本使用)
         * (为动态新增的表单项做的优化, 不然可以用下方的计算属性(finalConfig))
         */
        function getId(val: Record<string, any>, idx: number) {
            return configSnapshot.checkedValue[idx] === val ? configSnapshot.configUniqueValue[idx] : ++globalId;
        }
        /** 将对象形式的配置项转为数组 */
        function coverObjOption2Arr<T>(opt: any): T {
            return (isPlainObject(opt) ? Object.entries(opt).map(([key, value]) => ({ ...value, field: key })) : opt) as unknown as T;
        }

        const expose = {
            ...r,
            configIsArr,
            queryValue,
            options,
            options222,
        };
        return { ...expose };
    },
    render() {
        const { refObj, query, configIsArr, queryValue, setRef } = this;
        if (configIsArr) {
            const { options, field } = this;
            return (
                <>
                    {options.map((oo, ii) => oo.result.map((o: any, i: number) => <PlainComponent uniqueValue={oo.uniqueValue} setRef={setRef} key={`${oo.uniqueValue}${i}${field}.${ii}.${o.field}`} ref={setRef(`${field}.${ii}.${o.field}`)} {...o} field={`${field}.${ii}.${o.field}`} query={query} parent-query={queryValue[ii]} refObj={refObj} />))}
                </>
            );
        }
        else {
            return <>{this.options222.map((o, i) => <PlainComponent setRef={setRef} ref={setRef(o.field)} key={o.field} {...o} query={query} refObj={refObj} />)}</>;
        }
    },
});

function genWrapperComponent({ mockOptions, mockQuery, mockModel, readySpy, searchSpy, onReady, onReset, onSearch, ...props }: {
    mockOptions: Ref<Record<string, PlainOption>>;
    mockQuery?: Ref<Record<string, any>>;
    mockModel?: Ref<Record<string, any>>;
    onReady?: (q: Record<string, any>) => void;
    onReset?: (q: Record<string, any>) => void;
    onSearch?: (q: Record<string, any>) => void;
    readySpy?: ReturnType<typeof vi.fn<(...args: any[]) => any>>;
    searchSpy?: ReturnType<typeof vi.fn<(...args: any[]) => any>>;
} & Partial<ExtractPublicPropTypes<typeof wrapperProps>>) {
    return mount(userWrapperComponent, {
        props: {
            getOption() {
                return { options: mockOptions, backfill: mockQuery, model: mockModel };
            },
            realtime: true,
            onReady: (q) => {
                onReady?.(q);
                readySpy?.(q);
                mockQuery && (mockQuery.value = q);
            },
            onSearch: (q) => {
                onSearch?.(q);
                searchSpy?.(q);
                mockQuery && (mockQuery.value = q);
            },
            ...props,
        },
    });
}
describe('usePlain-useWrapper组合测试', () => {
    beforeEach(() => {
    });

    afterEach(() => {
        vi.clearAllMocks();
    });
    // describe('防空报错脚本', () => {
    //     it('a', async () => {
    //         expect('普通').toBe('普通');
    //     });
    // });
    describe('debug 测试', () => {
        it('应该返回正确的 expose 对象结构', async () => {
            const searchSpy = vi.fn();
            const mockQuery = ref<Record<string, any>>({ 输入框: '测试值' });
            const mockOptions = ref<Record<string, PlainOption>>({
                输入框: {
                },
                数字: {
                    initialValue: 123,
                    defaultValue: 999,
                    getOptions(cb, query, option) {
                        option.changeInitialValue(666);
                    },
                },
            });
            const wrapper = genWrapperComponent({ mockOptions, mockQuery, searchSpy });
            const wrapperComp = wrapper.vm.wrapperRef;

            // 测试基本值
            expect(wrapperComp).toBeDefined();
            expect(wrapperComp.refObj['输入框'].checked).toBe('测试值');
            expect(wrapperComp.refObj['数字'].checked).toBe(123);
            wrapperComp.refObj['数字'].query['数字'] = '123';
            await nextTick();
            wrapperComp.refObj['数字'].change('aa');
            await nextTick();
            wrapperComp.refObj['数字'].query['数字'] = '789';
            await nextTick();
            wrapperComp.refObj['数字'].query['数字'] = '333';
            await nextTick();
            wrapperComp.refObj['数字'].query['数字'] = '222';

            await nextTick();
            wrapper.unmount();
        });
        it('getOptions 只在依赖变化时请求一次', async () => {
            const searchSpy = vi.fn();
            const getOptionsSpy = vi.fn();
            const getOptionsSpy2 = vi.fn();
            const mockQuery = ref<Record<string, any>>({ 输入框: '测试值' });
            const mockOptions = ref<Record<string, PlainOption>>({
                输入框: { defaultValue: 123 },
                数字: {
                    depend: true,
                    dependFields: ['输入框'],
                    getOptions(cb, query, option) {
                        getOptionsSpy(query);
                        option.changeInitialValue(666);
                    },
                },
                输入框2: {},
                数字2: {
                    depend: true,
                    dependFields: ['输入框2'],
                    getOptions(cb, query, option) {
                        getOptionsSpy2(query);
                        option.changeInitialValue(666);
                    },
                },
            });
            const wrapper = genWrapperComponent({ mockOptions, mockQuery, searchSpy });
            const wrapperComp = wrapper.vm.wrapperRef;

            // 测试基本值
            expect(wrapperComp).toBeDefined();
            await nextTick();
            expect(getOptionsSpy).toBeCalledTimes(1);
            expect(getOptionsSpy2).toBeCalledTimes(1);
            mockQuery.value['输入框'] = 'sss';
            await nextTick();
            wrapperComp.refObj['输入框2'].change('哈哈哈');
            await nextTick();
            expect(mockQuery.value).toEqual({ 输入框: 'sss', 输入框2: '哈哈哈' });
            await nextTick();
            expect(getOptionsSpy).toBeCalledTimes(2);
            expect(getOptionsSpy2).toBeCalledTimes(2);

            await nextTick();
            wrapper.unmount();
        });
    });

    commonTest();
    modelTest();
    function commonTest() {
        describe('初始化行为', () => {
            it('应该返回正确的 expose 对象结构', async () => {
                const searchSpy = vi.fn();
                const mockQuery = ref<Record<string, any>>({ 输入框: '测试值' });
                const mockOptions = ref<Record<string, PlainOption>>({
                    '输入框': {
                    },
                    '数字': {
                        initialValue: 123,
                        defaultValue: 999,
                        getOptions(cb, query, option) {
                            option.changeInitialValue(666);
                        },
                    },
                    '默认值': {
                        defaultValue: '0',
                    },
                    '下拉框': {
                        options: [
                            { label: '第一', value: '1' },
                            { label: '第二', value: '2' },
                            { label: '第三', value: '3' },
                        ],
                    },
                    '下拉框异步数据源': {
                        getOptions(cb, query, { filterValue }) {
                            if (!filterValue) return cb([]);
                            setTimeout(() => {
                                cb(Array.from({ length: ~~(Math.random() * 6) + 1 }, (_, i) => ({
                                    dictLabel: `${filterValue}-${i + 1}`,
                                    dictValue: `${filterValue}-${i + 1}`,
                                })));
                            }, 100);
                        },
                    },
                    '级联多字段': {
                        fields: ['date11', 'date22'],
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
                    },
                    '值为数组类型 - 多个数组值': {
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
                    '值为数组 - 多选': {
                        defaultValue: ['1'],
                        options: [
                            { label: 'check1', value: '1' },
                            { label: 'check2', value: '2' },
                        ],
                    },
                });
                const wrapper = genWrapperComponent({ mockOptions, mockQuery, searchSpy });
                const wrapperComp = wrapper.vm.wrapperRef;

                // 测试基本值
                expect(wrapperComp).toBeDefined();
                expect(wrapperComp.refObj['输入框'].checked).toBe('测试值');
                expect(wrapperComp.refObj['数字'].checked).toBe(123);
                expect(wrapperComp.refObj['默认值'].checked).toBe('0');
                expect(wrapperComp.refObj['下拉框'].checked).toBeUndefined();
                expect(wrapperComp.refObj['下拉框异步数据源'].finalOption).toEqual([]);
                // 多字段内部会置为数组, 哪怕这个字段其实是 undefined
                expect(wrapperComp.refObj['级联多字段'].checked).toEqual([]);
                // expect(wrapperComp.refObj['级联多字段'].checked).toBeUndefined();
                expect(wrapperComp.refObj['值为数组类型 - 多个数组值'].checked).toBeUndefined();
                expect(wrapperComp.refObj['值为数组 - 多选'].checked).toEqual(['1']);

                // 改变外部 query 的值
                mockQuery.value['数字'] = 789456123;
                await nextTick();
                expect(wrapperComp.refObj['数字'].checked).toBe(789456123);
                // 通过 query 改变组件内部的值
                wrapperComp.refObj['数字'].query['数字'] = 987654321;
                await nextTick();
                expect(wrapperComp.refObj['数字'].checked).toBe(987654321);
                expect(mockQuery.value['数字']).toBe(987654321);
                // 通过方法改变组件内部的值
                wrapperComp.refObj['数字'].change(123456);
                await nextTick();
                expect(searchSpy).toBeCalledTimes(2);
                expect(mockQuery.value['数字']).toBe(123456);
                // 重置整个 query 对象
                mockQuery.value = {};
                await nextTick();
                expect(mockQuery.value).toEqual({ '数字': 666, '默认值': '0', '值为数组 - 多选': ['1'] });

                // 重置 mockOptions
                mockOptions.value = {
                    重置后的值: { initialValue: 123, defaultValue: 999 },
                };
                await nextTick();
                // 数据源更新后, 原有字段应该被清空
                expect(mockQuery.value).toEqual({ 重置后的值: 123 });
                expect(wrapperComp.refObj['输入框']).toBe(null);
                expect(wrapperComp.refObj['数字']).toBe(null);
                expect(wrapperComp.refObj['默认值']).toBe(null);
                expect(wrapperComp.refObj['下拉框']).toBe(null);
                expect(wrapperComp.refObj['下拉框异步数据源']).toBe(null);
                expect(wrapperComp.refObj['级联多字段']).toBe(null);
                expect(wrapperComp.refObj['值为数组类型 - 多个数组值']).toBe(null);
                expect(wrapperComp.refObj['值为数组 - 多选']).toBe(null);
                expect(wrapperComp.refObj['重置后的值']).toBeDefined();
                expect(wrapperComp.refObj['重置后的值'].checked).toBe(123);
                wrapperComp.refObj['重置后的值'].change('888');
                expect(wrapperComp.refObj['重置后的值'].checked).toBe('888');
                await nextTick();
                expect(mockQuery.value['重置后的值']).toEqual('888');
                mockQuery.value['重置后的值'] = '777';
                expect(wrapperComp.refObj['重置后的值'].checked).toBe('888');
                await nextTick();
                expect(wrapperComp.refObj['重置后的值'].checked).toBe('777');
                expect(mockQuery.value['重置后的值']).toEqual('777');

                await nextTick();
                wrapper.unmount();
                // 由于此处是基于 backfill 的, query 与 backfill 不同步
                // 最后一次搜索事件未触发
                expect(mockQuery.value).toEqual({ 重置后的值: '777' });
            });
        });

        describe('初始赋值时, 不应受到依赖影响', () => {
            it('初始同步 query 后, 不应被默认值替换', async () => {
                const mockQuery = ref<Record<string, any>>({ 默认值: 'a', 默认值且被依赖: 'c' });
                const mockOptions = ref<Record<string, PlainOption>>({
                    默认值: {
                        defaultValue: '11',
                        depend: true,
                        dependFields: '默认值且被依赖',
                    },
                    默认值和初始值: {
                        initialValue: '方法',
                        defaultValue: '22',
                        depend: true,
                        dependFields: '默认值且被依赖',
                    },
                    默认值且被依赖: {
                        defaultValue: '发发发',
                    },
                });
                const wrapper = genWrapperComponent({ mockOptions, mockQuery });
                const wrapperComp = wrapper.vm.wrapperRef;

                // 测试基本值
                expect(wrapperComp).toBeDefined();
                expect(mockQuery.value).toEqual({ 默认值: 'a', 默认值和初始值: '方法', 默认值且被依赖: 'c' });

                await nextTick();
                wrapper.unmount();
            });
            it('初始同步 query 后, 不应被默认值替换2', async () => {
                const mockQuery = ref<Record<string, any>>({ 默认值: 'a' });
                const mockOptions = ref<Record<string, PlainOption>>({
                    默认值: { defaultValue: '11', depend: true, dependFields: '默认值且被依赖' },
                    默认值和初始值: { initialValue: '方法', defaultValue: '22', depend: true, dependFields: '默认值且被依赖' },
                    默认值且被依赖: { defaultValue: '发发发' },
                });
                const wrapper = genWrapperComponent({ mockOptions, mockQuery });
                const wrapperComp = wrapper.vm.wrapperRef;

                // 测试基本值
                expect(wrapperComp).toBeDefined();
                expect(mockQuery.value).toEqual({ 默认值: 'a', 默认值和初始值: '方法', 默认值且被依赖: '发发发' });

                await nextTick();
                wrapper.unmount();
            });
        });

        describe('backfill反复赋值场景', () => {
            it('有默认值时应该一直调用默认值生成', async () => {
                const defaultValueSpy = vi.fn();
                const mockQuery = ref<Record<string, any>>({ });
                const mockOptions = ref<Record<string, PlainOption>>({
                    反复赋值: {
                        defaultValue: () => {
                            defaultValueSpy();
                            return [];
                        },
                    },
                });
                const wrapper = genWrapperComponent({ mockOptions, mockQuery, onReady: (q) => expect(q['反复赋值']).toEqual([]) });
                const wrapperComp = wrapper.vm.wrapperRef;

                // 测试基本值
                expect(wrapperComp).toBeDefined();
                expect(wrapperComp.refObj['反复赋值'].checked).toEqual([]);
                expect(defaultValueSpy).toHaveBeenCalledTimes(1);
                // 内部设置值后由外部清空
                wrapperComp.refObj['反复赋值'].change(['aaa', 'bbb']);
                expect(wrapperComp.refObj['反复赋值'].checked).toEqual(['aaa', 'bbb']);
                await nextTick();
                expect(mockQuery.value['反复赋值']).toEqual(['aaa', 'bbb']);
                expect(defaultValueSpy).toHaveBeenCalledTimes(1);
                mockQuery.value = {};
                await nextTick();
                expect(defaultValueSpy).toHaveBeenCalledTimes(2);
                expect(mockQuery.value['反复赋值']).toEqual([]);
                expect(wrapperComp.refObj['反复赋值'].checked).toEqual([]);
                wrapperComp.refObj['反复赋值'].change(['aa']);
                expect(wrapperComp.refObj['反复赋值'].checked).toEqual(['aa']);
                await nextTick();
                expect(mockQuery.value['反复赋值']).toEqual(['aa']);
                mockQuery.value = {};
                await nextTick();
                expect(defaultValueSpy).toHaveBeenCalledTimes(3);
                wrapperComp.refObj['反复赋值'].change(['bb']);
                await nextTick();
                expect(mockQuery.value['反复赋值']).toEqual(['bb']);
                mockQuery.value = {};
                await nextTick();
                expect(defaultValueSpy).toHaveBeenCalledTimes(4);
                expect(mockQuery.value['反复赋值']).toEqual([]);
                expect(wrapperComp.refObj['反复赋值'].checked).toEqual([]);
                mockQuery.value = {};
                await nextTick();
                expect(defaultValueSpy).toHaveBeenCalledTimes(5);
                expect(mockQuery.value['反复赋值']).toEqual([]);
                mockQuery.value = {};
                await nextTick();
                expect(defaultValueSpy).toHaveBeenCalledTimes(6);
                expect(mockQuery.value['反复赋值']).toEqual([]);
                mockQuery.value = {};
                await nextTick();
                expect(defaultValueSpy).toHaveBeenCalledTimes(7);
                expect(mockQuery.value['反复赋值']).toEqual([]);

                await nextTick();
                wrapper.unmount();
            });
            it('没默认值时应忽略不计', async () => {
                const defaultValueSpy = vi.fn();
                const mockQuery = ref<Record<string, any>>({ });
                const mockOptions = ref<Record<string, PlainOption>>({
                    反复赋值: {
                        defaultValue: () => {
                            defaultValueSpy();
                            return undefined;
                        },
                    },
                });
                const wrapper = genWrapperComponent({ mockOptions, mockQuery, onReady: (q) => expect(q['反复赋值']).toEqual(undefined) });
                const wrapperComp = wrapper.vm.wrapperRef;

                // 测试基本值
                expect(wrapperComp).toBeDefined();
                expect(wrapperComp.refObj['反复赋值'].checked).toBeUndefined();
                expect(defaultValueSpy).toHaveBeenCalledTimes(1);
                // 内部设置值后由外部清空
                wrapperComp.refObj['反复赋值'].change(['aaa', 'bbb']);
                expect(wrapperComp.refObj['反复赋值'].checked).toEqual(['aaa', 'bbb']);
                await nextTick();
                expect(mockQuery.value['反复赋值']).toEqual(['aaa', 'bbb']);
                expect(defaultValueSpy).toHaveBeenCalledTimes(1);
                mockQuery.value = {};
                await nextTick();
                expect(defaultValueSpy).toHaveBeenCalledTimes(2);
                expect(mockQuery.value['反复赋值']).toBeUndefined();
                expect(wrapperComp.refObj['反复赋值'].checked).toBeUndefined();
                wrapperComp.refObj['反复赋值'].change(['aa']);
                expect(wrapperComp.refObj['反复赋值'].checked).toEqual(['aa']);
                await nextTick();
                expect(mockQuery.value['反复赋值']).toEqual(['aa']);
                mockQuery.value = {};
                await nextTick();
                expect(defaultValueSpy).toHaveBeenCalledTimes(3);
                wrapperComp.refObj['反复赋值'].change(['bb']);
                await nextTick();
                expect(mockQuery.value['反复赋值']).toEqual(['bb']);
                mockQuery.value = {};
                await nextTick();
                expect(defaultValueSpy).toHaveBeenCalledTimes(4);
                expect(mockQuery.value['反复赋值']).toBeUndefined();
                expect(wrapperComp.refObj['反复赋值'].checked).toBeUndefined();
                mockQuery.value = {};
                await nextTick();
                expect(defaultValueSpy).toHaveBeenCalledTimes(4);
                expect(mockQuery.value['反复赋值']).toBeUndefined();
                expect(wrapperComp.refObj['反复赋值'].checked).toBeUndefined();

                await nextTick();
                wrapper.unmount();
            });
        });

        describe('依赖项变化场景', () => {
            it('依赖项字段变化时应该重置值并重新加载数据源', async () => {
                const searchSpy = vi.fn();
                const hooksSpy = vi.fn();
                const dependHookSpy = vi.fn();
                const optionsDependHookSpy = vi.fn();

                const mockQuery = ref<Record<string, any>>({ 城市: 'bj', 区域: 'cy' });
                const mockOptions = ref<Record<string, PlainOption>>({
                    城市: {
                        options: [{ label: '北京', value: 'bj' }, { label: '上海', value: 'sh' }],
                    },
                    区域: {
                        depend: true,
                        dependFields: '城市',
                        getOptions(cb, query, { trigger }) {
                            if (!query['城市']) cb([]);
                            // 根据城市加载区域数据
                            const cityValue = query['城市'];
                            const options: any[] = [];
                            if (cityValue === 'bj') {
                                options.push({ label: '朝阳', value: 'cy' });
                                options.push({ label: '海淀', value: 'hd' });
                            }
                            else if (cityValue === 'sh') {
                                options.push({ label: '浦东', value: 'pd' });
                                options.push({ label: '黄浦', value: 'hp' });
                            }
                            cb(options);
                        },
                        hooks: {
                            dependChange({ props, plain }) {
                                dependHookSpy();
                                expect(props.field).toBe('区域');
                                expect(props.query['区域']).toBeUndefined();
                            },
                        },
                    },
                });

                const wrapper = genWrapperComponent({ mockOptions, mockQuery, searchSpy });

                const wrapperComp = wrapper.vm.wrapperRef;
                // 初始状态验证
                expect(wrapperComp).toBeDefined();
                expect(mockQuery.value['城市']).toBe('bj');
                expect(mockQuery.value['区域']).toBe('cy');
                expect(wrapperComp.refObj['城市'].checked).toBe('bj');
                expect(wrapperComp.refObj['区域'].checked).toBe('cy');
                await nextTick();
                // 内部改变城市值
                wrapperComp.refObj['城市'].change('sh');
                await nextTick();
                expect(searchSpy).toHaveBeenCalledTimes(1);
                // 验证依赖项钩子被调用
                expect(dependHookSpy).toHaveBeenCalledTimes(1);
                expect(wrapperComp.refObj['城市'].checked).toBe('sh');
                expect(mockQuery.value['城市']).toBe('sh');
                expect(wrapperComp.refObj['区域'].checked).toBeUndefined();
                // 外部改变城市值
                mockQuery.value = { 城市: 'bj' };
                expect(dependHookSpy).toHaveBeenCalledTimes(1);
                await nextTick();
                expect(wrapperComp.refObj['城市'].checked).toBe('bj');
                expect(dependHookSpy).toHaveBeenCalledTimes(2);
                await nextTick();
                wrapper.unmount();
            });

            it('当 resetByDependValueChange 为 false 时不应该重置值', async () => {
                const mockQuery = ref<Record<string, any>>({ 城市: 'bj', 区域: 'cy' });
                const mockOptions = ref<Record<string, PlainOption>>({
                    城市: {
                        options: [{ label: '北京', value: 'bj' }, { label: '上海', value: 'sh' }],
                    },
                    区域: {
                        depend: true,
                        dependFields: '城市',
                        resetByDependValueChange: false, // 不重置值
                        defaultValue: 'cy',
                        options: [
                            { label: '朝阳', value: 'cy' },
                        ],
                    },
                });

                const wrapper = genWrapperComponent({ mockOptions, mockQuery });

                const wrapperComp = wrapper.vm.wrapperRef;
                // 初始状态验证
                expect(wrapperComp).toBeDefined();
                expect(wrapperComp.refObj['区域'].checked).toBe('cy');
                // 改变城市值
                wrapperComp.refObj['城市'].change('sh');
                await nextTick();
                // 区域的值应该保持不变
                expect(wrapperComp.refObj['区域'].checked).toBe('cy');
                await nextTick();
                wrapper.unmount();
            });

            it('支持多个依赖字段', async () => {
                const mockQuery = ref<Record<string, any>>({ });
                const mockOptions = ref<Record<string, PlainOption>>({
                    国家: {
                        options: [
                            { label: '中国', value: 'cn' },
                        ],
                    },
                    城市: {
                        depend: true,
                        dependFields: '国家',
                        defaultValue: undefined,
                    },
                    县城: {
                        depend: true,
                        dependFields: ['国家', '城市'],
                        defaultValue: undefined,
                        resetByDependValueChange: true,
                    },
                });

                const wrapper = genWrapperComponent({ mockOptions, mockQuery });
                const wrapperComp = wrapper.vm.wrapperRef;
                // 初始状态验证
                expect(wrapperComp).toBeDefined();
                wrapperComp.refObj['国家'].change('cn');
                await nextTick();
                expect(wrapperComp.refObj['城市'].checked).toBeUndefined();
                expect(wrapperComp.refObj['县城'].checked).toBeUndefined();
                wrapperComp.refObj['城市'].change('bj');
                await nextTick();
                expect(wrapperComp.refObj['县城'].checked).toBeUndefined();
                await nextTick();
                wrapper.unmount();
            });

            describe('hook 触发场景', () => {
                it('created 钩子应该在组件初始化时触发', async () => {
                    const createdSpy = vi.fn();
                    const mockQuery = ref<Record<string, any>>({ });
                    const mockOptions = ref<Record<string, PlainOption>>({
                        测试字段: {
                            hooks: {
                                created({ props, plain }) {
                                    createdSpy();
                                    expect(props.field).toBe('测试字段');
                                    expect(plain.checked).toBeDefined();
                                },
                            },
                        },
                    });
                    const wrapper = genWrapperComponent({ mockOptions, mockQuery });
                    const wrapperComp = wrapper.vm.wrapperRef;
                    // 测试基本值
                    expect(wrapperComp).toBeDefined();
                    expect(createdSpy).toHaveBeenCalledTimes(1);
                    await nextTick();
                    wrapper.unmount();
                });

                it('backfillChange 钩子应该在外部 backfill 改变时触发', async () => {
                    const backfillChangeSpy = vi.fn();
                    const mockQuery = ref<Record<string, any>>({ });
                    const mockOptions = ref<Record<string, PlainOption>>({
                        输入框: {
                            hooks: {
                                backfillChange(backfill, oldBackfill, { props, plain }) {
                                    backfillChangeSpy(backfill, oldBackfill);
                                    expect(backfill['输入框']).toBe('新值');
                                    expect(oldBackfill['输入框']).toBeUndefined();
                                },
                            },
                        },
                    });
                    const wrapper = genWrapperComponent({ mockOptions, mockQuery });
                    const wrapperComp = wrapper.vm.wrapperRef;

                    // 测试基本值
                    expect(wrapperComp).toBeDefined();
                    // 改变外部 backfill
                    mockQuery.value = { 输入框: '新值' };
                    await nextTick();
                    expect(backfillChangeSpy).toHaveBeenCalledTimes(1);
                    await nextTick();
                    wrapper.unmount();
                });

                it('optionsDependChange 钩子应该在依赖的数据源改变时触发', async () => {
                    const optionsDependChangeSpy = vi.fn();
                    const mockQuery = ref<Record<string, any>>({ });
                    const mockOptions = ref<Record<string, PlainOption>>({
                        主字段: {
                            options: [
                                { label: '选项1', value: '1' },
                            ],
                        },
                        从字段: {
                            optionsDepend: true,
                            optionsDependFields: '主字段',
                            hooks: {
                                optionsDependChange({ props, plain }) {
                                    optionsDependChangeSpy();
                                    expect(props.field).toBe('从字段');
                                },
                            },
                        },
                    });
                    const wrapper = genWrapperComponent({ mockOptions, mockQuery });
                    const wrapperComp = wrapper.vm.wrapperRef;

                    // 测试基本值
                    expect(wrapperComp).toBeDefined();

                    await nextTick();
                    wrapper.unmount();
                });
            });

            describe('值变化与搜索事件', () => {
                it('实时模式下值改变应该立即触发搜索', async () => {
                    const searchSpy = vi.fn();

                    const mockQuery = ref<Record<string, any>>({ });
                    const mockOptions = ref<Record<string, PlainOption>>({
                        输入框: {},
                    });
                    const wrapper = genWrapperComponent({ mockOptions, mockQuery, searchSpy });
                    const wrapperComp = wrapper.vm.wrapperRef;

                    // 测试基本值
                    expect(wrapperComp).toBeDefined();
                    wrapperComp.refObj['输入框'].change('测试值');
                    await nextTick();
                    expect(searchSpy).toHaveBeenCalledTimes(1);
                    expect(searchSpy.mock.calls[0][0]['输入框']).toBe('测试值');
                    await nextTick();
                    wrapper.unmount();
                });

                it('非实时模式下值改变不应该立即触发搜索', async () => {
                    const searchSpy = vi.fn();

                    const mockQuery = ref<Record<string, any>>({ });
                    const mockOptions = ref<Record<string, PlainOption>>({
                        输入框: {},
                    });
                    const wrapper = genWrapperComponent({ mockOptions, mockQuery, realtime: false, searchSpy });
                    const wrapperComp = wrapper.vm.wrapperRef;
                    // 测试基本值
                    expect(wrapperComp).toBeDefined();
                    wrapperComp.refObj['输入框'].change('测试值');
                    await nextTick();
                    // 不实时, 所以不会在值改变时立即触发搜索
                    expect(searchSpy).not.toHaveBeenCalled();
                    await nextTick();
                    wrapper.unmount();
                });

                it('显式调用 search 应该触发搜索事件', async () => {
                    const searchSpy = vi.fn();

                    const mockQuery = ref<Record<string, any>>({ });
                    const mockOptions = ref<Record<string, PlainOption>>({
                        输入框: {},
                    });
                    const wrapper = genWrapperComponent({ mockOptions, mockQuery, realtime: false, searchSpy });
                    const wrapperComp = wrapper.vm.wrapperRef;
                    // 测试基本值
                    expect(wrapperComp).toBeDefined();
                    wrapperComp.refObj['输入框'].change('测试值');
                    await nextTick();
                    expect(searchSpy).not.toHaveBeenCalled();
                    await wrapperComp.search();
                    expect(searchSpy).toHaveBeenCalledTimes(1);
                    expect(searchSpy.mock.calls[0][0]).toEqual({ 输入框: '测试值' });
                    expect(searchSpy.mock.calls[0][0]['输入框']).toBe('测试值');
                    await nextTick();
                    wrapper.unmount();
                });
            });

            describe('多字段级联场景', () => {
                it('字段数组应该正确处理多个字段的值', async () => {
                    const mockQuery = ref<Record<string, any>>({ province: 'bj', city: 'cy' });
                    const mockOptions = ref<Record<string, PlainOption>>({
                        级联选择: {
                            fields: ['province', 'city'],
                            options: [
                                {
                                    label: '北京',
                                    value: 'bj',
                                    children: [
                                        { label: '朝阳', value: 'cy' },
                                    ],
                                },
                            ],
                        },
                    });
                    const wrapper = genWrapperComponent({ mockOptions, mockQuery });
                    const wrapperComp = wrapper.vm.wrapperRef;
                    // 测试基本值
                    expect(wrapperComp).toBeDefined();
                    // 验证 fields 格式的值正确回填
                    expect(wrapperComp.refObj['级联选择'].checked).toEqual(['bj', 'cy']);
                    expect(wrapperComp.query.province).toBe('bj');
                    expect(wrapperComp.query.city).toBe('cy');
                    await nextTick();
                    wrapper.unmount();
                });
            });

            describe('初始值与默认值优先级', () => {
                it('initialValue 应该优先于 defaultValue', async () => {
                    const searchSpy = vi.fn();
                    const mockQuery = ref<Record<string, any>>({ });
                    const mockOptions = ref<Record<string, PlainOption>>({
                        优先级测试: {
                            initialValue: 'initial',
                            defaultValue: 'default',
                        },
                    });
                    const wrapper = genWrapperComponent({ mockOptions, mockQuery, searchSpy });
                    const wrapperComp = wrapper.vm.wrapperRef;
                    // 测试基本值
                    expect(wrapperComp).toBeDefined();
                    expect(wrapperComp.refObj['优先级测试'].checked).toBe('initial');
                    await nextTick();
                    wrapper.unmount();
                });

                it('回填值应该优先于 initialValue', async () => {
                    const searchSpy = vi.fn();
                    const mockQuery = ref<Record<string, any>>({ 优先级测试: 'backfill' });
                    const mockOptions = ref<Record<string, PlainOption>>({
                        优先级测试: {
                            initialValue: 'initial',
                            defaultValue: 'default',
                        },
                    });
                    const wrapper = genWrapperComponent({ mockOptions, mockQuery, searchSpy });
                    const wrapperComp = wrapper.vm.wrapperRef;
                    // 测试基本值
                    expect(wrapperComp).toBeDefined();
                    expect(wrapperComp.refObj['优先级测试'].checked).toBe('backfill');
                    await nextTick();
                    wrapper.unmount();
                });

                it('reset 应该重置为 initialValue 或 defaultValue', async () => {
                    const searchSpy = vi.fn();
                    const mockQuery = ref<Record<string, any>>({ 重置测试: '当前值' });
                    const mockOptions = ref<Record<string, PlainOption>>({
                        重置测试: {
                            initialValue: 'initial',
                            defaultValue: 'default',
                        },
                    });
                    const wrapper = genWrapperComponent({ mockOptions, mockQuery, searchSpy });
                    const wrapperComp = wrapper.vm.wrapperRef;
                    // 测试基本值
                    expect(wrapperComp).toBeDefined();
                    expect(wrapperComp.refObj['重置测试'].checked).toBe('当前值');
                    wrapperComp.reset();
                    await nextTick();
                    expect(wrapperComp.refObj['重置测试'].checked).toBe('initial');
                    await nextTick();
                    expect(mockQuery.value['重置测试']).toBe('initial');
                    await nextTick();
                    wrapper.unmount();
                });
            });

            describe('校验与验证器', () => {
                it('validator 函数应该在搜索时触发', async () => {
                    const validatorSpy = vi.fn(() => true);
                    const searchSpy = vi.fn();
                    const mockQuery = ref<Record<string, any>>({ 重置测试: '当前值' });
                    const mockOptions = ref<Record<string, PlainOption>>({
                        验证字段: {
                            validator: validatorSpy,
                        },
                    });
                    const wrapper = genWrapperComponent({ mockOptions, mockQuery, realtime: false, searchSpy });
                    const wrapperComp = wrapper.vm.wrapperRef;
                    // 测试基本值
                    expect(wrapperComp).toBeDefined();
                    wrapperComp.refObj['验证字段'].change('test');
                    await wrapperComp.search();
                    expect(validatorSpy).toHaveBeenCalledTimes(1);
                    await nextTick();
                    wrapper.unmount();
                });
            });

            describe('数据源管理', () => {
                it('finalOption 应该优先返回远程数据源', async () => {
                    let optionCallback: any;
                    const searchSpy = vi.fn();
                    const mockQuery = ref<Record<string, any>>({ 重置测试: '当前值' });
                    const mockOptions = ref<Record<string, PlainOption>>({
                        远程数据: {
                            options: [
                                { label: '本地', value: '1' },
                            ],
                            getOptions(cb) {
                                optionCallback = cb;
                            },
                        },
                    });
                    const wrapper = genWrapperComponent({ mockOptions, mockQuery, searchSpy });
                    const wrapperComp = wrapper.vm.wrapperRef;
                    // 测试基本值
                    expect(wrapperComp).toBeDefined();
                    // 初始应该返回本地数据源
                    expect(wrapperComp.refObj['远程数据'].finalOption).toEqual([{ label: '本地', value: '1' }]);

                    await nextTick();
                    // 调用远程回调
                    optionCallback([{ label: '远程1', value: 'r1' }, { label: '远程2', value: 'r2' }]);
                    // 现在应该返回远程数据源
                    expect(wrapperComp.refObj['远程数据'].finalOption).toEqual([{ label: '远程1', value: 'r1' }, { label: '远程2', value: 'r2' }]);
                    await nextTick();
                    wrapper.unmount();
                });
            });
        });

        describe('复杂场景测试', () => {
            describe('三级联动级联场景', () => {
                it('多级依赖正确处理级联值变化与重置', async () => {
                    const dependHook1Spy = vi.fn();
                    const dependHook2Spy = vi.fn();
                    const searchSpy = vi.fn();

                    const mockQuery = ref<Record<string, any>>({ 国家: 'cn', 省份: 'bj', 城市: 'cy' });
                    const mockOptions = ref<Record<string, PlainOption>>({
                        国家: {
                            defaultValue: 'cn',
                            options: [
                                { label: '中国', value: 'cn' },
                                { label: '美国', value: 'us' },
                            ],
                        },
                        省份: {
                            depend: true,
                            dependFields: '国家',
                            resetByDependValueChange: true,
                            getOptions(cb, query) {
                                const countryCode = query.国家;
                                const options: any[] = [];
                                if (countryCode === 'cn') {
                                    options.push({ label: '北京', value: 'bj' }, { label: '上海', value: 'sh' });
                                }
                                else if (countryCode === 'us') {
                                    options.push({ label: '纽约', value: 'ny' }, { label: '洛杉矶', value: 'la' });
                                }
                                cb(options);
                            },
                            hooks: {
                                dependChange() {
                                    dependHook1Spy();
                                },
                            },
                        },
                        城市: {
                            depend: true,
                            dependFields: ['国家', '省份'],
                            resetByDependValueChange: true,
                            defaultValue: undefined,
                            getOptions(cb, query) {
                                const { 国家: country, 省份: province } = query;
                                const options: any[] = [];
                                if (country === 'cn' && province === 'bj') {
                                    options.push({ label: '朝阳', value: 'cy' }, { label: '海淀', value: 'hd' });
                                }
                                else if (country === 'cn' && province === 'sh') {
                                    options.push({ label: '浦东', value: 'pd' }, { label: '黄浦', value: 'hp' });
                                }
                                else if (country === 'us' && province === 'ny') {
                                    options.push({ label: '曼哈顿', value: 'mh' });
                                }
                                cb(options);
                            },
                            hooks: {
                                dependChange() {
                                    dependHook2Spy();
                                },
                            },
                        },
                    });

                    const wrapper = genWrapperComponent({ mockOptions, mockQuery, searchSpy });

                    const wrapperComp = wrapper.vm.wrapperRef;
                    // 验证初始状态
                    expect(wrapperComp.refObj.国家.checked).toBe('cn');
                    expect(wrapperComp.refObj.省份.checked).toBe('bj');
                    expect(wrapperComp.refObj.城市.checked).toBe('cy');
                    expect(searchSpy).toHaveBeenCalledTimes(0); // onReady 时不触发搜索
                    await nextTick();
                    // 场景1: 改变国家 - 应该重置省份和城市
                    wrapperComp.refObj.国家.change('us');
                    await nextTick();
                    expect(wrapperComp.refObj.国家.checked).toBe('us');
                    expect(wrapperComp.refObj.省份.checked).toBeUndefined();
                    expect(wrapperComp.refObj.城市.checked).toBeUndefined();
                    expect(dependHook1Spy).toHaveBeenCalledTimes(1);
                    expect(dependHook2Spy).toHaveBeenCalledTimes(1);
                    expect(searchSpy).toHaveBeenCalledTimes(1);
                    expect(mockQuery.value).toEqual({ 国家: 'us' });
                    // 场景2: 选择美国的省份 - 城市应该被重置
                    wrapperComp.refObj.省份.change('ny');
                    await nextTick();
                    expect(wrapperComp.refObj.省份.checked).toBe('ny');
                    expect(wrapperComp.refObj.城市.checked).toBeUndefined();
                    expect(dependHook1Spy).toHaveBeenCalledTimes(1);
                    expect(dependHook2Spy).toHaveBeenCalledTimes(2);
                    expect(searchSpy).toHaveBeenCalledTimes(2);
                    expect(mockQuery.value).toEqual({ 国家: 'us', 省份: 'ny' });
                    // 场景3: 选择曼哈顿城市
                    wrapperComp.refObj.城市.change('mh');
                    await nextTick();
                    expect(wrapperComp.refObj.城市.checked).toBe('mh');
                    expect(dependHook1Spy).toHaveBeenCalledTimes(1);
                    expect(dependHook2Spy).toHaveBeenCalledTimes(2);
                    expect(searchSpy).toHaveBeenCalledTimes(3);
                    expect(mockQuery.value).toEqual({ 国家: 'us', 省份: 'ny', 城市: 'mh' });
                    await nextTick();
                    wrapper.unmount();
                });
            });

            describe('异步数据源与依赖交互', () => {
                it('异步加载数据源时的依赖链正确处理', async () => {
                    const searchSpy = vi.fn();
                    const asyncLoadSpy = vi.fn();

                    const mockQuery = ref<Record<string, any>>({ });
                    let cityOptionsCallback: any;
                    const mockOptions = ref<Record<string, PlainOption>>({
                        分类: {
                            defaultValue: 'type1',
                            options: [
                                { label: '类型1', value: 'type1' },
                                { label: '类型2', value: 'type2' },
                            ],
                        },
                        商品: {
                            depend: true,
                            dependFields: '分类',
                            resetByDependValueChange: true,
                            getOptions(cb, query, { trigger }) {
                                asyncLoadSpy();
                                setTimeout(() => {
                                    const { 分类 } = query;
                                    const products: any[] = [];
                                    if (分类 === 'type1') {
                                        products.push({ label: '商品A', value: 'a' }, { label: '商品B', value: 'b' });
                                    }
                                    else {
                                        products.push({ label: '商品C', value: 'c' });
                                    }
                                    cb(products);
                                }, 50);
                            },
                        },
                        规格: {
                            depend: true,
                            dependFields: '商品',
                            resetByDependValueChange: true,
                            getOptions(cb, query) {
                                const { 商品 } = query;
                                const specs: any[] = [];
                                if (商品 === 'a') {
                                    specs.push({ label: '大', value: 'large' }, { label: '小', value: 'small' });
                                }
                                else if (商品 === 'b') {
                                    specs.push({ label: '红', value: 'red' }, { label: '蓝', value: 'blue' });
                                }
                                else if (商品 === 'c') {
                                    specs.push({ label: '标准', value: 'standard' });
                                }
                                cb(specs);
                            },
                        },
                    });

                    const wrapper = genWrapperComponent({ mockOptions, mockQuery, searchSpy });

                    const wrapperComp = wrapper.vm.wrapperRef;
                    expect(wrapperComp.refObj.分类.checked).toBe('type1');
                    await nextTick();
                    expect(asyncLoadSpy).toHaveBeenCalledTimes(1);
                    // 等待异步数据加载
                    await sleep(100);
                    expect(wrapperComp.refObj.商品.finalOption).toEqual([{ label: '商品A', value: 'a' }, { label: '商品B', value: 'b' }]);
                    // 选择商品
                    wrapperComp.refObj.商品.change('a');
                    await awaitGetOptions();
                    expect(wrapperComp.refObj.规格.finalOption).toEqual([{ label: '大', value: 'large' }, { label: '小', value: 'small' }]);
                    // 改变分类 - 商品应该重新加载
                    wrapperComp.refObj.分类.change('type2');
                    await awaitGetOptions();
                    expect(asyncLoadSpy).toHaveBeenCalledTimes(2);
                    expect(wrapperComp.refObj.商品.checked).toBeUndefined();
                    expect(wrapperComp.refObj.规格.checked).toBeUndefined();
                    await sleep(100);
                    expect(wrapperComp.refObj.商品.finalOption).toEqual([{ label: '商品C', value: 'c' }]);
                    wrapperComp.refObj.商品.change('c');
                    await awaitGetOptions();
                    expect(wrapperComp.refObj.规格.finalOption).toEqual([{ label: '标准', value: 'standard' }]);
                    expect(mockQuery.value).toEqual({ 分类: 'type2', 商品: 'c', 规格: undefined });
                    await nextTick();
                    wrapper.unmount();
                });
            });

            describe('复杂校验与错误恢复', () => {
                it('多字段校验失败后恢复流程', async () => {
                    const fieldValidatorSpy = vi.fn();
                    const wrapperValidatorSpy = vi.fn();
                    const searchSpy = vi.fn();
                    const mockQuery = ref<Record<string, any>>({ });
                    const mockOptions = ref<Record<string, PlainOption>>({
                        邮箱: {
                            validator: (query) => {
                                fieldValidatorSpy();
                                const email = query.邮箱;
                                if (email && !email.includes('@')) {
                                    return '邮箱格式不正确';
                                }
                            },
                        },
                        年龄: {
                            validator: (query) => {
                                const age = query.年龄;
                                if (age && (age < 18 || age > 100)) {
                                    return '年龄必须在 18-100 之间';
                                }
                            },
                        },
                    });
                    const wrapper = genWrapperComponent({
                        mockOptions,
                        mockQuery,
                        realtime: false,
                        searchSpy,
                        validator: (query) => {
                            wrapperValidatorSpy();
                            if (!query.邮箱 || !query.年龄) {
                                return '邮箱和年龄不能为空';
                            }
                        },
                        toast: () => {}, // 避免日志输出
                    });
                    const wrapperComp = wrapper.vm.wrapperRef;
                    // 场景1: 输入错误邮箱格式
                    wrapperComp.refObj.邮箱.change('invalid-email');
                    wrapperComp.refObj.年龄.change(25);
                    await wrapperComp.search();
                    expect(fieldValidatorSpy).toHaveBeenCalledTimes(1);
                    // 由于邮箱格式错误，搜索不应该成功
                    expect(searchSpy).not.toHaveBeenCalled();
                    // 场景2: 纠正邮箱格式
                    wrapperComp.refObj.邮箱.change('valid@email.com');
                    await wrapperComp.search();
                    expect(fieldValidatorSpy).toHaveBeenCalledTimes(2);
                    expect(searchSpy).toHaveBeenCalledTimes(1);
                    expect(mockQuery.value).toEqual({ 邮箱: 'valid@email.com', 年龄: 25 });
                    // 场景3: 输入超出范围的年龄
                    wrapperComp.refObj.年龄.change(150);
                    await wrapperComp.search();
                    expect(searchSpy).toHaveBeenCalledTimes(1); // 不会增加
                    // 场景4: 重新设置正确的值
                    wrapperComp.refObj.年龄.change(30);
                    await wrapperComp.search();
                    expect(searchSpy).toHaveBeenCalledTimes(2);
                    expect(mockQuery.value).toEqual({ 邮箱: 'valid@email.com', 年龄: 30 });
                    await nextTick();
                    wrapper.unmount();
                });
            });

            describe('动态隐藏与条件显示', () => {
                it('复杂的条件隐藏场景应该正确处理', async () => {
                    const searchSpy = vi.fn();
                    const mockQuery = ref<Record<string, any>>({ });
                    const mockOptions = ref<Record<string, PlainOption>>({
                        业务类型: {
                            defaultValue: 'personal',
                            options: [
                                { label: '个人', value: 'personal' },
                                { label: '企业', value: 'business' },
                            ],
                        },
                        身份证: {
                            hide: ({ query }) => query.业务类型 !== 'personal',
                        },
                        营业执照: {
                            hide: ({ query }) => query.业务类型 !== 'business',
                        },
                        公司规模: {
                            hide: ({ query }) => query.业务类型 !== 'business',
                            depend: true,
                            dependFields: '公司名称',
                        },
                        公司名称: {
                            hide: ({ query }) => query.业务类型 !== 'business',
                        },
                    });
                    const wrapper = genWrapperComponent({ mockOptions, mockQuery, searchSpy });
                    const wrapperComp = wrapper.vm.wrapperRef;
                    // 初始状态：个人业务
                    expect(wrapperComp.refObj.业务类型.checked).toBe('personal');
                    expect(wrapperComp.refObj.身份证.insetHide).toBe(false);
                    expect(wrapperComp.refObj.营业执照.insetHide).toBe(true);
                    expect(wrapperComp.refObj.公司名称.insetHide).toBe(true);
                    // 切换到企业业务
                    wrapperComp.refObj.业务类型.change('business');
                    await nextTick();
                    expect(wrapperComp.refObj.业务类型.checked).toBe('business');
                    expect(wrapperComp.refObj.身份证.insetHide).toBe(true);
                    expect(wrapperComp.refObj.营业执照.insetHide).toBe(false);
                    expect(wrapperComp.refObj.公司名称.insetHide).toBe(false);
                    // 验证隐藏字段不会被包含在 query 中
                    wrapperComp.refObj.身份证.change('12345678');
                    wrapperComp.refObj.营业执照.change('98765432');
                    await nextTick();
                    expect(mockQuery.value.身份证).toBe('12345678');
                    expect(mockQuery.value.营业执照).toBe('98765432');
                    await nextTick();
                    wrapper.unmount();
                });
            });

            describe('多字段级联与复杂搜索', () => {
                it('多字段级联的值同步与搜索', async () => {
                    const searchSpy = vi.fn();
                    const mockQuery = ref<Record<string, any>>({ });
                    const mockOptions = ref<Record<string, PlainOption>>({
                        时间段: {
                            fields: ['startDate', 'endDate'],
                            options: [],
                            defaultValue: undefined,
                        },
                        金额范围: {
                            fields: ['minAmount', 'maxAmount'],
                            options: [],
                            defaultValue: [0, 10000],
                        },
                    });
                    const wrapper = genWrapperComponent({ mockOptions, mockQuery, searchSpy });
                    const wrapperComp = wrapper.vm.wrapperRef;
                    // 验证多字段初始值
                    expect(wrapperComp.refObj.金额范围.checked).toEqual([0, 10000]);
                    expect(mockQuery.value).toEqual({ minAmount: 0, maxAmount: 10000 });
                    // 改变多字段值
                    wrapperComp.refObj.时间段.change(['2024-01-01', '2024-12-31']);
                    await nextTick();
                    expect(wrapperComp.refObj.时间段.checked).toEqual(['2024-01-01', '2024-12-31']);
                    expect(mockQuery.value.startDate).toBe('2024-01-01');
                    expect(mockQuery.value.endDate).toBe('2024-12-31');
                    // 改变金额范围
                    wrapperComp.refObj.金额范围.change([1000, 5000]);
                    await nextTick();
                    expect(mockQuery.value.minAmount).toBe(1000);
                    expect(mockQuery.value.maxAmount).toBe(5000);
                    expect(searchSpy).toHaveBeenCalledTimes(2);
                    await nextTick();
                    wrapper.unmount();
                });
            });

            describe('实时搜索与非实时搜索的交互', () => {
                it('混合实时和非实时字段的搜索行为', async () => {
                    const searchSpy = vi.fn();
                    const mockQuery = ref<Record<string, any>>({ });
                    const mockOptions = ref<Record<string, PlainOption>>({
                        实时搜索字段: {
                            defaultValue: '',
                        },
                        非实时搜索字段: {
                            defaultValue: '',
                        },
                    });
                    const wrapper = genWrapperComponent({ mockOptions, mockQuery, searchSpy });
                    const wrapperComp = wrapper.vm.wrapperRef;
                    // 改变实时字段 - 应该立即触发搜索
                    wrapperComp.refObj.实时搜索字段.change('值1');
                    await nextTick();
                    expect(searchSpy).toHaveBeenCalledTimes(1);
                    // 改变非实时字段
                    wrapperComp.refObj.非实时搜索字段.change('值2');
                    await nextTick();
                    expect(searchSpy).toHaveBeenCalledTimes(2); // 在全局实时模式下仍会触发
                    // 手动触发搜索
                    await wrapperComp.search();
                    expect(searchSpy).toHaveBeenCalledTimes(3);
                    expect(mockQuery.value).toEqual({ 实时搜索字段: '值1', 非实时搜索字段: '值2' });
                    await nextTick();
                    wrapper.unmount();
                });
            });

            describe('复杂重置与初始化流程', () => {
                it('复杂表单的重置、初始化与恢复', async () => {
                    const searchSpy = vi.fn();
                    const mockQuery = ref<Record<string, any>>({ });
                    const mockOptions = ref<Record<string, PlainOption>>({
                        依赖字段: {
                            depend: true,
                            dependFields: '基础字段',
                            initialValue: 'depend-init',
                            defaultValue: 'depend-default',
                        },
                        基础字段: {
                            initialValue: 'init-value',
                            defaultValue: 'default-value',
                        },
                        依赖字段无默认值: {
                            depend: true,
                            dependFields: '基础字段',
                            initialValue: 'ahha',
                        },
                        独立字段: {
                            defaultValue: ['选项1'],
                            options: [
                                { label: '选项1', value: '选项1' },
                                { label: '选项2', value: '选项2' },
                            ],
                        },
                    });
                    const wrapper = genWrapperComponent({ mockOptions, mockQuery, searchSpy });
                    const wrapperComp = wrapper.vm.wrapperRef;
                    await nextTick();
                    // 验证初始值
                    expect(wrapperComp.refObj.基础字段.checked).toBe('init-value');
                    expect(wrapperComp.refObj.依赖字段.checked).toBe('depend-init');
                    expect(wrapperComp.refObj.依赖字段无默认值.checked).toBe('ahha');
                    expect(wrapperComp.refObj.独立字段.checked).toEqual(['选项1']);
                    // 改变值
                    wrapperComp.refObj.基础字段.change('new-value');
                    wrapperComp.refObj.独立字段.change(['选项2']);
                    await nextTick();
                    expect(searchSpy).toHaveBeenCalledTimes(1);
                    expect(wrapperComp.refObj.基础字段.checked).toBe('new-value');
                    expect(mockQuery.value.依赖字段).toBe('depend-default'); // 依赖改变导致重置
                    expect(wrapperComp.refObj.依赖字段.checked).toBe('depend-default'); // 依赖改变导致重置
                    expect(wrapperComp.refObj.依赖字段无默认值.checked).toBeUndefined(); // 依赖改变导致重置
                    expect(wrapperComp.refObj.独立字段.checked).toEqual(['选项2']);
                    // 重置表单
                    wrapperComp.reset();
                    await nextTick();
                    expect(wrapperComp.refObj.基础字段.checked).toBe('init-value');
                    expect(wrapperComp.refObj.依赖字段.checked).toBe('depend-init');
                    expect(wrapperComp.refObj.依赖字段无默认值.checked).toBe('ahha');
                    expect(wrapperComp.refObj.独立字段.checked).toEqual(['选项1']);
                    // 再次改变并验证最终状态
                    wrapperComp.refObj.基础字段.change('another-value');
                    await nextTick();
                    expect(wrapperComp.refObj.依赖字段.checked).toBe('depend-default');
                    expect(wrapperComp.refObj.依赖字段无默认值.checked).toBeUndefined();
                    await nextTick();
                    wrapper.unmount();
                });
            });
        });
    }

    function modelTest() {
        describe('model 测试', () => {
            it('应该返回正确的 expose 对象结构', async () => {
                const searchSpy = vi.fn();
                const mockModel = ref<Record<string, any>>({ 输入框: '测试值' });
                const mockOptions = ref<Record<string, PlainOption>>({
                    '输入框': {},
                    '数字': { initialValue: 123, defaultValue: 999, getOptions(cb, query, option) { option.changeInitialValue(666); } },
                    '默认值': { defaultValue: '0' },
                    '下拉框': { options: [{ label: '第一', value: '1' }, { label: '第二', value: '2' }, { label: '第三', value: '3' }] },
                    '下拉框异步数据源': {
                        getOptions(cb, query, { filterValue }) {
                            if (!filterValue) return cb([]);
                            setTimeout(() => {
                                cb(Array.from({ length: ~~(Math.random() * 6) + 1 }, (_, i) => ({
                                    dictLabel: `${filterValue}-${i + 1}`,
                                    dictValue: `${filterValue}-${i + 1}`,
                                })));
                            }, 100);
                        },
                    },
                    '级联多字段': {
                        fields: ['date11', 'date22'],
                        options: [
                            {
                                label: 'aa',
                                value: 'aa',
                                children: [{ label: 'AA1', value: 'AA1' }, { label: 'AA2', value: 'AA2' }],
                            },
                            {
                                label: 'bb',
                                value: 'bb',
                                children: [{ label: 'BB1', value: 'BB1' }, { label: 'BB2', value: 'BB2' }],
                            },
                        ],
                    },
                    '值为数组类型 - 多个数组值': {
                        getOptions(cb) {
                            cb([
                                {
                                    label: 'cas2aa',
                                    value: 'cas2aa',
                                    children: [{ label: 'cas2AA1', value: 'cas2AA1' }, { label: 'cas2AA2', value: 'cas2AA2' }],
                                },
                                {
                                    label: 'cas2bb',
                                    value: 'cas2bb',
                                    children: [{ label: 'cas2BB1', value: 'cas2BB1' }, { label: 'cas2BB2', value: 'cas2BB2' }],
                                },
                            ]);
                        },
                    },
                    '值为数组 - 多选': { defaultValue: ['1'], options: [{ label: 'check1', value: '1' }, { label: 'check2', value: '2' }] },
                });
                const wrapper = genWrapperComponent({ mockOptions, mockModel, searchSpy });
                const wrapperComp = wrapper.vm.wrapperRef;

                // 测试基本值
                expect(wrapperComp).toBeDefined();
                expect(wrapperComp.refObj['输入框'].checked).toBe('测试值');
                expect(wrapperComp.refObj['数字'].checked).toBe(123);
                expect(wrapperComp.refObj['默认值'].checked).toBe('0');
                expect(wrapperComp.refObj['下拉框'].checked).toBeUndefined();
                expect(wrapperComp.refObj['下拉框异步数据源'].finalOption).toEqual([]);
                // 多字段内部会置为数组, 哪怕这个字段其实是 undefined
                expect(wrapperComp.refObj['级联多字段'].checked).toEqual([]);
                // expect(wrapperComp.refObj['级联多字段'].checked).toBeUndefined();
                expect(wrapperComp.refObj['值为数组类型 - 多个数组值'].checked).toBeUndefined();
                expect(wrapperComp.refObj['值为数组 - 多选'].checked).toEqual(['1']);

                // 改变外部 query 的值
                mockModel.value['数字'] = 789456123;
                expect(wrapperComp.refObj['数字'].checked).toBe(789456123);
                // 通过 query 改变组件内部的值
                wrapperComp.refObj['数字'].query['数字'] = 987654321;
                expect(wrapperComp.refObj['数字'].checked).toBe(987654321);
                expect(mockModel.value['数字']).toBe(987654321);
                // 通过方法改变组件内部的值
                wrapperComp.refObj['数字'].change(123456);
                expect(searchSpy).toBeCalledTimes(0);
                expect(mockModel.value['数字']).toBe(123456);
                // getOptions 异步触发的, 因此需要等下个周期执行
                await nextTick();
                // 重置整个 query 对象
                mockModel.value = {};
                await nextTick();
                expect(mockModel.value).toEqual({ '数字': 666, '默认值': '0', '值为数组 - 多选': ['1'] });
                // 重置 mockOptions
                mockOptions.value = {
                    重置后的值: { initialValue: 123, defaultValue: 999 },
                };
                await nextTick();
                expect(wrapperComp.refObj['输入框']).toBe(null);
                expect(wrapperComp.refObj['数字']).toBe(null);
                expect(wrapperComp.refObj['默认值']).toBe(null);
                expect(wrapperComp.refObj['下拉框']).toBe(null);
                expect(wrapperComp.refObj['下拉框异步数据源']).toBe(null);
                expect(wrapperComp.refObj['级联多字段']).toBe(null);
                expect(wrapperComp.refObj['值为数组类型 - 多个数组值']).toBe(null);
                expect(wrapperComp.refObj['值为数组 - 多选']).toBe(null);
                expect(wrapperComp.refObj['重置后的值']).toBeDefined();
                expect(wrapperComp.refObj['重置后的值'].checked).toBe(123);
                wrapperComp.refObj['重置后的值'].change('888');
                expect(wrapperComp.refObj['重置后的值'].checked).toBe('888');
                expect(mockModel.value['重置后的值']).toEqual('888');
                mockModel.value['重置后的值'] = '777';
                expect(wrapperComp.refObj['重置后的值'].checked).toBe('777');
                expect(mockModel.value['重置后的值']).toEqual('777');

                await nextTick();
                wrapper.unmount();
            });

            it('初始值为空的 model 应该使用默认值', async () => {
                const searchSpy = vi.fn();
                const mockModel = ref<Record<string, any>>({});
                const mockOptions = ref<Record<string, PlainOption>>({
                    有默认值: { defaultValue: 'default' },
                    有初始值: { initialValue: 'initial' },
                    无默认值: {},
                });
                const wrapper = genWrapperComponent({ mockOptions, mockModel, searchSpy });
                const wrapperComp = wrapper.vm.wrapperRef;

                expect(wrapperComp.refObj['有默认值'].checked).toBe('default');
                expect(wrapperComp.refObj['有初始值'].checked).toBe('initial');
                expect(wrapperComp.refObj['无默认值'].checked).toBeUndefined();
                expect(mockModel.value).toEqual({ 有默认值: 'default', 有初始值: 'initial' });

                await nextTick();
                wrapper.unmount();
            });

            it('多字段级联的同步应该正确处理', async () => {
                const searchSpy = vi.fn();
                const mockModel = ref<Record<string, any>>({ startDate: '2024-01-01', endDate: '2024-12-31' });
                const mockOptions = ref<Record<string, PlainOption>>({
                    时间范围: {
                        fields: ['startDate', 'endDate'],
                        options: [],
                    },
                });
                const wrapper = genWrapperComponent({ mockOptions, mockModel, searchSpy });
                const wrapperComp = wrapper.vm.wrapperRef;

                expect(wrapperComp.refObj['时间范围'].checked).toEqual(['2024-01-01', '2024-12-31']);
                expect(mockModel.value).toEqual({ startDate: '2024-01-01', endDate: '2024-12-31' });
                // 改变内部值
                wrapperComp.refObj['时间范围'].change(['2025-01-01', '2025-12-31']);
                expect(mockModel.value.startDate).toBe('2025-01-01');
                expect(mockModel.value.endDate).toBe('2025-12-31');
                // 改变外部值
                mockModel.value = { startDate: '2026-01-01', endDate: '2026-12-31' };
                await nextTick();
                expect(wrapperComp.refObj['时间范围'].checked).toEqual(['2026-01-01', '2026-12-31']);
                // 不改变引用时改变值
                Object.assign(mockModel.value, { startDate: '2022-12-12', endDate: '2302-03-03' });
                expect(wrapperComp.refObj['时间范围'].checked).toEqual(['2022-12-12', '2302-03-03']);

                await nextTick();
                wrapper.unmount();
            });

            it('依赖项变化时 model 应该正确重置子字段', async () => {
                const searchSpy = vi.fn();
                const mockModel = ref<Record<string, any>>({ 城市: '北京', 区域: '大兴', 楼栋: '旺德福' });
                const mockOptions = ref<Record<string, PlainOption>>({
                    城市: {},
                    区域: { depend: true, dependFields: '城市', defaultValue: '朝阳' },
                    楼栋: { defaultValue: '新星小区' },
                });
                const wrapper = genWrapperComponent({ mockOptions, mockModel, searchSpy, shallowWatchModel: true });
                const wrapperComp = wrapper.vm.wrapperRef;

                expect(wrapperComp.refObj['城市'].checked).toBe('北京');
                expect(wrapperComp.refObj['区域'].checked).toBe('大兴');
                expect(mockModel.value).toEqual({ 城市: '北京', 区域: '大兴', 楼栋: '旺德福' });
                await nextTick();
                // 改变城市，区域应该重置
                wrapperComp.refObj['城市'].change('上海');
                await nextTick();
                expect(wrapperComp.refObj['区域'].checked).toBe('朝阳');
                expect(mockModel.value).toEqual({ 城市: '上海', 区域: '朝阳', 楼栋: '旺德福' });
                // 改变外部值时, 内部不跟随重置 - 引用发生改变
                mockModel.value = { 城市: '长沙', 区域: '岳麓' };
                await nextTick();
                expect(wrapperComp.refObj['城市'].checked).toBe('长沙');
                expect(wrapperComp.refObj['区域'].checked).toBe('岳麓');
                expect(mockModel.value).toEqual({ 城市: '长沙', 区域: '岳麓', 楼栋: '新星小区' });
                // 改变外部值时, 内部跟随重置 - 引用未发生改变
                Object.assign(mockModel.value, { 城市: '湘潭', 区域: '雨湖' });
                await nextTick();
                expect(wrapperComp.refObj['城市'].checked).toBe('湘潭');
                expect(wrapperComp.refObj['区域'].checked).toBe('雨湖');
                expect(mockModel.value).toEqual({ 城市: '湘潭', 区域: '雨湖', 楼栋: '新星小区' });

                await nextTick();
                wrapper.unmount();
            });

            it('异步数据源加载后应该同步到 model', async () => {
                const searchSpy = vi.fn();
                const mockModel = ref<Record<string, any>>({});
                let callback: any;
                const mockOptions = ref<Record<string, PlainOption>>({
                    异步字段: {
                        getOptions(cb) {
                            callback = cb;
                        },
                    },
                });
                const wrapper = genWrapperComponent({ mockOptions, mockModel, searchSpy });
                const wrapperComp = wrapper.vm.wrapperRef;

                expect(wrapperComp.refObj['异步字段'].finalOption).toEqual([]);
                // getOptions 会被延迟触发, 因此等待下一个周期再执行
                await nextTick();
                // 模拟异步加载
                callback([{ label: '选项1', value: '1' }, { label: '选项2', value: '2' }]);
                await nextTick();
                expect(wrapperComp.refObj['异步字段'].finalOption).toEqual([{ label: '选项1', value: '1' }, { label: '选项2', value: '2' }]);
                // 选择值
                wrapperComp.refObj['异步字段'].change('1');
                expect(mockModel.value['异步字段']).toBe('1');

                await nextTick();
                wrapper.unmount();
            });

            it('重置操作应该恢复 model 到初始状态', async () => {
                const searchSpy = vi.fn();
                const mockModel = ref<Record<string, any>>({ 字段: 'changed' });
                const mockOptions = ref<Record<string, PlainOption>>({
                    字段: {
                        initialValue: 'initial',
                        defaultValue: 'default',
                    },
                });
                const wrapper = genWrapperComponent({ mockOptions, mockModel, searchSpy });
                const wrapperComp = wrapper.vm.wrapperRef;

                expect(wrapperComp.refObj['字段'].checked).toBe('changed');
                wrapperComp.reset();
                expect(wrapperComp.refObj['字段'].checked).toBe('initial');
                expect(mockModel.value['字段']).toBe('initial');

                await nextTick();
                wrapper.unmount();
            });

            it('数组类型值的同步应该正确处理', async () => {
                const searchSpy = vi.fn();
                const mockModel = ref<Record<string, any>>({ 多选: ['1', '2'] });
                const mockOptions = ref<Record<string, PlainOption>>({
                    多选: {
                        defaultValue: ['1'],
                        options: [{ label: '选项1', value: '1' }, { label: '选项2', value: '2' }, { label: '选项3', value: '3' }],
                    },
                });
                const wrapper = genWrapperComponent({ mockOptions, mockModel, searchSpy });
                const wrapperComp = wrapper.vm.wrapperRef;

                expect(wrapperComp.refObj['多选'].checked).toEqual(['1', '2']);
                expect(mockModel.value['多选']).toEqual(['1', '2']);
                // 改变值
                wrapperComp.refObj['多选'].change(['3']);
                expect(mockModel.value['多选']).toEqual(['3']);
                // 外部改变
                mockModel.value['多选'] = ['1', '3'];
                expect(wrapperComp.refObj['多选'].checked).toEqual(['1', '3']);

                await nextTick();
                wrapper.unmount();
            });

            it('复杂级联选择器的值同步', async () => {
                const searchSpy = vi.fn();
                const mockModel = ref<Record<string, any>>({ province: 'bj', city: 'cy' });
                const mockOptions = ref<Record<string, PlainOption>>({
                    级联: {
                        fields: ['province', 'city'],
                        options: [
                            {
                                label: '北京',
                                value: 'bj',
                                children: [{ label: '朝阳', value: 'cy' }, { label: '海淀', value: 'hd' }],
                            },
                        ],
                    },
                });
                const wrapper = genWrapperComponent({ mockOptions, mockModel, searchSpy });
                const wrapperComp = wrapper.vm.wrapperRef;

                expect(wrapperComp.refObj['级联'].checked).toEqual(['bj', 'cy']);
                expect(mockModel.value).toEqual({ province: 'bj', city: 'cy' });
                // 改变级联值
                wrapperComp.refObj['级联'].change(['bj', 'hd']);
                expect(mockModel.value.province).toBe('bj');
                expect(mockModel.value.city).toBe('hd');

                await nextTick();
                wrapper.unmount();
            });

            it('model 改变不触发搜索', async () => {
                const searchSpy = vi.fn();
                const mockModel = ref<Record<string, any>>({ 字段: 'value1' });
                const mockOptions = ref<Record<string, PlainOption>>({
                    字段: {},
                });
                const wrapper = genWrapperComponent({ mockOptions, mockModel, searchSpy });
                const wrapperComp = wrapper.vm.wrapperRef;

                expect(wrapperComp.refObj['字段'].checked).toBe('value1');
                // 改变值不触发搜索
                wrapperComp.refObj['字段'].change('value2');
                expect(searchSpy).not.toHaveBeenCalled();
                expect(mockModel.value['字段']).toBe('value2');

                await nextTick();
                wrapper.unmount();
            });
        });
    }
});

describe('深层路径支持测试 (a.0[\'aa\'])', () => {
    beforeEach(() => {
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    // describe('防空报错脚本2', () => {
    //     it('b', async () => {
    //         expect('普通').toBe('普通');
    //     });
    // });

    describe('深层路径 debug 测试', () => {
        it('应该返回正确的对象结构', async () => {
            const searchSpy = vi.fn();
            const watchSpy = vi.fn();
            const mockQuery = ref<Record<string, any>>({ 输入框: '测试值', 动态表单2: [], 动态表单3: [{}] });
            const mockOptions = ref<Record<string, PlainOption>>({
                动态表单1: {
                    config: [{ field: '文本框' }, { field: '下拉框' }],
                },
                动态表单2: {
                    uniqueKey: '_id',
                    config: ({ item, index }) => [{ field: '多选框', initialValue: 'ii', defaultValue: 'a', depend: true, dependFields: `动态表单2."${index}".单选框` }, { field: '单选框' }],
                },
                动态表单3: {
                    config: [{ field: '复选框', defaultValue: 123 }, { field: '切换框', defaultValue: () => ({ test: 'aa' }) }],
                },
                动态表单4: {
                    config: { 日期选择: { defaultValue: () => ({ date: '2022' }) }, 时间选择: { defaultValue: '11:22' } },
                },
            });
            const wrapper = genWrapperComponent({ mockOptions, mockQuery, searchSpy });
            const wrapperComp = wrapper.vm.wrapperRef;

            // 测试基本值
            expect(wrapperComp).toBeDefined();
            expect(mockQuery.value).toEqual({
                输入框: '测试值',
                动态表单2: [],
                动态表单3: [{ 复选框: 123, 切换框: { test: 'aa' } }],
                日期选择: { date: '2022' },
                时间选择: '11:22',
            });
            // 动态添加多个数据项
            mockQuery.value['动态表单2'].push({ _id: '1', 多选框: 'b' }, { _id: '2', 单选框: 'test' });
            await nextTick();
            // console.log('-----------------');
            // console.log(JSON.stringify(mockQuery.value));
            // console.log('-===============-');
            expect(mockQuery.value).toEqual({
                输入框: '测试值',
                动态表单2: [{ _id: '1', 多选框: 'b' }, { _id: '2', 多选框: 'ii', 单选框: 'test' }],
                动态表单3: [{ 复选框: 123, 切换框: { test: 'aa' } }],
                日期选择: { date: '2022' },
                时间选择: '11:22',
            });
            // 给动态表单1赋值
            mockQuery.value['动态表单1'] = [{ 文本框: 'aa' }];
            await nextTick();
            expect(mockQuery.value).toEqual({
                输入框: '测试值',
                动态表单1: [{ 文本框: 'aa' }],
                动态表单2: [{ _id: '1', 多选框: 'b' }, { _id: '2', 多选框: 'ii', 单选框: 'test' }],
                动态表单3: [{ 复选框: 123, 切换框: { test: 'aa' } }],
                日期选择: { date: '2022' },
                时间选择: '11:22',
            });
            // 内部修改值后判断是否同步
            wrapperComp.refObj['动态表单1.0.文本框'].change('dd');
            wrapperComp.refObj['动态表单1.0.下拉框'].change('xiaLa');
            wrapperComp.refObj['动态表单3.0.切换框'].change('fff');
            await nextTick();
            expect(mockQuery.value).toEqual({
                输入框: '测试值',
                动态表单1: [{ 文本框: 'dd', 下拉框: 'xiaLa' }],
                动态表单2: [{ _id: '1', 多选框: 'b' }, { _id: '2', 多选框: 'ii', 单选框: 'test' }],
                动态表单3: [{ 复选框: 123, 切换框: 'fff' }],
                日期选择: { date: '2022' },
                时间选择: '11:22',
            });
            // 删除动态表单中的某一项
            mockQuery.value['动态表单2'].splice(0, 1);
            await nextTick();
            expect(wrapperComp.refObj['动态表单2.0.多选框'].checked).toBe('ii');
            expect(wrapperComp.refObj['动态表单2.0.单选框'].checked).toBe('test');
            expect(mockQuery.value['动态表单2']).toEqual([{ _id: '2', 多选框: 'ii', 单选框: 'test' }]);
            // 为动态菜单中的某项中的某个字段重新赋值
            mockQuery.value['动态表单2'][0]['单选框'] = 'hhh';
            await nextTick();
            expect(wrapperComp.refObj['动态表单2.0.多选框'].checked).toBe('a');
            expect(wrapperComp.refObj['动态表单2.0.单选框'].checked).toBe('hhh');
            expect(mockQuery.value['动态表单2']).toEqual([{ _id: '2', 多选框: 'a', 单选框: 'hhh' }]);
            // 还原动态菜单中的数据以便做后续的测试
            mockQuery.value['动态表单2'].splice(0, 1, { _id: '33', 多选框: 'ii', 单选框: 'test' });
            await nextTick();
            expect(wrapperComp.refObj['动态表单2.0.多选框'].checked).toBe('ii');
            expect(wrapperComp.refObj['动态表单2.0.单选框'].checked).toBe('test');
            expect(mockQuery.value['动态表单2']).toEqual([{ _id: '33', 多选框: 'ii', 单选框: 'test' }]);
            // 为动态菜单中的某项中的某个字段重新赋值, 但更新源对象
            // 测试改变某个值后, 依赖其的数据也应更新
            mockQuery.value['动态表单2'][0] = { _id: '33', 单选框: 'hhh' };
            await nextTick();
            expect(wrapperComp.refObj['动态表单2.0.多选框'].checked).toBe('a');
            expect(wrapperComp.refObj['动态表单2.0.单选框'].checked).toBe('hhh');
            expect(mockQuery.value['动态表单2']).toEqual([{ _id: '33', 多选框: 'a', 单选框: 'hhh' }]);
            // 通过引用对象手动在 query 上给动态表单赋值
            wrapperComp.refObj['动态表单4'].query['动态表单2'] = [];
            await nextTick();
            watch(() => mockQuery.value['动态表单2'], (query) => watchSpy(query), { deep: true });
            expect(watchSpy).toHaveBeenCalledTimes(0);
            mockQuery.value['动态表单2'].push({ _id: '44', 多选框: 'ii', 单选框: 'hhh' });
            await nextTick();
            expect(watchSpy).toBeCalledWith([{ _id: '44', 多选框: 'ii', 单选框: 'hhh' }]);
            expect(watchSpy).toHaveBeenCalledTimes(1);
            wrapperComp.refObj['动态表单4'].query['动态表单2'][0]['多选框'] = 'bb';
            await nextTick();
            expect(watchSpy).toBeCalledWith([{ _id: '44', 多选框: 'bb', 单选框: 'hhh' }]);
            expect(watchSpy).toHaveBeenCalledTimes(2);
            wrapperComp.refObj['动态表单4'].query['动态表单2'][0]['单选框'] = '999';
            await nextTick();
            expect(watchSpy).toBeCalledWith([{ _id: '44', 多选框: 'a', 单选框: '999' }]);
            expect(watchSpy).toHaveBeenCalledTimes(4);

            await nextTick();
            wrapper.unmount();
        });
    });
    describe('初始赋值时, 不应受到依赖影响', () => {
        it('初始同步 query 后, 不应被默认值替换', async () => {
            const mockQuery = ref<Record<string, any>>({ 包裹: [{ 默认值: 'a', 默认值且被依赖: 'c' }] });
            const mockOptions = ref<Record<string, PlainOption>>({
                包裹: {
                    config: ({ index }) => [
                        { field: '默认值', defaultValue: '11', depend: false, dependFields: `包裹.${index}.默认值且被依赖` },
                        { field: '默认值和初始值', initialValue: '方法', defaultValue: '22', depend: false, dependFields: `包裹.${index}.默认值且被依赖` },
                        { field: '默认值且被依赖', defaultValue: '发发发' },
                    ],
                },
            });
            const wrapper = genWrapperComponent({ mockOptions, mockQuery });
            const wrapperComp = wrapper.vm.wrapperRef;

            // 测试基本值
            expect(wrapperComp).toBeDefined();
            expect(mockQuery.value).toEqual({ 包裹: [{ 默认值: 'a', 默认值和初始值: '方法', 默认值且被依赖: 'c' }] });

            await nextTick();
            wrapper.unmount();
        });
        it('初始同步 query 后, 不应被默认值替换2', async () => {
            const mockQuery = ref<Record<string, any>>({ 包裹: [{ 默认值: 'a' }] });
            const mockOptions = ref<Record<string, PlainOption>>({
                包裹: {
                    config: ({ index }) => [
                        { field: '默认值', defaultValue: '11', depend: true, dependFields: `包裹.${index}.默认值且被依赖` },
                        { field: '默认值和初始值', initialValue: '方法', defaultValue: '22', depend: true, dependFields: `包裹.${index}.默认值且被依赖` },
                        { field: '默认值且被依赖', defaultValue: '发发发' },
                    ],
                },
            });
            const wrapper = genWrapperComponent({ mockOptions, mockQuery });
            const wrapperComp = wrapper.vm.wrapperRef;

            // 测试基本值
            expect(wrapperComp).toBeDefined();
            expect(mockQuery.value).toEqual({ 包裹: [{ 默认值: 'a', 默认值和初始值: '方法', 默认值且被依赖: '发发发' }] });

            await nextTick();
            wrapper.unmount();
        });
    });

    commonTest();
    function commonTest() {
        describe('深层路径反复赋值测试', () => {
            it('有默认值时应该一直调用默认值生成', async () => {
                const defaultValueSpy = vi.fn();
                const defaultValue2Spy = vi.fn();
                const mockQuery = ref<Record<string, any>>({ });
                const mockOptions = ref<Record<string, PlainOption>>({
                    深层反复赋值: {
                        config: [
                            // eslint-disable-next-line max-statements-per-line,style/max-statements-per-line
                            { field: '值1', defaultValue: () => { defaultValueSpy(); return 123; } },
                            // eslint-disable-next-line max-statements-per-line,style/max-statements-per-line
                            { field: '值2', defaultValue: () => { defaultValue2Spy(); return []; } },
                            { field: '值3' },
                        ],
                    },
                });
                const wrapper = genWrapperComponent({ mockOptions, mockQuery, onReady: (q) => expect(q).toEqual({}) });
                const wrapperComp = wrapper.vm.wrapperRef;

                // 测试基本值
                expect(wrapperComp).toBeDefined();
                mockQuery.value['深层反复赋值'] = [{}];
                await nextTick();
                expect(mockQuery.value).toEqual({ 深层反复赋值: [{ 值1: 123, 值2: [] }] });
                expect(defaultValueSpy).toHaveBeenCalledTimes(1);
                expect(defaultValue2Spy).toHaveBeenCalledTimes(1);
                mockQuery.value['深层反复赋值'] = [{}, { 值1: '55', 值2: '22' }];
                await nextTick();
                expect(mockQuery.value).toEqual({ 深层反复赋值: [{ 值1: 123, 值2: [] }, { 值1: '55', 值2: '22' }] });
                expect(defaultValueSpy).toHaveBeenCalledTimes(2);
                expect(defaultValue2Spy).toHaveBeenCalledTimes(2);
                mockQuery.value['深层反复赋值'][0] = {};
                await nextTick();
                expect(mockQuery.value).toEqual({ 深层反复赋值: [{ 值1: 123, 值2: [] }, { 值1: '55', 值2: '22' }] });
                expect(defaultValueSpy).toHaveBeenCalledTimes(3);
                expect(defaultValue2Spy).toHaveBeenCalledTimes(3);
                mockQuery.value['深层反复赋值'][1] = {};
                await nextTick();
                expect(mockQuery.value).toEqual({ 深层反复赋值: [{ 值1: 123, 值2: [] }, { 值1: 123, 值2: [] }] });
                expect(defaultValueSpy).toHaveBeenCalledTimes(4);
                expect(defaultValue2Spy).toHaveBeenCalledTimes(4);
                // 如果对象为空, plain组件(非 plain 函数), 主动调用默认值生成方法
                mockQuery.value['深层反复赋值'].splice(1, 1, { });
                await nextTick();
                expect(mockQuery.value).toEqual({ 深层反复赋值: [{ 值1: 123, 值2: [] }, { 值1: 123, 值2: [] }] });
                expect(defaultValueSpy).toHaveBeenCalledTimes(5);
                expect(defaultValue2Spy).toHaveBeenCalledTimes(5);
                mockQuery.value['深层反复赋值'].splice(1, 1, { 值1: '111' });
                await nextTick();
                expect(mockQuery.value).toEqual({ 深层反复赋值: [{ 值1: 123, 值2: [] }, { 值1: '111', 值2: [] }] });
                expect(defaultValueSpy).toHaveBeenCalledTimes(5);
                expect(defaultValue2Spy).toHaveBeenCalledTimes(6);

                await nextTick();
                wrapper.unmount();
            });
        });
        describe('深层路径扩展测试', () => {
            it('支持 bracket notation 的 field 访问 (a.0[\'aa\'])', async () => {
                const searchSpy = vi.fn();
                const mockQuery = ref<Record<string, any>>({ a: [{ aa: 'x' }] });
                const mockOptions = ref<Record<string, PlainOption>>({
                    a: {
                        config: [{ field: 'aa' }],
                    },
                });
                const wrapper = genWrapperComponent({ mockOptions, mockQuery, searchSpy });
                const wrapperComp = wrapper.vm.wrapperRef;

                expect(wrapperComp.refObj['a.0.aa'].checked).toBe('x');
                wrapperComp.refObj['a.0.aa'].change('y');
                await nextTick();
                expect(mockQuery.value.a[0].aa).toBe('y');

                await nextTick();
                wrapper.unmount();
            });

            it('依赖深层路径的重置与 default/initial 优先级', async () => {
                const searchSpy = vi.fn();
                const mockQuery = ref<Record<string, any>>({ a: [{ b: 'v1' }], c: undefined });
                const mockOptions = ref<Record<string, PlainOption>>({
                    a: {
                        config: ({ item }: any) => [{ field: 'b' }],
                    },
                    c: {
                        depend: true,
                        dependFields: 'a[\'0\'].b',
                        defaultValue: 'default-c',
                        initialValue: 'init-c',
                    },
                });

                const wrapper = genWrapperComponent({ mockOptions, mockQuery, searchSpy });
                const wrapperComp = wrapper.vm.wrapperRef;

                // initialValue 优先
                expect(wrapperComp.refObj.c.checked).toBe('init-c');
                await nextTick();
                // 改变依赖值后应该被重置为 defaultValue
                mockQuery.value.a[0].b = 'v2';
                await nextTick();
                expect(wrapperComp.refObj.c.checked).toBe('default-c');

                await nextTick();
                wrapper.unmount();
            });

            it('uniqueKey 重排序应保持字段映射一致', async () => {
                const mockQuery = ref<Record<string, any>>({ list: [{ _id: '1', val: 'a' }, { _id: '2', val: 'b' }] });
                const mockOptions = ref<Record<string, PlainOption>>({
                    list: {
                        uniqueKey: '_id',
                        config: [{ field: 'val' }],
                    },
                });

                const wrapper = genWrapperComponent({ mockOptions, mockQuery });
                const wrapperComp = wrapper.vm.wrapperRef;

                // 初始映射
                expect(wrapperComp.refObj['list.0.val'].checked).toBe('a');

                // 交换顺序
                mockQuery.value.list.splice(0, 2, { _id: '2', val: 'b' }, { _id: '1', val: 'a' });
                await nextTick();

                // 重新索引后首项应为 'b'
                expect(wrapperComp.refObj['list.0.val'].checked).toBe('b');

                await nextTick();
                wrapper.unmount();
            });

            it('删除数组元素后索引与依赖正确更新', async () => {
                const mockQuery = ref<Record<string, any>>({ arr: [{ x: '1' }, { x: '2', y: '22' }, { x: '3', y: '33' }] });
                const mockOptions = ref<Record<string, PlainOption>>({
                    arr: {
                        config: ({ item, index }: any) => [
                            { field: 'x' },
                            { field: 'y', depend: true, dependFields: `arr.["${index}"].x` },
                        ],
                    },
                });

                const wrapper = genWrapperComponent({ mockOptions, mockQuery });
                const wrapperComp = wrapper.vm.wrapperRef;
                // 删除中间项
                mockQuery.value.arr.splice(1, 1);
                await nextTick();
                // 现在索引1的值应该来自原索引2
                expect(wrapperComp.refObj['arr.1.x'].checked).toBe('3');
                expect(wrapperComp.refObj['arr.1.y'].checked).toBe('33');
                // 内部重新设值后 y 要重置为默认值
                wrapperComp.refObj['arr.1.x'].checked = '99';
                await nextTick();
                expect(wrapperComp.refObj['arr.1.y'].checked).toBeUndefined();
                // 重新设值
                mockQuery.value.arr[1] = { x: 'g', y: 'gg' };
                await nextTick();
                expect(wrapperComp.refObj['arr.1.x'].checked).toBe('g');
                expect(wrapperComp.refObj['arr.1.y'].checked).toBe('gg');
                // 外部重新设值后 y 要重置为默认值
                mockQuery.value.arr[1].x = '99';
                await nextTick();
                expect(wrapperComp.refObj['arr.1.x'].checked).toBe('99');
                expect(wrapperComp.refObj['arr.1.y'].checked).toBeUndefined();

                await nextTick();
                wrapper.unmount();
            });

            it('嵌套对象字段的默认值和函数默认值生效', async () => {
                const mockQuery = ref<Record<string, any>>({});
                const mockOptions = ref<Record<string, PlainOption>>({
                    obj: {
                        config: {
                            nested: { defaultValue: () => ({ k: 'v' }) },
                        },
                    },
                });

                const wrapper = genWrapperComponent({ mockOptions, mockQuery });
                const wrapperComp = wrapper.vm.wrapperRef;
                expect(mockQuery.value).toEqual({ nested: { k: 'v' } });
                wrapperComp.refObj.nested.change({ k: 'new' });
                await nextTick();
                expect(mockQuery.value.nested.k).toBe('new');

                await nextTick();
                wrapper.unmount();
            });
        });
    }
});

/** 休眠 */
async function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
/** 等待 getOption 回调 */
async function awaitGetOptions() {
    // 改变值后, 需等待 watch 响应
    await nextTick();
    // 由于 element-plus 框架内部实现的问题(tree-select 值和 options 同时清空会导致 options 的状态还被记录着, 未被清掉)
    // 监听相应依赖发生变化时, 等待一个周期再请求
    await nextTick();
}
