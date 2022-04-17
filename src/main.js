import Vue from "vue";
import App from "./App.vue";
import XGantt from "./index.js";

Vue.use(XGantt);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
