import { makePlanesIconLayer } from "../../layers/planesIconLayer";
import type { Plane } from "../../planeUtils/plane.types";
import { planesStore } from "../../store/planes.store";
import { DeckGlMaplibreglRenderer } from "./DeckGlMaplibreglRenderer";
import plane from "../../assets/PM.png";
import { createContext } from "react";

export interface IMapRenderer<T> {
    attach(container: HTMLDivElement): void;
    renderItems(data: T[], selectedId: string | null): void;
    getBounds(): maplibregl.LngLatBounds | undefined;//do spesific type
    cleanUp(): void;
    getMapInstance(): maplibregl.Map | undefined;
    flyToLocation(lat: number, lon: number): void;
}

export const renderer:IMapRenderer<Plane> = new DeckGlMaplibreglRenderer<Plane>(
            (id) => planesStore.selectPlane(id),
            ({ data, selectedId, onPickItem }) => makePlanesIconLayer({ data, selectedId, iconAtlas: plane ,onPickPlane: onPickItem })
        )

export const MapRendererContext =
  createContext<IMapRenderer<Plane> | null>(null);


        


