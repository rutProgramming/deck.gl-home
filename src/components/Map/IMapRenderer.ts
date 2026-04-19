import { makeMapObjectIconLayer } from "../../layers/mapObjectsIconLayer";
import { DeckGlMaplibreglRenderer } from "./DeckGlMaplibreglRenderer";
import plane from "../../assets/PM.png";
import car from "../../assets/car.png";
import { createContext } from "react";
import type { BBox } from "../../workers/types";
import type { MapObject } from "../../models/MapObject";
import type { Plane } from "../../models/Plane";
import { countryToRgb } from "../../planeUtils/plane.color";
import type { Car } from "../../models/Car";
import { mapStore } from "../../Store/Mapstore";

export interface IMapRenderer<T>{
    attach(container: HTMLDivElement): void;
    // renderItems(cars: Car[], planes: Plane[], selectedId: string | null): void;
    renderItems(data:T, selectedId: string | null): void;
    getBounds(): BBox | null
    onBoundsChange?: () => void
    cleanUp(): void;
    flyToLocation(lat: number, lon: number): void;
}


export type LayerData = {
    cars: Car[];
    planes: Plane[];
}

export const mapRenderer = new DeckGlMaplibreglRenderer<LayerData>(
    (id) => mapStore.selectMapObject(id),
    ({data, selectedId, onPickItem}) => {

        return [
            makeMapObjectIconLayer<Car>({
                id: "car-layer",
                data: data.cars, selectedId, iconAtlas: car,
                onPick: onPickItem,
            }),
            makeMapObjectIconLayer<Plane>({
                id: "plane-layer",
                data: data.planes, selectedId, iconAtlas: plane,
                onPick: onPickItem,
                getAngle: (item) => item.heading ?? 0,
                getColor: (item) => countryToRgb(item.country)
            }),
        ]
    }
);
export const MapRendererContext =
    createContext<IMapRenderer<LayerData> | null>(null);





