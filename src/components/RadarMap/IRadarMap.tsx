import type { RefObject } from "react";
import type { Props, ViewState } from "./RadarMap.type";


export interface IRadarMap{
    createLayer(mapContainerRef: RefObject<HTMLDivElement | null>, initialViewState: ViewState):void 
    setLayerProps( prosName: 'viewState' | 'layers', props: Partial<Props>):void
    finalize():void
}