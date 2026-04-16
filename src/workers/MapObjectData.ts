import type { MapObject } from "../models/MapObject"

export interface IMapObjectData {
    setMapObjects(data: MapObject[]): void
    renameMapObject(id: string, name: string): void
    getMapObjectsById(): Map<string, MapObject>
}
class MapObjectData implements IMapObjectData {
    #mapObjectsById = new Map<string, MapObject>()
   
    setMapObjects(mapObjects: MapObject[]) {
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
    getMapObjectsById(): Map<string, MapObject> {
        return new Map(this.#mapObjectsById)
    }

}
export const mapObjectData = new MapObjectData()