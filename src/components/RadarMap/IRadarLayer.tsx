import type { Plane } from "../../domain/plane.types";
import type { ViewState } from "./RadarMap.type";

export interface IRadarLayer {
    attach(container: HTMLDivElement): void;
    setViewState(viewState: ViewState): void;
    renderPlanes(planes: Plane[], selectedPlaneId: string | null): void;
    finalize(): void;
}