<template>
    <!--
      上传组件表单项容器
      禁用Vue ESLint规则以避免检查废弃API的使用，保持与Vue2兼容
    -->
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child -->
    <ElFormItem
        v-if="!insetHide"
        :class="`json-form-item json-form-item--upload json-form-item--${field} json-form-item--${!!slots.postfix}`"
        v-bind="formItemActualProps"
        :prop="formItemActualProps.prop || field"
    >
        <!-- 表单项前置内容插槽 -->
        <template v-if="slots.before || $slots.before">
            <component :is="getNode(slots.before || $slots.before, slotProps)" />
        </template>
        <!-- 自定义默认插槽内容 -->
        <template v-if="slots.default">
            <component :is="getNode(slots.default, slotProps)" />
        </template>
        <!-- 默认上传组件渲染 -->
        <slot v-else v-bind="slotProps">
            <ElUpload
                ref="uploadRef"
                class="json-form-item__content"
                action="-"
                :http-request="finalHttpRequest"
                :on-exceed="handleExceed"
                :on-remove="handleRemove"
                :on-error="handleError"
                :file-list="checked"
                v-bind="contentActualProps2"
                :disabled="globalReadonly || globalDisabled || contentActualProps2.disabled"
                v-on="$listeners"
            >
                <!-- 自定义默认内容插槽，暂时注释掉
                <template v-if="itemSlots.default" #default>
                    <div>
                        <div>123</div>
                        <component :is="getNode(itemSlots.default, slotProps)" />
                    </div>
                </template>
                <template v-else #default>
                    <ElButton v-bind="buttonAttrs">
                        {{ buttonText }}
                    </ElButton>
                </template> -->

                <!-- 上传区域触发按钮插槽 -->
                <template v-if="itemSlots.trigger" #trigger>
                    <component :is="getNode(itemSlots.trigger, slotProps)" />
                </template>

                <!-- 上传提示说明插槽 -->
                <template v-if="itemSlots.tip" #tip>
                    <component :is="getNode(itemSlots.tip, slotProps)" />
                </template>

                <!-- 动态命名插槽，暂时注释掉
                <template v-for="(item, slotName) of itemSlots" :key="slotName" #[hyphenate(slotName)]="row">
                    <component :is="getNode(item)" v-bind="slotProps" v-bind.prop="row" :uploadRef="uploadRef" />
                </template> -->
            </ElUpload>
        </slot>
        <!-- 表单项后置内容插槽 -->
        <template v-if="slots.after || $slots.after">
            <component :is="getNode(slots.after || $slots.after, slotProps)" />
        </template>
        <!-- 表单项额外后缀插槽 -->
        <div v-if="slots.postfix || $slots.postfix" class="json-form-item__postfix">
            <component :is="getNode(slots.postfix || $slots.postfix)" />
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { hyphenate, usePlain } from '@xiaohaih/json-form-core';
import { Button as ElButton, FormItem as ElFormItem, Upload as ElUpload } from 'element-ui';
import type { ElUploadInternalFileDetail as UploadFile, ElUploadInternalRawFile as UploadRawFile, HttpRequestOptions as UploadRequestOptions } from 'element-ui/types/upload.d';
import { computed, defineComponent, onMounted, ref } from 'vue-demi';
import { getNode, pick } from '../../src/utils';
import { formItemPropKeys } from '../share';
import type { UploadSlots } from './types';
import { uploadEmitsPrivate as emits, genFileId, uploadPropsPrivate as props } from './types';

/** 用户上传文件类型，从UploadFile类型扩展并修改部分属性为可选 */
type UploadUserFile = Omit<UploadFile, 'status' | 'uid'> & Partial<Pick<UploadFile, 'status' | 'uid'>>;

