import ElementPlus from 'element-plus';
import { createApp } from 'vue';
import App from './App.vue';
import 'element-plus/dist/index.css';
import '@unocss/reset/tailwind-compat.css';
import 'uno.css';
import './style.css';
import '~share/style.scss';

const app = createApp(App).use(ElementPlus);
app.mount('#app');
