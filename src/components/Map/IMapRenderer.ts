import type { ViewState } from "./Map.type";

export interface IMapRenderer<T> {
    attach(container: HTMLDivElement): void;
    renderItems(data: T[], selectedId: string | null): void;
    getBounds(): maplibregl.LngLatBounds | undefined;//do spesific type
    cleanUp(): void;
    getMapInstance(): maplibregl.Map | undefined;
    flyToLocation(lat: number, lon: number): void;
}

// export const renderer:IMapRenderer<> = 
