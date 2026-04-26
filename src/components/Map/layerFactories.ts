import { makeMapObjectIconLayer } from "../../layers/mapObjectsIconLayer";
import type { Car } from "../../models/Car";
import type { Plane } from "../../models/Plane";
import { countryToRgb } from "../../planeUtils/plane.color";
import plane from "../../assets/PM.png";
import car from "../../assets/car.png";

export const makeCarLayer = (data: Car[]) =>
    makeMapObjectIconLayer<Car>({
        id: "car-layer",
        data,
        iconAtlas: car,
    });

export const makePlaneLayer = (data: Plane[], selectedId: string | null, onPickItem: (id: string) => void) =>
    makeMapObjectIconLayer<Plane>({
        id: "plane-layer",
        data,
        selectedId,
        iconAtlas: plane,
        onPick: onPickItem,
        getAngle: (item) => item.heading ?? 0,
        getColor: (item) => countryToRgb(item.country),
    });


