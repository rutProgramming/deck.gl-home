import type { Car } from "../../models/Car";
import type { MapObject } from "../../models/MapObject";
import type { Plane } from "../../models/Plane";
import { MapWorkerObjectStoreBase } from "./MapWorkerObjectStoreBase";

export type StoreKey = "plane" | "car";

class MapWorkerStore {
    planeStore = new MapWorkerObjectStoreBase<Plane>();
    carStore = new MapWorkerObjectStoreBase<Car>();

    stores: Record<StoreKey, MapWorkerObjectStoreBase<MapObject>> = {
        plane: this.planeStore,
        car: this.carStore,
    };
    setAllData(data: Partial<Record<StoreKey, MapObject[]>>) {
        Object.entries(data).forEach(([key, items]) => {
            this.stores[key as StoreKey]?.setMapObjects(items);
        });
    }

}
export const mapWorkerStore = new MapWorkerStore()