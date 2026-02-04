<template>
    <!-- eslint-disable-next-line vue/no-unused-refs -->
    <VirtualGroup ref="virtualGroupRef" :tag="tag">
        <template v-if="slots?.prepend || ($slots as GroupSlots).prepend">
            <component :is="getNode(slots?.prepend || ($slots as GroupSlots).prepend)" :query="query" :wrapper="wrapper" />
        </template>
        <template v-if="slots?.default">
            <component :is="slots.default" :config="finalConfig" :query="query" :wrapper="wrapper" />
        </template>
        <slot v-else-if="$slots.default" :config="finalConfig" :query="query" />
        <template v-else>
            <template v-for="(item, key) of finalConfig" :key="item.as || item.field || item[REWRITE_FIELD_KEY] || key">
                <component :is="getComponent2(item.t)!" v-if="item" v-bind="item" :field="item.as || item.field || item[REWRITE_FIELD_KEY] || key" :query="query" />
            </template>
        </template>
        <template v-if="slots?.append || ($slots as GroupSlots).append">
            <component :is="getNode(slots?.append || ($slots as GroupSlots).append)" :query="query" :wrapper="wrapper" />
        </template>
    </VirtualGroup>
</template>

<script lang="tsx">
import { get, getNode, getProvideValue, hyphenate, isPlainObject, usePlain } from '@xiaohaih/json-form-core';
import type { FunctionalComponent, SlotsType } from 'vue';
import { computed, defineComponent, markRaw, ref, watch } from 'vue';
import { pick } from '../../src/utils';
import { getComponent } from './assist';
import type { GroupSlots } from './types';
import { groupEmitsPrivate as emits, groupPropsPrivate as props } from './types';
import VirtualGroup from './virtual-group.vue';

/** 当 field 不存在, 但 fields 存在时, 合并 fields 到对象上的 key */
const REWRITE_FIELD_KEY = '__field__' as const;

/**
 * @file 自定义组件 - 支持多列渲染
 */
export default defineComponent({
    name: 'HGroup',
    components: {
        VirtualGroup,
    },
    props,
    emits,
    slots: Object as SlotsType<GroupSlots>,
    setup(props, ctx) {
        const virtualGroupRef = ref<Record<string, any> | undefined>();
        const tagRef = computed(() => virtualGroupRef.value?.tagRef);
        /** 容器注入值 */
        const wrapper = getProvideValue();
        // const checked = computed(() => get<any>(props.query, props.field!));
        const finalConfig = computed(() => {
            const { config } = props;
            // 如果函数且提供了 formRef 时, formRef 获取失败时不渲染
            // 防止重复渲染一次导致 getOptions 重复请求
            if (typeof config === 'function' && props.getFormRef && !props.getFormRef?.()) return [];
            return typeof config === 'function' ? coverObjOption2Arr<any[]>(config({ query: props.query, wrapper, formRef: props.getFormRef?.() })) : coverObjOption2Arr<any[]>(config);
        });
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
        /** 对 group 组件特殊处理 */
        function getComponent2(name: string) {
            return name === 'group' ? 'HGroup' : getComponent(name);
        }

        props.hooks?.created?.({ props });

        return {
            hyphenate,
            getNode,
            REWRITE_FIELD_KEY,
            virtualGroupRef,
            tagRef,
            wrapper,
            finalConfig,
            getComponent2,
        };
    },
});
</script>

<style lang="css" scoped></style>
