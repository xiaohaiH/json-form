import * as JSONForm from '@xiaohaih/json-form-plus';
import { ElFormItem, ElMessage } from 'element-plus';
import * as Vue from 'vue';

window.Vue = { set: (a, b, c) => a[b] = c, ...Vue };
window.JSONForm = JSONForm;

window.Ui = { toast: ElMessage, ElFormItem };
