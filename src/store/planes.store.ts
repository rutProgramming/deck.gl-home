import { makeAutoObservable } from "mobx";
import type { Plane } from "../domain/plane.types";

export class PlanesStore {
  planesById = new Map<string, Plane>();
  planeIds: string[] = [];
  selectedPlaneId: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  loadPlanes(planes: Plane[]) {
    this.planesById.clear();
    this.planeIds = [];

    for (const p of planes) {
      this.planesById.set(p.id, p);
      this.planeIds.push(p.id);
    }

    if (this.selectedPlaneId && !this.planesById.has(this.selectedPlaneId)) {
      this.selectedPlaneId = null;
    }
  }

  selectPlane(id: string | null) {
    if (!id) {
      this.selectedPlaneId = null;
      return;
    }
    this.selectedPlaneId = this.planesById.has(id) ? id : null;
  }

  updatePlane(id: string, nextName: string,country: string) {
    const p = this.planesById.get(id);
    if (!p) return;

    const name = nextName.trim() || "Unknown";
    
    this.planesById.set(id, { ...p, name ,country});
  }

  get planesArray(): Plane[] {
    return this.planeIds
      .map((id) => this.planesById.get(id))
      .filter((x): x is Plane => Boolean(x));
  }

  get selectedPlane(): Plane | null {
    if (!this.selectedPlaneId) return null;
    return this.planesById.get(this.selectedPlaneId) ?? null;
  }
}

export const planesStore = new PlanesStore();