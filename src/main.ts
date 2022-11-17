import Vue from 'vue';
// import XGantt from '@xpyjs/gantt-vue2-test';
// import XGantt from 'gantt-vue2';
// import 'gantt-vue2/lib/index.css';
import App from './App.vue';

// eslint-disable-next-line import/no-named-as-default
import XGantt from './index';

// import '@xpyjs/gantt-vue2-test/lib/index.css';
// import '../lib/index.css';

Vue.config.productionTip = false;

Vue.use(XGantt);

new Vue({
  render: h => h(App)
}).$mount('#app');
