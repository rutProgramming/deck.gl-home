// import { broadcastData } from "../BroadcastData"
import { mapWorkerStore } from "../workerStore/MapWorkerStore"
import type { Message } from "../types"
import { getMapObjectsInBBox } from "./mapObjectsFilter"
import { broadcastData } from "../BroadcastData"
import type { MapObject } from "../../models/MapObject"

export const handleMessage = (msg: Message) => {
    switch (msg.type) {
        case "SET_MAP_OBJECTS":
            mapWorkerStore.setAllData(msg.data)
            broadcastData.broadcastData({
                data: msg.data,
                message: "ALL_MAP_OBJECTS"
            })
            break

        case "VISIBLE_MAP_OBJECTS_RECALCULATE": {
            const result: Record<string, MapObject[]> = {};

            Object.entries(mapWorkerStore.stores).forEach(([key, store]) => {
                result[key] = getMapObjectsInBBox(
                    msg.bbox,
                    store.getMapObjectsById()
                );
            });

            broadcastData.broadcastData({
                data: result,
                message: "VISIBLE_MAP_OBJECTS"
            });

            break;
        }
        case "RENAME_MAP_OBJECT": {
            const { id, name, type } = msg.payload;
            

            const store = mapWorkerStore.stores[type];

            store.renameMapObject(id, name);

            broadcastData.broadcastData({
                payload: { id, name, type },
                message: "ON_RENAME_MAP_OBJECT"
            });

            break;
        }
    }
}
