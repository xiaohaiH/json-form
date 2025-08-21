<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--upload json-form-item--${field} json-form-item--${!!slots?.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <template v-if="slots?.before || ($slots as UploadSlots).before">
            <component :is="getNode(slots?.before || ($slots as UploadSlots).before)" v-bind="slotProps" />
        </template>
        <template v-if="slots?.default">
            <component :is="getNode(slots.default)" v-bind="slotProps" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElUpload
                ref="uploadRef"
                action="-"
                :file-list="(checked as any[])"
                class="json-form-item__content"
                :before-upload="finalBeforeUpload"
                :httpRequest="(finalHttpRequest as any)"
                :onExceed="handleExceed"
                v-bind="contentActualProps"
                :disabled="globalReadonly || globalDisabled || contentActualProps.disabled"
                @update:file-list="change"
            >
                <template #default>
                    <ElButton v-bind="buttonAttrs">
                        {{ buttonText }}
                    </ElButton>
                </template>
                <template v-for="(item, slotName) of itemSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" :uploadRef="uploadRef" />
                </template>
            </ElUpload>
        </slot>
        <template v-if="slots?.after || ($slots as UploadSlots).after">
            <component :is="getNode(slots?.after || ($slots as UploadSlots).after)" v-bind="slotProps" />
        </template>
        <div v-if="slots?.postfix || ($slots as UploadSlots).postfix" class="json-form-item__postfix">
            <component :is="getNode(slots?.postfix || ($slots as UploadSlots).postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { ElButton, ElFormItem, ElUpload } from 'element-plus';
import type { UploadFile, UploadRawFile, UploadRequestOptions, UploadUserFile } from 'element-plus';
import type { SlotsType } from 'vue';
import { computed, defineComponent, onMounted, ref } from 'vue';
import { pick } from '../../src/utils';
import { formItemPropKeys } from '../share';
import type { UploadSlots } from './types';
import { uploadEmitsPrivate as emits, genFileId, uploadPropsPrivate as props } from './types';

/**
 * @file 上传组件
 */
export default defineComponent({
    name: 'HUpload',
    components: {
        ElFormItem,
        ElUpload,
    },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<UploadSlots>,
    setup(props, ctx) {
        const uploadRef = ref<InstanceType<typeof ElUpload>>();

        const formItemStaticProps = computed(() => {
            const { formItemProps } = props;
            return { ...pick(props, formItemPropKeys), ...formItemProps };
        });
        const formItemActualProps = computed(() => {
            const { query, formItemDynamicProps } = props;
            return formItemDynamicProps ? { ...formItemStaticProps.value, ...formItemDynamicProps({ query }) } : formItemStaticProps.value;
        });
        const contentStaticProps = computed(() => ({ ...ctx.attrs, ...props.staticProps }));
        const contentActualProps = computed(() => {
            const { query, dynamicProps } = props;
            return dynamicProps ? { ...contentStaticProps.value, ...dynamicProps({ query }) } : contentStaticProps.value;
        });
        const plain = usePlain(props);
        const finalHttpRequest = computed(() => props.httpRequest && customHttpRequest);
        /** 防止 promise 结果和 option.回调都执行时, 结果会执行两次 */
        function customHttpRequest(option: UploadRequestOptions) {
            let isFinish = false;
            const _option = { ...option, onSuccess, onError };
            function onSuccess(...args: Parameters<UploadRequestOptions['onSuccess']>) {
                if (isFinish) return;
                isFinish = true;
                option.onSuccess(...args);
            }
            function onError(...args: Parameters<UploadRequestOptions['onError']>) {
                if (isFinish) return;
                isFinish = true;
                option.onError(...args);
            }

            const r = props.httpRequest!(_option);
            if (r instanceof Promise) r.then(onSuccess).catch(onError);
            else return r;
        }
        function handleExceed(files: File[], uploadFiles: UploadUserFile[]) {
            const _props = contentStaticProps.value;
            if (_props.limit !== 1) return _props.onExceed?.(files, uploadFiles);
            const file = files[0] as UploadRawFile;
            if (props.fileMaxSize && file.size > props.fileMaxSize) {
                return props.fileMaxSizeToast(file, props.fileMaxSize);
            }
            const r = uploadFiles.find((v) => v.raw && v.raw.name === file.name && v.raw.type === file.type);
            if (r) return props.fileRepeatToast(r.raw!);
            uploadRef.value!.clearFiles();
            file.uid = genFileId();
            uploadRef.value!.handleStart(file);
            _props.autoUpload && uploadRef.value!.submit();
        }
        function finalBeforeUpload(rawFile: UploadRawFile) {
            if (props.beforeUpload) return props.beforeUpload(rawFile);
            if (props.fileMaxSize && rawFile.size > props.fileMaxSize) {
                props.fileMaxSizeToast(rawFile, props.fileMaxSize);
                return false;
            }
            const _checked = (plain.checked.value || []) as UploadFile[];
            if (!_checked.length) return;
            const r = _checked.find((v) => v.name === rawFile.name && v.raw?.type === rawFile.type);
            if (r) {
                props.fileRepeatToast(r.raw!);
                return false;
            }
        }

        const slotProps = computed(() => ({
            getFormItemProps: () => formItemActualProps.value,
            getItemProps: () => contentActualProps.value,
            getProps: () => props,
            extraOptions: {
                modelValue: plain.checked.value,
                options: plain.finalOption.value,
                onChange: plain.change,
                httpRequest: finalHttpRequest,
                onExceed: handleExceed,
            },
            plain,
        }));

        return {
            uploadRef,
            hyphenate,
            getNode,
            ...plain,
            formItemActualProps,
            contentActualProps,
            finalHttpRequest,
            finalBeforeUpload,
            handleExceed,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>
