import type { MapObject } from "../../models/MapObject";
import type { BBox } from "../types";

const checkMapObjectsInBBox = (MapObject: MapObject, bbox: BBox): boolean => {
    return (
        MapObject.geoLocation.lon >= bbox.west &&
        MapObject.geoLocation.lon <= bbox.east &&
        MapObject.geoLocation.lat >= bbox.south &&
        MapObject.geoLocation.lat <= bbox.north
    )
}
export const getMapObjectsInBBox = (bbox: BBox, MapObjectsById: Map<string, MapObject>): MapObject[] => {
    const result: MapObject[] = []
    for (const MapObject of MapObjectsById.values()) {
        if (checkMapObjectsInBBox(MapObject, bbox)) {
            result.push(MapObject)
        }
    }
    return result
}
