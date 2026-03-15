import { makeAutoObservable } from "mobx";
import type { Plane } from "../domain/plane.types";

export class PlanesStore {
  allPlanes: Plane[] = [];
  visiblePlanes: Plane[] = [];
  selectedPlaneId: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

   setVisiblePlanes(planes: Plane[]) {
    this.visiblePlanes = planes;
  }

  setAllPlanes(planes: Plane[]) {    
    this.allPlanes = planes;

    if (this.selectedPlaneId &&
        !planes.some(p => p.id === this.selectedPlaneId)) {
      this.selectedPlaneId = null;
    }
  }

  selectPlane(id: string | null) {
    this.selectedPlaneId = id;
  }

  get selectedPlane(): Plane | null {
    if (!this.selectedPlaneId) return null;

    return (
      this.allPlanes.find(p => p.id === this.selectedPlaneId) ?? null
    );
  }

}

export const planesStore = new PlanesStore();