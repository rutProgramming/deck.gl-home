import type { MapObject } from "../models/MapObject";

export type StoreKey = "plane" | "car";

export type WorkerMessage =
  | {
      message: "VISIBLE_MAP_OBJECTS";
      data: Record<StoreKey, MapObject[]>;
    }
  | {
      message: "ALL_MAP_OBJECTS";
      data: Record<StoreKey, MapObject[]>;
    }
  | {
      message: "ON_RENAME_MAP_OBJECT";
      payload: {
        id: string;
        name: string;
        type: StoreKey;
      };
    };