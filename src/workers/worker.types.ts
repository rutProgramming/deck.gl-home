import type { Plane } from "../domain/plane.types"

export type BBox = {
  west: number
  east: number
  south: number
  north: number
}

export type Message =
  | { type: "INGEST_PLANES"; planes: Plane[] }
  | { type: "GET_VISIBLE_PLANES"; bbox: BBox }
  | { type: "RENAME_PLANE"; id: string; name: string }
