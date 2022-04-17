import { XGanttComponent } from "../component";

export declare class XGanttColumnComponent extends XGanttComponent {
  center: boolean;
  dateFormat: string;
  emptyData: string;
  label: string;
  merge: (data: any) => boolean | boolean;
  name: string;
  selectable: boolean;
  width: number | string;
}
