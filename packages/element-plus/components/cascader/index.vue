<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--cascader json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemStaticProps"
        :prop="formItemStaticProps.prop || field"
        v-bind.prop="formItemFinalDynamicProps"
    >
        <template v-if="slots?.before || ($slots as CascaderSlots).before">
            <component :is="getNode(slots?.before || ($slots as CascaderSlots).before)" v-bind="slotProps" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElCascader
                v-bind="contentStaticProps"
                :filterable="filterable"
                :clearable="clearable"
                :options="(finalOption as any[])"
                :model-value="(checked as string[])"
                class="json-form-item__content"
                v-bind.prop="contentDynamicProps"
                @update:model-value="insetChange"
            >
                <template v-for="(item, slotName) of itemSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                </template>
            </ElCascader>
        </slot>
        <template v-if="slots?.after || ($slots as CascaderSlots).after">
            <component :is="getNode(slots?.after || ($slots as CascaderSlots).after) " v-bind="slotProps" />
        </template>
        <div v-if="slots?.postfix || ($slots as CascaderSlots).postfix" class="json-form-item__postfix">
            <component :is="getNode(slots?.postfix || ($slots as CascaderSlots).postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { getNode, hyphenate, isEmptyValue, usePlain } from '@xiaohaih/json-form-core';
import { ElCascader, ElFormItem } from 'element-plus';
import type { SlotsType } from 'vue';
import { computed, defineComponent, nextTick, reactive, toRefs } from 'vue';
import { pick } from '../../src/utils';
import { formItemPropKeys } from '../share';
import type { CascaderSlots } from './types';
import { cascaderEmitsPrivate as emits, cascaderPropsPrivate as props } from './types';

/**
 * @file 级联选择
 */
export default defineComponent({
    name: 'HCascader',
    components: {
        ElFormItem,
        ElCascader,
    },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<CascaderSlots>,
    setup(props, ctx) {
        const formItemStaticProps = computed(() => {
            const { formItemProps } = props;
            return { ...pick(props, formItemPropKeys), ...formItemProps };
        });
        const formItemFinalDynamicProps = computed(() => {
            const { query, formItemDynamicProps } = props;
            return formItemDynamicProps ? formItemDynamicProps({ query }) : undefined;
        });
        const contentStaticProps = computed(() => ({ ...ctx.attrs, ...props.staticProps }));
        const contentDynamicProps = computed(() => {
            const { query, dynamicProps } = props;
            return dynamicProps ? dynamicProps({ query }) : undefined;
        });
        const plain = usePlain(props);
        const slotProps = computed(() => ({
            getFormItemProps: () => ({ ...formItemStaticProps.value, ...formItemFinalDynamicProps.value }),
            getItemProps: () => ({ ...contentStaticProps.value, ...contentDynamicProps.value }),
            getProps: () => props,
            options: plain.finalOption.value,
            modelValue: plain.checked.value,
            onChange: insetChange,
            class: 'json-form-item__content',
            plain,
        }));
        /**
         * 重写 change 事件
         * 防止存在默认值时, element-plus 组件清空值时
         * 内部马上重写会导致值更新了, ui 未更新
         */
        function insetChange(val: any) {
            if (!isEmptyValue(props.defaultValue) && isEmptyValue(val)) {
                plain.checked.value = undefined;
                nextTick(() => plain.change(props.defaultValue));
            }
            else {
                plain.change(val);
            }
        }

        return {
            hyphenate,
            ...plain,
            formItemStaticProps,
            formItemFinalDynamicProps,
            contentStaticProps,
            contentDynamicProps,
            getNode,
            slotProps,
            insetChange,
        };
    },
});
</script>

<style lang="css" scoped></style>
