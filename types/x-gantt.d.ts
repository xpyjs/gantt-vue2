import Vue from "vue";

import { XGanttComponent } from "./component";

export function install(vue: typeof Vue): void;

import { XGanttRootComponent } from "./packages/root";
import { XGanttColumnComponent } from "./packages/column";
import { XGanttSliderComponent } from "./packages/slider";

export class XGantt extends XGanttRootComponent {
  setSelected: (data: any) => void;
}
export class XGanttColumn extends XGanttColumnComponent {}
export class XGanttSlider extends XGanttSliderComponent {}
