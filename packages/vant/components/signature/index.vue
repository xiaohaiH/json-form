<template>
    <VanField
        v-if="renderField && !hide"
        :name="field"
        :disabled="finalDisabled"
        :readonly="finalReadonly"
        v-bind="$attrs"
    >
        <template #input>
            <HSignaturePure v-bind="allAttrs" @load="load" />
        </template>
        <template v-for="(item, slotName) of slots" :key="slotName" #[hyphenate(slotName)]="row">
            <component :is="getNode(item)" v-if="plain" :plain="plain" :props="$props" v-bind="row" />
        </template>
    </VanField>
    <HSignaturePure v-else-if="!hide" v-bind="allAttrs" />
</template>

<script lang="ts">
import type { usePlain } from '@xiaohaih/json-form-core';
import { getNode, getProvideValue, hyphenate } from '@xiaohaih/json-form-core';
import type { SignatureInstance } from 'vant';
import { Field as VanField, Signature as VanSignature } from 'vant';
import type { SlotsType } from 'vue';
import { computed, defineComponent, inject, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';
import { useCommonSetup } from '../use';
import HSignaturePure from './instance.vue';
import type { SignatureSlots, SubmitOption } from './types';
import { signatureEmitsPrivate as emits, signaturePropsPrivate as props } from './types';

/**
 * @file 签名
 */
export default defineComponent({
    name: 'HSignature',
    components: { VanField, VanSignature, HSignaturePure },
    inheritAttrs: false,
    props,
    emits,
    setup(props, ctx) {
        const allAttrs = computed(() => ({ ...props, ...ctx.attrs }));
        const wrapperProvide = getProvideValue();
        const finalDisabled = computed(() => props.disabled || wrapperProvide?.disabled?.value);
        const finalReadonly = computed(() => props.readonly || wrapperProvide?.readonly?.value);

        const plain = ref<ReturnType<typeof usePlain> | null>(null);
        function load(_plain: ReturnType<typeof usePlain>) {
            plain.value = _plain;
        }

        return {
            hyphenate,
            getNode,
            allAttrs,
            finalDisabled,
            finalReadonly,
            plain,
            load,
        };
    },
});
</script>

<style lang="scss" scoped>
</style>
