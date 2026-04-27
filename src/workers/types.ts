import type { MapObject } from "../models/MapObject";
import type { StoreKey } from "./workerStore/MapWorkerStore";



export type BBox = {
  west: number;
  east: number;
  south: number;
  north: number;
};

export type Message =
  | {
      type: "SET_MAP_OBJECTS";
      data: Partial<Record<StoreKey, MapObject[]>>
    }
  | {
      type: "VISIBLE_MAP_OBJECTS_RECALCULATE";
      bbox: BBox;
    }
  | {
      type: "RENAME_MAP_OBJECT";
      payload: {
        id: string;
        name: string;
        objectType: StoreKey;
      }
    };


export type BroadcastMessageMapObjects =
  | {
      message: "ALL_MAP_OBJECTS";
      data: Partial<Record<StoreKey, MapObject[]>>
    }
  | {
      message: "VISIBLE_MAP_OBJECTS";
      data: Partial<Record<StoreKey, MapObject[]>>;
    }
  | {
      message: "ON_RENAME_MAP_OBJECT";
      payload: { id: string; name: string; objectType: StoreKey };
    };