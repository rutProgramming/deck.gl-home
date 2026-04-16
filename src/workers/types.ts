import type { MapObject } from "../models/MapObject"

export type BBox = {
  west: number
  east: number
  south: number
  north: number
}

export type Message =
  | { type: "SET_MAP_OBJECTS"; data: MapObject[] }
  | { type: "VISIBLE_MAP_OBJECTS_RECALCULATE"; bbox: BBox }
  | { type: "RENAME_MAP_OBJECT"; id: string; name: string }