/**
 * @file 上传组件
 *
 * 基于Element UI的上传组件进行封装，提供与JSON表单系统集成的能力
 * 支持动态属性配置、插槽自定义、文件大小限制、文件数量限制等特性
 * 包含文件上传前的校验、文件大小限制、文件重复检测等功能
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
    // slots: Object as SlotsType<UploadSlots>,
    setup(props, ctx) {
        // 上传组件实例引用，用于调用上传组件内部方法
        const uploadRef = ref<InstanceType<typeof ElUpload>>();

        // 计算表单项静态属性
        const formItemStaticProps = computed(() => {
            const { formItemProps } = props;
            return { ...pick(props, formItemPropKeys), ...formItemProps };
        });

        // 计算表单项实际属性（合并静态和动态属性）
        const formItemActualProps = computed(() => {
            const { query, formItemDynamicProps } = props;
            return formItemDynamicProps ? { ...formItemStaticProps.value, ...formItemDynamicProps({ query }) } : formItemStaticProps.value;
        });

        // 计算内容静态属性
        const contentStaticProps = computed(() => ({ autoUpload: props.autoUpload, ...ctx.attrs, ...props.staticProps }));

        // 计算内容实际属性（合并静态和动态属性）
        const contentActualProps = computed(() => {
            const { query, dynamicProps } = props;
            return dynamicProps ? { ...contentStaticProps.value, ...dynamicProps({ query }) } : contentStaticProps.value;
        });

        // 实际传给上传组件的属性，排除已经在组件中单独处理的事件属性
        const contentActualProps2 = computed(() => {
            const { onExceed, onRemove, onError, ...args } = contentActualProps.value;
            return args;
        });

        // 使用核心库的usePlain钩子处理组件状态和逻辑
        const plain = usePlain(props);

        // 计算最终的http请求处理函数，如果有自定义的httpRequest则使用customHttpRequest包装
        const finalHttpRequest = computed(() => contentActualProps.value.httpRequest && customHttpRequest);

        /**
         * 自定义HTTP请求处理函数
         * 防止Promise结果和回调函数都执行时，结果会执行两次
         *
         * @param option 上传请求选项
         * @returns 处理结果
         */
        function customHttpRequest(option: UploadRequestOptions) {
            let isFinish = false;
            const _option = { ...option, onSuccess, onError };

            // 包装成功回调函数，确保只执行一次
            function onSuccess(...args: Parameters<UploadRequestOptions['onSuccess']>) {
                if (isFinish) return;
                isFinish = true;
                option.onSuccess(...args);
            }

            // 包装错误回调函数，确保只执行一次
            function onError(...args: Parameters<UploadRequestOptions['onError']>) {
                if (isFinish) return;
                isFinish = true;
                option.onError(...args);
            }

            // 调用用户自定义的httpRequest处理函数
            const r = contentActualProps.value.httpRequest!(_option);
            // 如果返回Promise，则处理异步结果
            // @ts-expect-error element-ui内部将其置为void, 实际不是
            if (r instanceof Promise) r.then(onSuccess).catch(onError);
            else return r;
        }

        // 组件挂载后的处理，主要是拦截上传事件
        onMounted(() => {
            const insetUploadRef = uploadRef.value?.$refs['upload-inner'] as any;
            if (!insetUploadRef) return;
            const rawUploadFiles = insetUploadRef.uploadFiles;
            // 拦截上传事件, element-ui 内部暴露出来的事件不好用
            insetUploadRef.uploadFiles = function uploadFiles(files: FileList) {
                const _files = uploadPrefix(files);
                if (_files.length) {
                    rawUploadFiles(_files);
                    // @ts-expect-error 内部未对该方法补充声明
                    plain.change(uploadRef.value!.uploadFiles);
                }
            };
        });

        /**
         * 上传前置函数 - 处理文件过滤
         *
         * @param files 要上传的文件列表
         * @returns 过滤后符合条件的文件列表
         */
        function uploadPrefix(files: FileList) {
            if (files.length === 0) return [];
            const _checked = (plain.checked.value as UploadFile[]) || [];
            // @ts-expect-error staticProps 中未补充 fileMaxSize 声明
            const fileMaxSize = contentActualProps.value.fileMaxSize || props.fileMaxSize;
            // 过滤不符合上传条件的文件
            const filterFiles = Array.from(files).filter((file) => {
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
        function handleExceed(files: File[], uploadFiles: UploadFile[]) {
            const _props = contentActualProps.value;
            // 如果用户提供了自定义的onExceed处理函数，则直接调用
            if (_props.onExceed) return _props.onExceed(files as any, uploadFiles);

            const _checked = (plain.checked.value as UploadFile[]) || [];
            const total = files.length + _checked.length;
            let discardFiles: File[] = [];
            // @ts-expect-error staticProps 中未补充 override 声明
            const override = contentActualProps.value.override === undefined ? props.override : contentActualProps.value.override;

            if (_props.limit && total > _props.limit) {
                // 超过数量时
                // 如果开启覆盖, 则从现有文件中删除超过的数量
                // 否则从待上传文件中删除超过的数量
                if (override) {
                    for (let i = total - _props.limit; i > 0; i--) {
                        // @ts-expect-error 内部未补充 uploadFiles 声明
                        if (uploadRef.value.uploadFiles.length) discardFiles.push(uploadRef.value.uploadFiles.splice(0, 1)[0]);
                        else if (files.length) discardFiles.push(files.splice(0, 1)[0]);
                    }
                }
                else {
                    discardFiles.push(...files.splice(0, files.length - (_props.limit - _checked.length)));
                }
            }

            // 显示超出限制的提示
            discardFiles.length && props.onExceedToast(discardFiles, override);
            discardFiles = [];

            // 处理剩余文件的上传
            files.forEach((file) => {
                (file as any).uid = genFileId();
                // @ts-expect-error 内部未对该方法补充声明
                uploadRef.value.handleStart(file);
                _props.autoUpload && uploadRef.value!.submit();
            });
        }

        /**
         * 处理移除文件事件
         *
         * @param file 被移除的文件
         * @param files 移除后的文件列表
         */
        function handleRemove(file: UploadFile, files: UploadFile[]) {
            plain.change(files);
            contentActualProps.value.onRemove?.(file, files);
        }

        /**
         * 处理上传错误事件
         *
         * @param err 错误信息
         * @param file 出错的文件
         * @param files 当前的文件列表
         */
        function handleError(err: ErrorEvent, file: UploadFile, files: UploadFile[]) {
            plain.change(files);
            contentActualProps.value.onError?.(err, file, files);
        }

        // 计算插槽属性，用于传递给插槽组件
        const slotProps = computed(() => ({
            uploadRef: uploadRef.value,
            getFormItemProps: () => formItemActualProps.value,
            getItemProps: () => contentActualProps.value,
            getProps: () => props,
            extraOptions: {
                value: plain.checked.value,
                options: plain.finalOption.value,
                onChange: plain.change,
                httpRequest: finalHttpRequest,
                onExceed: handleExceed,
                onRemove: handleRemove,
                onError: handleError,
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
            contentActualProps2,
            finalHttpRequest,
            handleExceed,
            handleRemove,
            handleError,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>
