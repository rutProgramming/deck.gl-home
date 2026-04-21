import { makeAutoObservable } from "mobx";
import type { LayerData } from "../components/Map/IMapRenderer";
import type { Car } from "../models/Car";
import { MapObjectsStore } from "./mapObjectStore.store";
import { PlaneStore } from "./PlaneStore";

export type ObjectType = "plane" | "car";
class MapStore {
    planeStore = new PlaneStore();
    carStore = new MapObjectsStore<Car>();
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

}
export const mapStore = new MapStore()