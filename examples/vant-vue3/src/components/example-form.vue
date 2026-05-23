<template>
    <div class="example-form">
        <VanNoticeBar class="mb-10px flex-none" type="success" :closable="false">
            {{ query }}
        </VanNoticeBar>
        <HForm
            ref="hFormRef"
            class="flex flex-wrap"
            label-width="110px"
            :config="formCondition"
            :rules="rules"
            :model="query"
            @submit="submit"
        />
        <div class="flex flex-wrap ml--10px">
            <VanButton class="mt-10px ml-10px" @click="submitHandle">
                提交
            </VanButton>
            <VanButton class="mt-10px ml-10px" @click="validate">
                校验
            </VanButton>
            <VanButton class="mt-10px ml-10px" @click="validateField">
                逐个校验
            </VanButton>
            <VanButton class="mt-10px ml-10px" @click="clearValidate">
                清空校验
            </VanButton>
            <VanButton class="mt-10px ml-10px" @click="reset">
                重置
            </VanButton>
        </div>
    </div>
</template>

<script lang="tsx" setup>
import type { HFormInstance } from '@xiaohaih/json-form-vant';
import { defineOption, HForm } from '@xiaohaih/json-form-vant';
import { conditionFactory } from '~share/form';
import { markRaw, nextTick, onMounted, ref } from 'vue';

/** @file 作为表单显示 */
defineOptions({
    name: 'ExampleForm',
});

const hFormRef = ref<HFormInstance>();
const query = ref<Record<string, any>>({
    布局组件: [
        {},
        {},
    ],
    时间: '11:11:11',
    // input1: '1',
    // input2: '2',
    // select1: '1',
    // select2: '22',
    // cas1: 'aa',
    // cas2: 'cas2AA1',
    // datepikcer1: '2024-03-24',
    // datepikcer2: ['2024-03-24', '2024-03-28'],
    // check1: ['check1'],
    // check2: ['che1'],
    // radio1: 'radio1',
    // radio2: 'rad1',
});
const formCondition = conditionFactory().condition;

const rules = {
    input1: [{ required: true, message: 'formRules' }],
    input2: [
        {
            validator: (rule: any, val: string, cb: (arg?: any) => void) =>
                val !== '123' ? cb('not 123 from formRules') : cb(),
            message: 'not 123 from formRules',
        },
    ],
    select1: [{ required: true, message: 'select form FormRules' }],
    datepikcer1: [{ required: true, message: 'datepicker form FormRules' }],
    cas1: [{ required: true, message: 'cascader form FormRules' }],
    check1: [{ required: true, message: 'check form FormRules' }],
    radio1: [{ required: true, message: 'radio form FormRules' }],
};
function submit(query: Record<string, any>) {
    console.log(query);
}
function validate() {
    hFormRef.value?.validate();
}
const keys = Object.keys(formCondition);
let idx = 0;
function validateField() {
    clearValidate();
    hFormRef.value?.validateField(keys[idx % keys.length]);
    idx = (idx + 1) % keys.length;
}
function clearValidate() {
    hFormRef.value?.clearValidate();
}
function reset() {
    hFormRef.value?.reset();
}
function submitHandle() {
    hFormRef.value?.submit();
}
</script>

<style lang="scss" scoped></style>
