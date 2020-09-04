import { JGanttComponent } from "../component";

export type SliderAlignment = "left" | "center" | "right";

export declare class JGanttSliderComponent extends JGanttComponent {
    alignment: SliderAlignment
    bgColor: string
    dateFormat: string
    emptyData: string
    flat: boolean
    label: string
    linkedResize: boolean
    move: boolean
    resizeLeft: boolean
    resizeRight: boolean
}
