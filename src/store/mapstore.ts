import { makeAutoObservable } from "mobx";
import type { Car } from "../models/Car";
import { PlaneStore } from "./PlaneStore";
import type { StoreKey } from "../workers/workerStore/MapWorkerStore";
import type { MapObject } from "../models/MapObject";
import { MapObjectsStoreBase } from "./mapObjectStoreBase";
class MapStore {
    planeStore = new PlaneStore();
    carStore = new MapObjectsStoreBase<Car>();


    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    stores: Record<StoreKey, MapObjectsStoreBase<MapObject>> = {
        plane: this.planeStore,
        car: this.carStore,
    };

    private applyData(
        data: Partial<Record<StoreKey, MapObject[]>>,
        mode: "all" | "visible"
    ) {
        Object.entries(data).forEach(([key, items]) => {
            const store = this.stores[key as StoreKey];

            if (!store) return;

            if (mode === "all") {
                store.setAllMapObjects(items);
            } else {
                store.setVisibleMapObjects(items);
            }
        });
    }
    setAllData(data: Partial<Record<StoreKey, MapObject[]>>) {
      this.applyData(data,'all')
    }
    setVisibleData(data: Partial<Record<StoreKey, MapObject[]>>) {
       this.applyData(data,'visible')
    }

}
export const mapStore = new MapStore()