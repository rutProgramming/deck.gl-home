import { makeAutoObservable } from "mobx";
import type { MapObject } from "../models/MapObject";

export class MapObjectsStore<T extends MapObject> {
  allMapObjectsById = new Map<string, T>()
  visibleMapObjects: T[] = [];
  selectedMapObjectId: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setVisibleMapObjects(MapObjects: T[]) {
    this.visibleMapObjects = MapObjects;
  }

  private clearSelectedMapObjectIfMissing() {
    if (
      this.selectedMapObjectId &&
      !this.allMapObjectsById.has(this.selectedMapObjectId)
    ) {
      this.selectedMapObjectId = null;
    }
  }
  setAllMapObjects(MapObjects: T[]) {
    MapObjects.forEach(MapObject => this.allMapObjectsById.set(MapObject.id, MapObject));
    this.clearSelectedMapObjectIfMissing();
  }

  selectMapObject(id: string | null) {
    this.selectedMapObjectId = id;
  }

  get selectedMapObject(): T | null {
    if (!this.selectedMapObjectId) return null;

    return (
      this.allMapObjectsById.get(this.selectedMapObjectId) ?? null
    );
  }

  get allMapObjects(): T[] {
    return Array.from(this.allMapObjectsById.values());
  }
}

export const mapObjectsStore = new MapObjectsStore<MapObject>();