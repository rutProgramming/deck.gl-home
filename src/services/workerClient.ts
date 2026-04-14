import PlaneWorker from "../workers/plane.worker.ts?sharedworker"
import type { Plane } from "../planeUtils/plane.types"
import { planesStore } from "../store/planes.store"

type BBox = {
  west: number
  east: number
  south: number
  north: number
}

const worker = new PlaneWorker()
worker.port.start()

export function setPlanes(planes: Plane[]) {
  worker.port.postMessage({
    type: "SET_PLANES",
    planes
  })
}

export function visiblePlanesRecalculate(bbox: BBox) {
  worker.port.postMessage({
    type: "VISIBLE_PLANES_RECALCULATE",
    bbox
  })
}

export function renamePlane(id: string, name: string) {
  worker.port.postMessage({
    type: "RENAME_PLANE",
    id,
    name
  })
}

worker.port.onmessage = (event) => {  
  const msg = event.data
  
  if (msg.type === "VISIBLE_PLANES") {    
    planesStore.setVisiblePlanes(msg.data)
  }

  if (msg.type === "ALL_PLANES") {
    planesStore.setAllPlanes(msg.data)
  }

}