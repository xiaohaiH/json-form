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
                :onExceed="handleExceed"
                v-bind="contentActualProps"
                :httpRequest="(finalHttpRequest as any)"
                :auto-upload="autoUpload"
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
import { computed, defineComponent, getCurrentInstance, onBeforeUnmount, onMounted, ref } from 'vue';
import { flat, pick } from '../../src/utils';
import { useCommonSetup } from '../use';
import type { UploadSlots } from './types';
import { uploadEmitsPrivate as emits, genFileId, uploadPropsPrivate as props } from './types';

async function getAllFiles(entry: FileSystemEntry): Promise<UploadRawFile[]> {
    try {
        if (entry.isFile) {
            const file = (await getFile(
                entry as FileSystemFileEntry,
            )) as UploadRawFile;
            file.isDirectory = false;
            return [file];
        }
        if (entry.isDirectory) {
            const dirReader = (entry as FileSystemDirectoryEntry).createReader();
            const getEntries = (): Promise<FileSystemEntry[]> => {
                return new Promise((resolve, reject) =>
                    dirReader.readEntries(resolve, reject),
                );
            };

            const entries: FileSystemEntry[] = [];
            let readEntries = await getEntries();
            /**
             * In Chromium-based browsers, readEntries() will only return the first 100 FileSystemEntry instances.
             * https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryReader/readEntries#:~:text=In%20Chromium%2Dbased%20browsers%2C%20readEntries()%20will%20only%20return%20the%20first%20100%20FileSystemEntry%20instances.%20In%20order%20to%20obtain%20all%20of%20the%20instances%2C%20readEntries()%20must%20be%20called%20multiple%20times.
             */
            while (readEntries.length > 0) {
                entries.push(...readEntries);
                readEntries = await getEntries();
            }
            const filePromises = entries.map((entry) => getAllFiles(entry).catch(() => []));
            const files = await Promise.all(filePromises);
            return flat(files);
        }
    }
    catch {
        return [];
    }
    return [];
}
function getFile(entry: FileSystemFileEntry): Promise<File> {
    return new Promise((resolve, reject) => entry.file(resolve, reject));
}

/**
 * @file 上传组件
 */
