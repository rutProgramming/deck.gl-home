import Worker from "../workers/worker.ts?sharedworker"
import type { MapObject } from "../models/MapObject"
import { mapStore, type ObjectType } from "../Store/Mapstore"
import type { Target } from "../workers/types"

type BBox = {
  west: number
  east: number
  south: number
  north: number
}

const worker = new Worker()
worker.port.start()

export function setMapObjects(mapObjects: MapObject[], target: Target) {
  worker.port.postMessage({
    type: "SET_MAP_OBJECTS",
    data: mapObjects,
    target
  })
}

export function visibleMapObjectsRecalculate(bbox: BBox, target: Target) {
  worker.port.postMessage({
    type: "VISIBLE_MAP_OBJECTS_RECALCULATE",
    bbox,
    target
  })
}

export function renameMapObject(id: string, name: string, target: ObjectType) {
  worker.port.postMessage({
    type: "RENAME_MAP_OBJECT",
    id,
    name,
    target
  })
}

worker.port.onmessage = (event) => {  
  const msg = event.data
  
  if (msg.message === "VISIBLE_MAP_OBJECTS") {    
    mapStore.getStore(msg.target).setVisibleMapObjects(msg.data)
  }

  if (msg.message === "ALL_MAP_OBJECTS") {
    mapStore.getStore(msg.target).setAllMapObjects(msg.data)
  }

  if (msg.message === "ON_RENAME_MAP_OBJECT") {
    mapStore.getStore(msg.target).renameMapObject(msg.data[0].id, msg.data[0].name)
  }

}