import './assets/main.css';
import { init } from '../../../src/main/index';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);

init({
  reportUrl: `http://localhost:3000/monitor`,
  source: 'PC',
  isLazyReport: true,
});

app.use(router);

app.mount('#app');
