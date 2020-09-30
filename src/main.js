import Vue from "vue";
import App from "./App.vue";
import Gantt from "./index.js";

Vue.use(Gantt);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
