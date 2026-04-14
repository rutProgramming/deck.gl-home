import type { Plane } from "../planeUtils/plane.types";
import type { BBox } from "./types";



const checkPlaneInBBox = (plane: Plane, bbox: BBox): boolean => {
    return (
        plane.geoLocation.lon >= bbox.west &&
        plane.geoLocation.lon <= bbox.east &&
        plane.geoLocation.lat >= bbox.south &&
        plane.geoLocation.lat <= bbox.north
    )
}
export const getPlanesInBBox = (bbox: BBox, planesById: Map<string, Plane>): Plane[] => {
    const result: Plane[] = []
    for (const plane of planesById.values()) {
        if (checkPlaneInBBox(plane, bbox)) {
            result.push(plane)
        }
    }
    return result
}