export default defineComponent({
    name: 'HUpload',
    components: {
        ElFormItem,
        ElUpload,
        ElButton,
    },
    inheritAttrs: false,
    props,
    emits,
    slots: Object as SlotsType<UploadSlots>,
    setup(props, ctx) {
        const uploadRef = ref<InstanceType<typeof ElUpload>>();

        const plain = usePlain(props);
        const { formItemActualProps, contentActualProps, slotProps } = useCommonSetup(props, ctx, plain);
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
        onMounted(() => {
            const inputDoms = uploadRef.value?.$el?.querySelectorAll?.('[type="file"]') as HTMLInputElement[];
            if (!inputDoms.length) {
                console.warn('拦截 ElUpload 上传方法失败, 请记录 element-plus 版本号并联系开发者');
            }
            else {
                inputDoms.forEach((o) => o.addEventListener('change', interceptChange, { capture: true }));
                onBeforeUnmount(() => inputDoms.forEach((o) => o.removeEventListener('change', interceptChange, { capture: true })));
                /** 拦截原生 input 事件, 并对文件做处理 */
                function interceptChange(ev: Event) {
                    const files = (ev.target as HTMLInputElement).files;
                    if (!files?.length) return;
                    const _files = uploadPrefix(Array.from(files) as any[]);
                    if (files.length !== _files.length) {
                        const dataTransfer = new DataTransfer();
                        _files.forEach((file) => dataTransfer.items.add(file));
                        (ev.target as HTMLInputElement).files = dataTransfer.files;
                    }
                }
            }

            if (contentActualProps.value.drag) {
                const dragDom = uploadRef.value?.$el?.getElementsByClassName?.('el-upload-dragger')[0];
                if (!dragDom) {
                    console.warn('拦截 ElUpload 拖拽方法失败, 请记录 element-plus 版本号并联系开发者');
                }
                else {
                    dragDom.addEventListener('drop', interceptDrop, { capture: true });
                    onBeforeUnmount(() => dragDom.removeEventListener('drop', interceptDrop, { capture: true }));
                    /** 拦截原生拖拽事件, 对文件做处理并直接上传(禁用内部拖拽上传逻辑) */
                    async function interceptDrop(ev: DragEvent) {
                        ev.preventDefault();
                        ev.stopPropagation();
                        if (plain.globalReadonly.value || plain.globalDisabled.value || contentActualProps.value.disabled) return;

                        let files = Array.from(ev.dataTransfer!.files) as UploadRawFile[];
                        const items = ev.dataTransfer!.items || [];
                        if (props.directory) {
                            const entries = Array.from(items)
                                .map((item) => item?.webkitGetAsEntry?.())
                                .filter((entry) => entry) as FileSystemEntry[];

                            const allFiles = await Promise.all(entries.map(getAllFiles));
                            files = flat(allFiles);
                        }
                        else {
                            files.forEach((file, index) => {
                                const item = items[index];
                                const entry = item?.webkitGetAsEntry?.();
                                if (entry) {
                                    file.isDirectory = entry.isDirectory;
                                }
                            });
                        }
                        const filterFiles = uploadPrefix(files);
                        const limit = contentActualProps.value.limit as number | undefined;
                        const _checked = plain.checked.value || [];
                        if (limit && _checked.length + filterFiles.length > limit) {
                            return handleExceed(filterFiles, _checked);
                        }
                        upload(filterFiles);
                    }
                }
            }
        });

        /**
         * 上传前置函数 - 处理文件过滤
         *
         * @param files 要上传的文件列表
         * @returns 过滤后符合条件的文件列表
         */
        function uploadPrefix(files: UploadRawFile[]) {
            const _checked = (plain.checked.value as UploadFile[]) || [];
            const fileMaxSize = props.fileMaxSize;
            // 过滤不符合上传条件的文件
            const filterFiles = files.filter((file) => {
                // 超过文件大小限制的不上传
                if (fileMaxSize && file.size > fileMaxSize) {
                    props.fileMaxSizeToast(file, fileMaxSize);
                    return false;
                }
                // 文件重复的不上传
                const r = _checked.find((v) => v.name === file.name && v.raw?.type === file.type);
                if (r) {
                    props.fileRepeatToast(r.raw!);
                    return false;
                }
                return true;
            });
            return filterFiles;
        }

        /**
         * 处理超出文件数量限制事件
         *
         * @param files 当前选择的文件列表
         * @param uploadFiles 已上传的文件列表
         */
        function handleExceed(files: File[], uploadFiles: UploadUserFile[]) {
            const _props = contentActualProps.value;
            const _checked = (plain.checked.value as UploadFile[]) || [];
            const total = files.length + _checked.length;
            let discardFiles: File[] = [];
            if (_props.limit && total > _props.limit) {
                // 超过数量时
                // 如果开启覆盖, 则从现有文件中删除超过的数量
                // 否则从待上传文件中删除超过的数量
                if (props.override) {
                    for (let i = total - _props.limit; i > 0; i--) {
                        // @ts-expect-error 内部未补充 uploadFiles 声明
                        if (_checked.length) discardFiles.push(_checked.splice(0, 1)[0]);
                        else if (files.length) discardFiles.push(files.splice(0, 1)[0]);
                    }
                }
                else {
                    discardFiles.push(...files.splice(0, files.length - (_props.limit - _checked.length)));
                }
            }

            // 显示超出限制的提示
            discardFiles.length && props.onExceedToast(discardFiles, props.override);
            discardFiles = [];

            // 处理剩余文件的上传
            upload(files as any[]);
        }

        /** 将文件放置待上传列表, 并根据状态确定是否自动上传 */
        function upload(files: UploadRawFile[]) {
            files.forEach((file) => {
                file.uid = genFileId();
                uploadRef.value!.handleStart(file);
                props.autoUpload && uploadRef.value!.submit();
            });
        }

        return {
            uploadRef,
            hyphenate,
            getNode,
            ...plain,
            formItemActualProps,
            contentActualProps,
            slotProps,
            finalHttpRequest,
            handleExceed,
        };
    },
});
</script>

<style lang="css" scoped></style>
