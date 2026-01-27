<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child -->
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--autocomplete json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <template v-if="slots?.before || $slots.before">
            <component :is="getNode(slots?.before || $slots.before)" v-bind="slotProps" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElAutocomplete
                ref="autocompleteRef"
                :clearable="clearable"
                :value="checked"
                class="json-form-item__content"
                v-bind="contentActualProps"
                :readonly="globalReadonly || contentActualProps.readonly"
                :disabled="globalDisabled || contentActualProps.disabled"
                :value-key="valueKey"
                :fetch-suggestions="finalFetchSuggestions"
                @input="change"
                @select="selectHandle"
                @keydown.enter="enterHandle"
            >
                <template v-if="itemSlots.default" #default="{ item }">
                    <component :is="getNode(itemSlots.default, slotProps)" v-bind="slotProps" :item="item" />
                </template>
                <template v-if="itemSlots.prefix" #prefix>
                    <component :is="getNode(itemSlots.prefix, slotProps)" v-bind="slotProps" />
                </template>
                <template v-if="itemSlots.suffix" #suffix>
                    <component :is="getNode(itemSlots.suffix, slotProps)" v-bind="slotProps" />
                </template>
                <template v-if="itemSlots.prepend" #prepend>
                    <component :is="getNode(itemSlots.prepend, slotProps)" v-bind="slotProps" />
                </template>
                <template v-if="itemSlots.append" #append>
                    <component :is="getNode(itemSlots.append, slotProps)" v-bind="slotProps" />
                </template>
                <!-- 动态插槽支持 - 目前被注释 -->
                <!-- <template v-for="(item, slotName) of itemSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                </template> -->
            </ElAutocomplete>
        </slot>
        <template v-if="slots?.after || $slots.after">
            <component :is="getNode(slots?.after || $slots.after)" v-bind="slotProps" />
        </template>
        <div v-if="slots?.postfix || $slots.postfix" class="json-form-item__postfix">
            <component :is="getNode(slots?.postfix || $slots.postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { Autocomplete as ElAutocomplete, FormItem as ElFormItem } from 'element-ui';
import type { ComponentExposed } from 'vue-component-type-helpers';
// import type { SlotsType } from 'vue';
import { computed, defineComponent, ref, watch } from 'vue-demi';
import { getNode, pick } from '../../src/utils';
import { formItemPropKeys } from '../share';
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
    // slots: Object as SlotsType<AutocompleteSlots>,
    setup(props, ctx) {
        const autocompleteRef = ref<ComponentExposed<typeof ElAutocomplete>>();

        const formItemStaticProps = computed(() => {
            const { formItemProps } = props;
            return { ...pick(props, formItemPropKeys), ...formItemProps };
        });
        const formItemActualProps = computed(() => {
            const { query, formItemDynamicProps } = props;
            return formItemDynamicProps ? { ...formItemStaticProps.value, ...formItemDynamicProps({ query }) } : formItemStaticProps.value;
        });
        const contentStaticProps = computed(() => ({ ...ctx.attrs, ...props.staticProps, fetchSuggestions: props.fetchSuggestions }));
        const contentActualProps = computed(() => {
            const { query, dynamicProps } = props;
            return dynamicProps ? { ...contentStaticProps.value, ...dynamicProps({ query }) } : contentStaticProps.value;
        });
        const plain = usePlain(props);

        /** 重写数据源, 优先用传递的 */
        const finalFetchSuggestions = computed(() => {
            const { fetchSuggestions } = contentActualProps.value;
            return fetchSuggestions || filterCallback;
        });
        /** 重写过滤逻辑 */
        function filterCallback(val: string, callback: (data: any[]) => void) {
            props.remoteFilter
                ? plain.getOptions('other', { filterValue: val, callback })
                : callback(val ? plain.finalOption.value.filter((data) => props.filterMethod(val, data, props.valueKey)) : plain.finalOption.value);
        }
        /** 回车事件 */
        function enterHandle(ev: Event | KeyboardEvent) {
            plain.wrapper?.search();
        }
        /** 重写 select 事件 */
        function selectHandle(item: any) {
            ctx.emit('select', item, { props, plain });
            props.onSelect?.(item, { props, plain });
        }
        const slotProps = computed(() => ({
            getFormItemProps: () => formItemActualProps.value,
            getItemProps: () => contentActualProps.value,
            getProps: () => props,
            extraOptions: {
                modelValue: plain.checked.value,
                options: plain.finalOption.value,
                onChange: plain.change,
                onEnter: enterHandle,
            },
            plain,
        }));

        return {
            hyphenate,
            getNode,
            autocompleteRef,
            ...plain,
            finalFetchSuggestions,
            filterCallback,
            formItemActualProps,
            contentActualProps,
            enterHandle,
            selectHandle,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>
