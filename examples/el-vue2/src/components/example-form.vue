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
            @search="querySearch"
            @reset="querySearch"
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

<script lang="tsx">
import type { HFormInstance } from '@xiaohaih/json-form-el';
import { defineOption, HForm } from '@xiaohaih/json-form-el';
import { conditionFactory } from '~share/form';
import { defineComponent, markRaw, nextTick, onMounted, ref, set } from 'vue';

/** @file 作为表单显示 */
export default defineComponent({
    name: 'ExampleForm',
    components: { HForm },
    setup() {
        const hFormRef = ref<HFormInstance>();
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
            hFormRef.value?.validateToast
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
        function querySearch(_query: Record<string, any>) {
            // console.log(_query)
            set(query, 'value', _query);
        }

        return {
            hFormRef,
            query,
            formCondition,
            rules,
            validate,
            validateField,
            clearValidate,
            querySearch,
            reset,
        };
    },
});
</script>

<style lang="scss" scoped></style>
