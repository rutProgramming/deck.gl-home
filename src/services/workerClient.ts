import Worker from "../workers/worker.ts?sharedworker"
import type { MapObject } from "../models/MapObject"
import type { StoreKey, WorkerMessage } from "./type"
import { mapStore } from "../store/mapstore"

type BBox = {
  west: number
  east: number
  south: number
  north: number
}

const worker = new Worker()
worker.port.start()

export function setMapObjects(mapObjects: Partial<Record<StoreKey, MapObject[]>>) {
  worker.port.postMessage({
    type: "SET_MAP_OBJECTS",
    data: mapObjects,
  })
}

export function visibleMapObjectsRecalculate(bbox: BBox) {
  worker.port.postMessage({
    type: "VISIBLE_MAP_OBJECTS_RECALCULATE",
    bbox,
  })
}

export function renameMapObject(id: string, name: string, type: StoreKey) {
  worker.port.postMessage({
    type: "RENAME_MAP_OBJECT",
    payload: {
      id,
      name,
      type
    },
  })
}

worker.port.onmessage = (event: MessageEvent<WorkerMessage>) => {
    const msg = event.data

  if (msg.message === "VISIBLE_MAP_OBJECTS") {
    mapStore.setVisibleData(msg.data)
  }

  if (msg.message === "ALL_MAP_OBJECTS") {
    mapStore.setAllData(msg.data)
  }

  if (msg.message === "ON_RENAME_MAP_OBJECT") {
    mapStore.stores[msg.payload.type].renameMapObject(
      msg.payload.id,
      msg.payload.name
    );
  }

}