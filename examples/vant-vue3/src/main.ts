import Vant, { Lazyload } from 'vant';
import { createApp } from 'vue';
import App from './App.vue';
import 'vant/lib/index.css';
import '@unocss/reset/tailwind-compat.css';
import 'uno.css';
import './style.css';
import '~share/style.scss';

const app = createApp(App).use(Vant).use(Lazyload);
app.mount('#app');
