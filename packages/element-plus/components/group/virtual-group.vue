<template>
    <template v-if="tag">
        <component :is="tag" v-bind="$attrs" ref="tagRef">
            <slot />
        </component>
    </template>
    <slot v-else />
</template>

<script lang="tsx">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';

/**
 * @file 对 Group 组件进行包装, 以支持无根节点渲染
 */
export default defineComponent({
    name: 'VirtualGroup',
    inheritAttrs: false,
    props: {
        tag: { type: [Object, String, Array, Function] as PropType<any>, default: 'div' },
    },
    setup() {
        return { tagRef: ref<Record<string, any> | undefined>() };
    },
});
</script>

<style lang="css" scoped></style>
