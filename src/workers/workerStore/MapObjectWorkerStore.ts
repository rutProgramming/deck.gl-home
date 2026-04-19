import type { MapObject } from "../../models/MapObject"

export interface IMapObjectStore<T extends MapObject> {
    setMapObjects(data: T[]): void
    renameMapObject(id: string, name: string): void
    getMapObjectsById(): Map<string, T>
}
export class MapWorkerObjectStore<T extends MapObject> implements IMapObjectStore<T> {
    #mapObjectsById = new Map<string, T>()
   
    setMapObjects(mapObjects: T[]) {
        for (const obj of mapObjects) {
            this.#mapObjectsById.set(obj.id, obj)
        }
    }
    renameMapObject(id: string, name: string) {
        const obj = this.#mapObjectsById.get(id)
        if (obj) {
            obj.name = name
        }
    }
    getMapObjectsById(): Map<string, T> {
        return new Map(this.#mapObjectsById)
    }

}
