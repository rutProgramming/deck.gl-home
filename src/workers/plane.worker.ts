/// <reference lib="webworker" />

import type { Plane } from "../domain/plane.types"

export {}

declare const self: SharedWorkerGlobalScope

type BBox = {
  west: number
  east: number
  south: number
  north: number
}

type Message =
  | { type: "INGEST_PLANES"; planes: Plane[] }
  | { type: "QUERY_VIEWPORT"; bbox: BBox }
  | { type: "RENAME_PLANE"; id: string; name: string }

const planesById = new Map<string, Plane>()
const ports: MessagePort[] = []
let lastBbox: BBox | null = null

function ingestPlanes(planes: Plane[]) {
  for (const p of planes) {
    planesById.set(p.id, p)
  }
}

function queryViewport(bbox: BBox): Plane[] {
  const result: Plane[] = []
  for (const plane of planesById.values()) {
    if (
      plane.geoLocation.lon >= bbox.west &&
      plane.geoLocation.lon <= bbox.east &&
      plane.geoLocation.lat >= bbox.south &&
      plane.geoLocation.lat <= bbox.north
    ) {
      result.push(plane)
    }
  }
  return result
}

function renamePlane(id: string, name: string) {
  const plane = planesById.get(id)
  if (plane) {
    plane.name = name
  }
}

function broadcastAllPlanes() {
  const planes = Array.from(planesById.values())
  for (const port of ports) {
    port.postMessage({ type: "ALL_PLANES", planes })
  }
}

function broadcastVisiblePlanes() {
  if (!lastBbox) return
  const visible = queryViewport(lastBbox)
  for (const port of ports) {
    port.postMessage({ type: "VISIBLE_PLANES", planes: visible })
  }
}

self.onconnect = (event: MessageEvent) => {
  const port = event.ports[0]
  ports.push(port)
  port.start()

  port.onmessage = (event: MessageEvent<Message>) => {
    const msg = event.data

    switch (msg.type) {
      case "INGEST_PLANES":
        ingestPlanes(msg.planes)
        broadcastAllPlanes()
        broadcastVisiblePlanes()
        break

      case "QUERY_VIEWPORT":
        lastBbox = msg.bbox
        const visible = queryViewport(msg.bbox)
        port.postMessage({ type: "VISIBLE_PLANES", planes: visible })
        break

      case "RENAME_PLANE":
        renamePlane(msg.id, msg.name)
        broadcastAllPlanes()
        break
    }
  }
}