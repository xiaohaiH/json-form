import ElementUI from 'element-ui';
import Vue from 'vue';
import App from './App.vue';
import 'element-ui/lib/theme-chalk/index.css';
import '@unocss/reset/tailwind-compat.css';
import 'uno.css';
import './style.css';
import '~share/style.scss';

const app = new Vue({ render: (h) => h(App) });
Vue.use(ElementUI);
app.$mount('#app');
