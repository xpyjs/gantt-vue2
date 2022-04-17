import { XGanttComponent } from "../component";

export declare class XGanttRootComponent extends XGanttComponent {
  bodyStyle: {
    bgColor: string;
    borderColor: string;
    hoverColor: string;
    selectColor: string;
    textColor: string;
    todayColor: string;
    weekendColor: string;
  };
  border: number;
  dark: boolean;
  data: any[];
  dataIndex: string;
  endKey: string;
  expandAll: boolean;
  ganttColumnWidth: number | string;
  headerHeight: number | string;
  headerStyle: {
    bgColor: string;
    borderColor: string;
    textColor: string;
  };
  levelColor: string[];
  rowHeight: number | string;
  showCheckbox: boolean;
  showexpand: boolean;
  showToday: boolean;
  showWeekend: boolean;
  startKey: string;
}
