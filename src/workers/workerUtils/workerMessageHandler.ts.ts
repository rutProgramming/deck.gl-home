import { broadcastData } from "../BroadcastData"
import { mapWorkerStore, type ObjectType } from "../workerStore/MapWorkerStore"
import type { Message } from "../types"
import { getMapObjectsInBBox } from "./mapObjectsFilter"


const getAllMapObjects = (type: ObjectType) => {
    return Array.from(mapWorkerStore.getStore(type).getMapObjectsById().values())
}
const resolveTargets = (target: ObjectType | "all"): ObjectType[] => {
  return target === "all" ? ["car", "plane"] : [target];
};
export const handleMessage = (msg: Message) => {
    switch (msg.type) {
        case "SET_MAP_OBJECTS":
                mapWorkerStore.setMapObjects(msg.target, msg.data)
                broadcastData.broadcastData(msg.target,getAllMapObjects(msg.target), "ALL_MAP_OBJECTS")
            break

        case "VISIBLE_MAP_OBJECTS_RECALCULATE":
            const visibleMapObjectsTargets = resolveTargets(msg.target);
            visibleMapObjectsTargets.forEach((target) => {
                broadcastData.broadcastData(target,getMapObjectsInBBox(msg.bbox, mapWorkerStore.getStore(target).getMapObjectsById()), "VISIBLE_MAP_OBJECTS")
            })
            break

        case "RENAME_MAP_OBJECT":
            mapWorkerStore.getStore(msg.target).renameMapObject(msg.id, msg.name)
            broadcastData.broadcastData(msg.target,[{ id: msg.id, name: msg.name }], "ON_RENAME_MAP_OBJECT")
            break
    }
}
