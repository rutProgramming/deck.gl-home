import PlaneWorker from "../workers/plane.worker.ts?sharedworker"
import type { Plane } from "../domain/plane.types"
import { planesStore } from "../store/planes.store"

type BBox = {
  west: number
  east: number
  south: number
  north: number
}

const worker = new PlaneWorker()
worker.port.start()

export function ingestPlanes(planes: Plane[]) {
  worker.port.postMessage({
    type: "INGEST_PLANES",
    planes
  })
}

export function queryViewport(bbox: BBox) {
  worker.port.postMessage({
    type: "QUERY_VIEWPORT",
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
    planesStore.setVisiblePlanes(msg.planes)
  }

  if (msg.type === "ALL_PLANES") {
    planesStore.setAllPlanes(msg.planes)
  }

}