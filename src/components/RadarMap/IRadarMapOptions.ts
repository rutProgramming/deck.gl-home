import type { IRadarLayer } from "./IRadarLayer";
import type { IRadarMapStore } from "./IRadarMapStore";
import type { ViewState } from "./RadarMap.type";

export interface IRadarMapOptions {
    initialViewState: ViewState;
    createLayer: () => IRadarLayer;
    getVisiblePlanes: (bounds: { west: number; east: number; north: number; south: number }) => void;
    store: IRadarMapStore;
}