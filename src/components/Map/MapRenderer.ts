import { makePlanesIconLayer } from "../../layers/planesIconLayer";
import type { Plane } from "../../planeUtils/plane.types";
import { planesStore } from "../../store/planes.store";
import { DeckGlMaplibreglRenderer } from "./DeckGlMaplibreglRenderer";
import plane from "../../assets/PM.png";
import { createContext } from "react";
import type { BBox } from "../../workers/types";



export abstract class MapRenderer<T> {
    abstract attach(container: HTMLDivElement): void;
    abstract renderItems(data: T[], selectedId: string | null): void;
    abstract getBounds(): BBox | null;
    abstract cleanUp(): void;
    abstract flyToLocation(lon: number, lat: number): void;
}
export const mapRenderer:MapRenderer<Plane> = new DeckGlMaplibreglRenderer<Plane>(
            (id) => planesStore.selectPlane(id),
            ({ data, selectedId, onPickItem }) => makePlanesIconLayer({ data, selectedId, iconAtlas: plane ,onPickPlane: onPickItem })
        )

export const MapRendererContext =
  createContext<MapRenderer<Plane> | null>(null);


        


