import type { Plane } from "../planeUtils/plane.types"

export type BBox = {
  west: number
  east: number
  south: number
  north: number
}

export type Message =
  | { type: "SET_PLANES"; planes: Plane[] }
  | { type: "VISIBLE_PLANES_RECALCULATE"; bbox: BBox }
  | { type: "RENAME_PLANE"; id: string; name: string }
