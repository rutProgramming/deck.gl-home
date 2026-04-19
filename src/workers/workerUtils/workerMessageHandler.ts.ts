import { broadcastData } from "../BroadcastData"
import { mapObjectData } from "../MapObjectData"
import type { Message } from "../types"
import { getMapObjectsInBBox } from "./mapObjectsFilter"


const getAllMapObjects = () => {
    return Array.from(mapObjectData.getMapObjectsById().values())
}
export const handleMessage = (msg: Message) => {
    switch (msg.type) {
        case "SET_MAP_OBJECTS":
            mapObjectData.setMapObjects(msg.data)
            broadcastData.broadcastData(getAllMapObjects(), "ALL_MAP_OBJECTS")
            break

        case "VISIBLE_MAP_OBJECTS_RECALCULATE":
            broadcastData.broadcastData(getMapObjectsInBBox(msg.bbox, mapObjectData.getMapObjectsById()), "VISIBLE_MAP_OBJECTS")
            break

        case "RENAME_MAP_OBJECT":
            mapObjectData.renameMapObject(msg.id, msg.name)
            broadcastData.broadcastData(getAllMapObjects(), "ALL_MAP_OBJECTS")
            break
    }
}
