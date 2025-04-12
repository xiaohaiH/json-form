<template>
    <div>
        <div class="min-h-50px lh-50px">
            {{ query }}
        </div>
        <HForm
            ref="hFormRef"
            class="example-form flex flex-wrap"
            label-width="110px"
            :datum="formCondition"
            :rules="rules"
            :backfill="query"
            :render-btn="false"
            :realtime="true"
            :immediate-search="true"
            @search="query = $event"
            @reset="query = $event"
        />
        <ElButton @click="validate">
            校验
        </ElButton>
        <ElButton @click="validateField">
            逐个校验
        </ElButton>
        <ElButton @click="clearValidate">
            清空校验
        </ElButton>
        <ElButton @click="reset">
            重置
        </ElButton>
    </div>
</template>

<script lang="tsx" setup>
import { defineOption, HForm } from '@xiaohaih/json-form-plus';
import { conditionFactory } from '~share/form';
import { ElCascader } from 'element-plus';
import { markRaw, nextTick, onMounted, ref } from 'vue';

/** @file 作为表单显示 */
defineOption({
    name: 'ExampleForm',
});

const hFormRef = ref<InstanceType<typeof HForm>>();
const query = ref<Record<string, any>>({
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
</script>

<style lang="scss" scoped></style>
