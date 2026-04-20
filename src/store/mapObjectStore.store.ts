import { makeAutoObservable } from "mobx";
import type { MapObject } from "../models/MapObject";

export class MapObjectsStore<T extends MapObject> {
  allMapObjectsById = new Map<string, T>()
  visibleMapObjects: T[] = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setVisibleMapObjects(MapObjects: T[]) {
    this.visibleMapObjects = MapObjects;
  }
  setAllMapObjects(MapObjects: T[]) {
    MapObjects.forEach(MapObject => this.allMapObjectsById.set(MapObject.id, MapObject));
  }
  renameMapObject(id: string, name: string) {
    const MapObject = this.allMapObjectsById.get(id)
    if (!MapObject) return;
    MapObject.name = name
    this.allMapObjectsById.set(id, MapObject)
  }

  get allMapObjects(): T[] {
    return Array.from(this.allMapObjectsById.values());
  }
}
