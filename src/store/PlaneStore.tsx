// import { makeAutoObservable } from "mobx";
// import { MapObjectsStore } from "./mapObjectStore.store";
// import type { Plane } from "../models/Plane";

// export class PlaneStore extends MapObjectsStore<Plane> {
//     selectedId: string | null = null;

//     constructor() {
//         super();
//         makeAutoObservable(this, {}, { autoBind: true });
//     }

//     selectPlane(id: string | null) {
//         this.selectedId = id;
//     }

//     get selectedPlane(): Plane | null {
//         return this.allMapObjectsById.get(this.selectedId!) ?? null;
//     }
// }

import { makeObservable, observable, action, computed } from "mobx";
import { MapObjectsStore } from "./mapObjectStore.store";
import type { Plane } from "../models/Plane";

export class PlaneStore extends MapObjectsStore<Plane> {
  selectedId: string | null = null;

  constructor() {
    super();

    makeObservable(this, {
      selectedId: observable,
      selectPlane: action,
      selectedPlane: computed,
    });
  }

  selectPlane(id: string | null) {
    this.selectedId = id;
  }

  get selectedPlane(): Plane | null {
    if (this.selectedId === null) return null;
    return this.allMapObjectsById.get(this.selectedId) ?? null;
  }
}