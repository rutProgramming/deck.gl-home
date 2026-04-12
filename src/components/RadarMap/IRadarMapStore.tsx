import type { Plane } from "../../domain/plane.types";

export interface IRadarMapStore {
    readonly visiblePlanes: Plane[];
    readonly selectedPlane: Plane | null;
    readonly selectedPlaneId: string | null;
    selectPlane(id: string): void;
}