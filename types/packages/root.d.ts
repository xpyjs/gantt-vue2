import { JGanttComponent } from "../component";

export declare class JGanttRootComponent extends JGanttComponent {
    data: any[]
    dataIndex: string
    endKey: string
    expandAll: boolean
    startKey: string
    bodyStryle: {
        bgColor: string,
        borderColor: string,
        textColor: string,
        todayColor: string,
        weekendColor: string
    }
    border: number
    headerHeight: number | string
    headerStyle: {
        bgColor: string,
        borderColor: string,
        textColor: string
    }
    ganttColumnWidth: number | string
    levelColor: string[]
    rowHeight: number | string
    showCheckbox: boolean
    showexpand: boolean
    showToday: boolean
    showWeekend: boolean
}
