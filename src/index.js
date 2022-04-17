import Vue from "vue";
import XGantt from "./components/root";
import XColumn from "./components/column";
import XSlider from "./components/slider";
import animated from "animate.css";

import "./styles/index.styl";

Vue.use(animated);

XGantt.install = function(Vue) {
  Vue.component(XColumn.name, XColumn);
  Vue.component(XSlider.name, XSlider);
  Vue.component(XGantt.name, XGantt);
};

export default XGantt;
