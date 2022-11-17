/**
 * 组件入口文件
 */
import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';

import XGantt from './components/root/RootWrap.vue';
import XGanttColumn from './components/column/index.vue';
import XGanttSlider from './components/slider/index.vue';
import './styles/index.scss';
import { Variables } from './constants/vars';

Vue.use(VueCompositionApi);

XGantt.install = app => {
  app.component(Variables.name.root, XGantt);
  app.component(Variables.name.column, XGanttColumn);
  app.component(Variables.name.slider, XGanttSlider);
};

const install = (app: any) => {
  app.use(XGantt);
};

export default {
  install,
  XGantt,
  XGanttColumn,
  XGanttSlider
};

// export { XGantt, XGanttColumn, XGanttSlider };
