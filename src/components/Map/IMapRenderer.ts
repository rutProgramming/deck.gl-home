import { makeMapObjectIconLayer } from "../../layers/mapObjectsIconLayer";
import { DeckGlMaplibreglRenderer } from "./DeckGlMaplibreglRenderer";
import plane from "../../assets/PM.png";
import car from "../../assets/car.png";
import { createContext } from "react";
import type { BBox } from "../../workers/types";
import type { MapObject } from "../../models/MapObject";
import { mapObjectsStore } from "../../store/mapObjectStore.store";
import type { Plane } from "../../models/Plane";
import { countryToRgb } from "../../planeUtils/plane.color";
import type { Car } from "../../models/Car";

export interface IMapRenderer<T> {
    attach(container: HTMLDivElement): void;
    renderItems(data: T[], selectedId: string | null): void;
    getBounds(): BBox | null
    onBoundsChange?: () => void
    cleanUp(): void;
    flyToLocation(lat: number, lon: number): void;
}



export const mapRenderer = new DeckGlMaplibreglRenderer<MapObject>(
    (id) => mapObjectsStore.selectMapObject(id),
    ({ data, selectedId, onPickItem }) => {
        const planes = data.filter((o:MapObject )=> o.type === "plane") as Plane[]
        const cars = data.filter((o:MapObject) => o.type === "car") as Car[]
        
        return [
            makeMapObjectIconLayer<Car>({ 
                id: "car-layer",
                data: cars, selectedId, iconAtlas: car,
                onPick: onPickItem,
            }),
            makeMapObjectIconLayer<Plane>({ 
                id: "plane-layer",
                data: planes, selectedId, iconAtlas: plane,
                onPick: onPickItem,
                getAngle: (item) => item.heading ?? 0,
                getColor: (item) => countryToRgb(item.country)
            }),
        ]
    }
);
export const MapRendererContext =
  createContext<IMapRenderer<MapObject> | null>(null);


        


