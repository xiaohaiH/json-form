<template>
    <!-- eslint-disable-next-line vue/no-unused-refs -->
    <VirtualGroup ref="virtualGroupRef" :tag="tag">
        <template v-if="slots?.prepend || ($slots as GroupSlots).prepend">
            <component :is="getNode(slots?.prepend || ($slots as GroupSlots).prepend)" :query="query" :checked="checked" />
        </template>
        <template v-if="slots?.default">
            <component :is="slots.default" :config="finalConfig" :query="query" :checked="checked" />
        </template>
        <slot v-else-if="$slots.default" :config="finalConfig" :query="query" />
        <template v-else>
            <template v-for="(item, key) of finalConfig" :key="item.field || key">
                <component :is="getComponent2(item.t)!" v-if="item" v-bind="item" :field="item.as || item.field || key" :query="query" />
            </template>
        </template>
        <template v-if="slots?.append || ($slots as GroupSlots).append">
            <component :is="getNode(slots?.append || ($slots as GroupSlots).append)" :query="query" :checked="checked" />
        </template>
    </VirtualGroup>
</template>

<script lang="tsx">
import { get, getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import type { FunctionalComponent, SlotsType } from 'vue';
import { computed, defineComponent, markRaw, ref, watch } from 'vue';
import { pick } from '../../src/utils';
import { getComponent } from './assist';
import type { GroupSlots } from './types';
import { groupEmitsPrivate as emits, groupPropsPrivate as props } from './types';
import VirtualGroup from './virtual-group.vue';

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
        const checked = undefined;
        // const checked = computed(() => get<any>(props.query, props.field!));
        const finalConfig = computed(() => {
            const { config, parseConfig } = props;
            if (!parseConfig) return [];
            return typeof config === 'function' ? config({ query: props.query }) : config;
        });
        /** 对 group 组件特殊处理 */
        function getComponent2(name: string) {
            return name === 'group' ? 'HGroup' : getComponent(name);
        }

        props.hooks?.created?.({ props });

        return {
            hyphenate,
            getNode,
            virtualGroupRef,
            tagRef,
            checked,
            finalConfig,
            getComponent2,
        };
    },
});
</script>

<style lang="css" scoped></style>
