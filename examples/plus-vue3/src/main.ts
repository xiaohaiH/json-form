import ElementPlus from 'element-plus';
import { createApp } from 'vue';
import './plus';
/* eslint-disable perfectionist/sort-imports */
import App from './App.vue';
/* eslint-enable perfectionist/sort-imports */
import 'element-plus/dist/index.css';
import '@unocss/reset/tailwind-compat.css';
import 'uno.css';
import './style.css';
import '~share/style.scss';

const app = createApp(App).use(ElementPlus);
app.mount('#app');
