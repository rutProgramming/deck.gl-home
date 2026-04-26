

import { makeObservable, observable, action, computed } from "mobx";
import type { Plane } from "../models/Plane";
import { MapObjectsStoreBase } from "./mapObjectStoreBase";

export class PlaneStore extends MapObjectsStoreBase<Plane> {
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