import Vue from "vue";
import Gantt from "./components/root";
import Column from "./components/column";
import Slider from "./components/slider";
import animated from "animate.css";

import "./styles/index.styl";

Vue.use(animated);

Gantt.install = function(Vue) {
  Vue.component(Column.name, Column);
  Vue.component(Slider.name, Slider);
  Vue.component(Gantt.name, Gantt);
};

export default Gantt;
