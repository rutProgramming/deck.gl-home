import { makeAutoObservable } from "mobx";
import type { Plane } from "../planeUtils/plane.types";

export class PlanesStore {
  allPlanesById = new Map<string, Plane>()
  visiblePlanes: Plane[] = [];
  selectedPlaneId: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setVisiblePlanes(planes: Plane[]) {
    this.visiblePlanes = planes;
  }

  private clearSelectedPlaneIfMissing() {
    if (
      this.selectedPlaneId &&
      !this.allPlanesById.has(this.selectedPlaneId)
    ) {
      this.selectedPlaneId = null;
    }
  }
  setAllPlanes(planes: Plane[]) {
    planes.forEach(plane => this.allPlanesById.set(plane.id, plane));
    this.clearSelectedPlaneIfMissing();
  }

  selectPlane(id: string | null) {
    this.selectedPlaneId = id;
  }

  get selectedPlane(): Plane | null {
    if (!this.selectedPlaneId) return null;

    return (
      this.allPlanesById.get(this.selectedPlaneId) ?? null
    );
  }

  get allPlanes(): Plane[] {
    return Array.from(this.allPlanesById.values());
  }
}

export const planesStore = new PlanesStore();