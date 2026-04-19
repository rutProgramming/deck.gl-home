import type { Car } from "../../models/Car";
import type { Plane } from "../../models/Plane";
import { MapWorkerObjectStore } from "./MapObjectWorkerStore";

export type ObjectType = "plane" | "car"
class MapWorkerStore {
    planeStore = new MapWorkerObjectStore<Plane>();
    carStore = new MapWorkerObjectStore<Car>();
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
    setMapObjects(type: ObjectType, data: Car[] | Plane[]) {
        switch (type) {
            case "plane":
                this.planeStore.setMapObjects(data as Plane[]);
                break;
            case "car":
                this.carStore.setMapObjects(data as Car[]);
                break;
            default:
                throw new Error(`Unknown object type: ${type}`);
        }
    }
}
export const mapWorkerStore = new MapWorkerStore()