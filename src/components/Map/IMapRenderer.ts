import type { ViewState } from "./Map.type";

export interface IMapRenderer<T> {
    attach(container: HTMLDivElement): void;
    setViewState(viewState: ViewState): void;
    renderItems(data: T[], selectedId: string | null): void;
    cleanUp(): void;
    getMapInstance(): maplibregl.Map | undefined;
    flyToLocation(lat: number, lon: number): void;
}


