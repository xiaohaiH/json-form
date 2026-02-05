<template>
    <VirtualGroup ref="virtualGroupRef" :tag="tag">
        <template v-if="slots?.prepend || ($slots as DynamicGroupSlots).prepend">
            <component :is="getNode(slots?.prepend || ($slots as DynamicGroupSlots).prepend)" :query="query" :checked="plain.checked.value" :plain="plain" />
        </template>
        <template v-for="(opt, idx) of finalConfig" :key="opt.uniqueValue">
            <div v-bind="itemProps">
                <component :is="itemSlots.prepend" :query="query" :checked="plain.checked.value" :index="idx" :plain="plain" />
                <template v-for="(item) of opt.options" :key="`${field}.${idx}.${item.field || item[REWRITE_FIELD_KEY]}`">
                    <component :is="getComponent2(item.t)!" v-if="item" v-bind="item" :unique-value="opt.uniqueValue" :field="`${field}.${idx}.${item.field || item[REWRITE_FIELD_KEY]}`" :query="query" :parent-query="plain.checked.value[idx]" />
                </template>
                <component :is="itemSlots.append" :query="query" :checked="plain.checked.value" :index="idx" :plain="plain" />
            </div>
        </template>
        <template v-if="slots?.append || ($slots as DynamicGroupSlots).append">
            <component :is="getNode(slots?.append || ($slots as DynamicGroupSlots).append)" :query="query" :checked="plain.checked.value" :plain="plain" />
        </template>
    </VirtualGroup>
</template>

<script lang="tsx">
import type { PlainProps } from '@xiaohaih/json-form-core';
import { defineCommonMethod, get, getNode, getProvideValue, hyphenate, isPlainObject, set, usePlain } from '@xiaohaih/json-form-core';
import type { ExtractPublicPropTypes, Ref, SlotsType } from 'vue';
import { computed, defineComponent, inject, markRaw, ref, watch } from 'vue';
import { pick } from '../../src/utils';
import { getComponent, HGroup } from '../group/index';
import VirtualGroup from '../group/virtual-group.vue';
import type { DynamicGroupSlots } from './types';
import { dynamicGroupEmitsPrivate as emits, dynamicGroupPropsPrivate as props } from './types';

type Option = Omit<ExtractPublicPropTypes<PlainProps<Record<string, any>, Record<string, any>>>, 'query'> & { t: string; [REWRITE_FIELD_KEY]: string };

let globalId = 0;
/** 当 field 不存在, 但 fields 存在时, 合并 fields 到对象上的 key */
const REWRITE_FIELD_KEY = '__field__' as const;

/**
 * @file 自定义组件 - 动态删减组件(对应动态表单)
 */
export default defineComponent({
    name: 'HDynamicGroup',
    components: {
        VirtualGroup,
    },
    props,
    emits,
    slots: Object as SlotsType<DynamicGroupSlots>,
    setup(props, ctx) {
        const virtualGroupRef = ref<Record<string, any> | undefined>();
        const tagRef = computed(() => virtualGroupRef.value?.tagRef);
        const plain = usePlain(props);
        const checked = plain.checked as Ref<Record<string, any>[] | undefined>;

        // /** watch 版本的配置项, watch 自带旧值记录, 方便做优化 */
        // const finalConfig = ref<{ uniqueValue: string | number; options: Option[] }[]>([]);
        // watch(
        //     [() => checked.value && [...checked.value], () => props.config],
        //     ([value, config], oldVal) => {
        //         if (!value?.length) return finalConfig.value = [];
        //         const { uniqueKey } = props;
        //         const isFunc = typeof config === 'function';
        //         const arr = !isFunc && coverObjOption2Arr<Option[]>(config);
        //         finalConfig.value = value.map((o, i) => ({
        //             uniqueValue: uniqueKey ? o[uniqueKey] : getId(o, oldVal?.[0], i),
        //             options: isFunc ? coverObjOption2Arr<Option[]>(config({ item: o, index: i, query: props.query })) : arr as Option[],
        //         }));
        //     },
        //     { immediate: true },
        // );
        // /**
        //  * 获取唯一 id, 如果与旧引用相同, 则复用唯一 id(配合 finalConfig - watch 版本使用)
        //  * (为动态新增的表单项做的优化, 不然可以用下方的计算属性(finalConfig))
        //  */
        // function getId(val: Record<string, any>, oldVal: Record<string, any>[] | undefined, idx: number) {
        //     return oldVal?.[idx] === val ? finalConfig.value[idx].uniqueValue : ++globalId;
        // }
        /** 由于计算属性不似 watch 有上条数据, 因为手动记录 */
        let configSnapshot = {
            /** 记录每行配置项的唯一值集合 */
            configUniqueValue: [] as any[],
            /** 记录每行数据的值集合 */
            checkedValue: [] as any[],
        };
        /** 计算属性版本的 config 配置项(防止生成的配置项中用了响应式变量, 不在计算属性中生成无法捕捉到) */
        const finalConfig = computed(() => {
            const { config } = props;
            if (!config) return [];
            const value = checked.value;
            if (!value?.length) return [];
            const isFunc = typeof config === 'function';
            const arr = !isFunc && coverObjOption2Arr<Option[]>(config);
            const { uniqueKey } = props;
            const result = value.map((o, i) => ({ uniqueValue: uniqueKey ? o[uniqueKey] : getId(o, i), options: isFunc ? coverObjOption2Arr<Option[]>(config({ item: o, index: i, checked: value, query: props.query, plain })) : arr as Option[] }));
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            configSnapshot.configUniqueValue = result.map((r) => r.uniqueValue);
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
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
            if (isPlainObject(opt)) {
                const r: any[] = [];
                Object.entries(opt).forEach(([key, value]) => {
                    value.field = key;
                    r.push(value);
                });
                return r as unknown as T;
            }
            opt.forEach((o: any) => !o.field && o.fields && (o[REWRITE_FIELD_KEY] = o.fields.join(',')));
            return opt as unknown as T;
        }

        function getComponent2(name: string) {
            return name === 'dynamic-group' ? 'HDynamicGroup' : name === 'group' ? HGroup : getComponent(name);
        }

        return {
            hyphenate,
            getNode,
            REWRITE_FIELD_KEY,
            virtualGroupRef,
            tagRef,
            plain,
            finalConfig,
            getComponent2,
        };
    },
});
</script>

<style lang="css" scoped></style>
