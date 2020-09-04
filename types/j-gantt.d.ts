import Vue from "vue";

import { JGanttComponent } from "./component";

export function install (vue: typeof Vue): void;

import { JGanttRootComponent } from "./packages/root";
import { JGanttColumnComponent } from "./packages/column";
import { JGanttSliderComponent } from "./packages/slider";

export class JGantt extends JGanttRootComponent {}
export class JGanttColumn extends JGanttColumnComponent {}
export class JGanttSlider extends JGanttSliderComponent {}
