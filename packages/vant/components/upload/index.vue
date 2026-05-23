<template>
    <VanField
        v-if="!hide"
        :name="field"
        :disabled="globalDisabled || disabled"
        :readonly="globalReadonly || readonly"
        v-bind="$attrs"
    >
        <template #input>
            <VanUploader
                :disabled="globalDisabled || disabled"
                :readonly="globalReadonly || readonly"
                :afterRead="rewriteAfterRead"
                :model-value="checked"
                v-bind="uploadProps" v-on="uploadOn"
                @update:model-value="change"
            >
                <template v-for="(item, slotName) of uploadSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
                </template>
            </VanUploader>
        </template>
        <template v-for="(item, slotName) of slots" :key="slotName" #[hyphenate(slotName)]="row">
            <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" />
        </template>
    </VanField>
</template>

<script lang="ts">
import { getNode, hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { Field as VanField, Uploader as VanUploader } from 'vant';
import type { SlotsType } from 'vue';
import { defineComponent, unref } from 'vue';
import { useCommonSetup } from '../use';
import type { FileInfo, UploadDetail, UploadOption, UploadSlots } from './types';
import { uploadEmitsPrivate as emits, uploadPropsPrivate as props } from './types';

/**
 * @file 上传
 */
export default defineComponent({
    name: 'HUploader',
    components: { VanField, VanUploader },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<UploadSlots>,
    setup(props, ctx) {
        const plain = usePlain(props);
        const { slotProps } = useCommonSetup(props, ctx, plain);

        /** 重写文件上传功能 */
        function rewriteAfterRead(file: FileInfo | FileInfo[], detail: UploadDetail) {
            const opt = getUploadOption(file, detail);
            if (props.afterRead) return props.afterRead(file, detail, opt);
            if (!props.uploadRequest) return;

            opt.files.forEach((o) => {
                o.status = 'uploading';
                o.message = typeof props.uploadingMessage === 'function' ? props.uploadingMessage(o) : props.uploadingMessage;
            });
            const res = props.uploadRequest(opt);
            typeof res === 'object' && (res.then ? res.then(opt.success.bind(null, opt.files)) : res.catch(opt.fail.bind(null, opt.files)));
        }
        function getUploadOption(file: FileInfo | FileInfo[], detail: UploadDetail) {
            return {
                file: Array.isArray(file) ? file[0] : file,
                files: Array.isArray(file) ? file : [file],
                success: successCallback,
                fail: failCallback,
            } as UploadOption;
        }
        function successCallback(file: FileInfo | FileInfo[], res: any) {
            const files = Array.isArray(file) ? file : [file];
            files.some((o) => {
                if (o.status !== 'uploading') return false;
                o.status = 'done';
                o.message = '';
                o.response = res;
                return false;
            });
        }
        function failCallback(file: FileInfo | FileInfo[], res: any) {
            const files = Array.isArray(file) ? file : [file];
            files.some((o) => {
                if (o.status !== 'uploading') return false;
                o.status = 'failed';
                o.message = typeof props.failedMessage === 'function' ? props.failedMessage(o, res) : props.failedMessage;
                o.response = res;
                return false;
            });
        }

        return {
            hyphenate,
            getNode,
            ...plain,
            slotProps,
            rewriteAfterRead,
            getUploadOption,
            successCallback,
            failCallback,
        };
    },
});
</script>

<style lang="scss" scoped>
</style>
