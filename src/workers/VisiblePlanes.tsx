import type { Plane } from "../domain/plane.types";
import type { IPlaneWorker } from "./PlaneWorker";
import type { BBox } from "./worker.types";

export interface IVisiblePlanes {
    getPlanesInViewport(bbox: BBox, planesById: Map<string, Plane>): Plane[]
}

export class VisiblePlanes implements IVisiblePlanes {

    #checkPlaneInBBox(plane: Plane, bbox: BBox): boolean {
        return (
            plane.geoLocation.lon >= bbox.west &&
            plane.geoLocation.lon <= bbox.east &&
            plane.geoLocation.lat >= bbox.south &&
            plane.geoLocation.lat <= bbox.north
        )
    }
    getPlanesInViewport(bbox: BBox, planesById: Map<string, Plane>): Plane[] {
        const result: Plane[] = []
        for (const plane of planesById.values()) {
            if (this.#checkPlaneInBBox(plane, bbox)) {
                result.push(plane)
            }
        }
        return result
    }
    private static _instance: VisiblePlanes
    private constructor() {} 

    static getInstance() {
        if (!VisiblePlanes._instance) {
            VisiblePlanes._instance = new VisiblePlanes()
        }
        return VisiblePlanes._instance
    }
}