<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--autocomplete json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <template v-if="slots?.before || ($slots as AutocompleteSlots).before">
            <component :is="getNode(slots?.before || ($slots as AutocompleteSlots).before)" v-bind="slotProps" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElAutocomplete
                ref="autocompleteRef"
                :clearable="clearable"
                :model-value="(checked as string)"
                class="json-form-item__content"
                :value-key="valueKey"
                :fetch-suggestions="filterCallback"
                v-bind="contentActualProps"
                :readonly="globalReadonly || contentActualProps.readonly"
                :disabled="globalDisabled || contentActualProps.disabled"
                @update:model-value="change"
                @select="selectHandle"
                @keydown.enter="enterHandle"
            >
                <template v-for="(item, slotName) of itemSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                </template>
            </ElAutocomplete>
        </slot>
        <template v-if="slots?.after || ($slots as AutocompleteSlots).after">
            <component :is="getNode(slots?.after || ($slots as AutocompleteSlots).after)" v-bind="slotProps" />
        </template>
        <div v-if="slots?.postfix || ($slots as AutocompleteSlots).postfix" class="json-form-item__postfix">
            <component :is="getNode(slots?.postfix || ($slots as AutocompleteSlots).postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { ElAutocomplete, ElFormItem } from 'element-plus';
import type { SlotsType } from 'vue';
import { computed, defineComponent, nextTick, ref, watch } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import { pick } from '../../src/utils';
import { useCommonSetup, useContentActualProps, useFormItemProps } from '../use';
import type { AutocompleteSlots } from './types';
import { autocompleteEmitsPrivate as emits, autocompletePropsPrivate as props } from './types';

/**
 * @file 自动补全输入框
 */
export default defineComponent({
    name: 'HAutocomplete',
    components: {
        ElFormItem,
        ElAutocomplete,
    },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<AutocompleteSlots>,
    setup(props, ctx) {
        const autocompleteRef = ref<ComponentExposed<typeof ElAutocomplete>>();

        // @ts-expect-error 忽视类型复杂导致的报错
        const plain = usePlain(props);
        const { formItemActualProps, contentActualProps, slotProps } = useCommonSetup(props, ctx, plain);

        // /** 重写数据源, 优先用传递的 */
        // const finalFetchSuggestions = computed(() => {
        //     const { fetchSuggestions } = props;
        //     return fetchSuggestions || filterCallback;
        // });
        /** 重写过滤逻辑 */
        function filterCallback(val: string, callback: (data: any[]) => void) {
            props.remoteFilter
                ? plain.getOptions('other', { filterValue: val, callback })
                : callback(val ? plain.finalOption.value.filter((data: any) => props.filterMethod(val, data, props.valueKey)) : plain.finalOption.value);
        }
        /** 回车事件 */
        function enterHandle(ev: Event | KeyboardEvent) {
            plain.wrapper?.search();
        }
        /** 重写 select 事件 */
        function selectHandle(item: any) {
            ctx.emit('select', item, { props, plain });
            props.blurOnSelected && autocompleteRef.value && nextTick(autocompleteRef.value.blur);
        }

        return {
            hyphenate,
            getNode,
            autocompleteRef,
            ...plain,
            formItemActualProps,
            contentActualProps,
            slotProps,
            // finalFetchSuggestions,
            filterCallback,
            enterHandle,
            selectHandle,
        };
    },
});
</script>

<style lang="css" scoped></style>
