import { makeAutoObservable } from "mobx";
import type { LayerData } from "../components/Map/IMapRenderer";
import type { Car } from "../models/Car";
import type { MapObject } from "../models/MapObject";
import type { Plane } from "../models/Plane";
import { MapObjectsStore } from "./mapObjectStore.store";

export type ObjectType = "plane" | "car";
class MapStore {
    planeStore = new MapObjectsStore<Plane>();
    carStore = new MapObjectsStore<Car>();
    selectedMapObjectId: string | null = null;
    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    getStore(type: ObjectType) {
        switch (type) {
            case "plane":
                return this.planeStore;
            case "car":
                return this.carStore;
            default:
                throw new Error(`Unknown object type: ${type}`);
        }
    }
    getLayerData(): LayerData {
    return {
        cars: this.carStore.visibleMapObjects,
        planes: this.planeStore.visibleMapObjects,
    };
}
    selectMapObject(id: string | null) {
        this.selectedMapObjectId = id;
    }
    get selectedMapObject(): MapObject | null {
        return (
            this.planeStore.allMapObjectsById.get(this.selectedMapObjectId!) ??
            this.carStore.allMapObjectsById.get(this.selectedMapObjectId!) ??
            null
        );
    }
}
export const mapStore = new MapStore()