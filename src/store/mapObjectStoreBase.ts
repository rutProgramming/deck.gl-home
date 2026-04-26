import { makeObservable, observable, action, computed } from "mobx";
import type { MapObject } from "../models/MapObject";

export class MapObjectsStoreBase<T extends MapObject> {
  allMapObjectsById = new Map<string, T>();
  visibleMapObjects: T[] = [];


  constructor() {
    makeObservable(this, {
      allMapObjectsById: observable,
      visibleMapObjects: observable,

      setVisibleMapObjects: action,
      setAllMapObjects: action,
      renameMapObject: action,

      allMapObjects: computed,
    });
  }

  setVisibleMapObjects(MapObjects: T[]) {
    this.visibleMapObjects = MapObjects;
  }

  setAllMapObjects(MapObjects: T[]) {
    MapObjects.forEach(MapObject =>
      this.allMapObjectsById.set(MapObject.id, MapObject)
    );
  }

  renameMapObject(id: string, name: string) {
    const MapObject = this.allMapObjectsById.get(id);
    if (!MapObject) return;
    MapObject.name = name;
  }

  get allMapObjects(): T[] {
    return Array.from(this.allMapObjectsById.values());
  }
}