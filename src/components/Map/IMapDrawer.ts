import type { ViewState } from "./Map.type";

export interface IMapDrawer<T> {
    attach(container: HTMLDivElement): void;
    setViewState(viewState: ViewState): void;
    renderItems(data: T[], selectedId: string | null): void;
    cleanUp(): void;
    getMapInstance(): maplibregl.Map | undefined;
    flyToPlane(lat: number, lon: number): void;
}


