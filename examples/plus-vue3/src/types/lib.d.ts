import type * as JSONForm from '@xiaohaih/json-form-plus';
import type { ElFormItem, ElMessage } from 'element-plus';
import type * as Vue from 'vue';

declare module 'virtual:package';

declare global {
    interface Window {
        Vue: typeof Vue & { set: (a: any, b: string, c: any) => void };
        JSONForm: typeof JSONForm;
        Ui: { toast: typeof ElMessage; ElFormItem: typeof ElFormItem };
    }
}
