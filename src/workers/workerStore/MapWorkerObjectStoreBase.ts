import type { MapObject } from "../../models/MapObject"

export interface IMapObjectStoreBase<T extends MapObject> {
    setMapObjects(data: T[]): void
    renameMapObject(id: string, name: string): void
    getMapObjectsById(): Map<string, T>
}
export class MapWorkerObjectStoreBase<T extends MapObject> implements IMapObjectStoreBase<T> {
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
