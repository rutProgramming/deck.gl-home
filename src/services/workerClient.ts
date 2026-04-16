import Worker from "../workers/worker.ts?sharedworker"
import type { MapObject } from "../models/MapObject"
import { mapObjectsStore } from "../store/mapObjectStore.store"

type BBox = {
  west: number
  east: number
  south: number
  north: number
}

const worker = new Worker()
worker.port.start()

export function setMapObjects(mapObjects: MapObject[]) {
  worker.port.postMessage({
    type: "SET_MAP_OBJECTS",
    data: mapObjects
  })
}

export function visibleMapObjectsRecalculate(bbox: BBox) {
  
  worker.port.postMessage({
    type: "VISIBLE_MAP_OBJECTS_RECALCULATE",
    bbox
  })
}

export function renameMapObject(id: string, name: string) {
  worker.port.postMessage({
    type: "RENAME_MAP_OBJECT",
    id,
    name
  })
}

worker.port.onmessage = (event) => {  
  const msg = event.data
  
  if (msg.type === "VISIBLE_MAP_OBJECTS") {    
    mapObjectsStore.setVisibleMapObjects(msg.data)
  }

  if (msg.type === "ALL_MAP_OBJECTS") {
    mapObjectsStore.setAllMapObjects(msg.data)
  }

}