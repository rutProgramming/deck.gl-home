import type { MapObject } from "../models/MapObject";

export type ObjectType = "car" | "plane";

export type Target = "all" | ObjectType;

export type BBox = {
  west: number;
  east: number;
  south: number;
  north: number;
};

export type Message =
  | {
      type: "SET_MAP_OBJECTS";
      data: MapObject[];
      target: ObjectType;
    }
  | {
      type: "VISIBLE_MAP_OBJECTS_RECALCULATE";
      bbox: BBox;
      target: Target;
    }
  | {
      type: "RENAME_MAP_OBJECT";
      id: string;
      name: string;
      target: ObjectType; 
    };