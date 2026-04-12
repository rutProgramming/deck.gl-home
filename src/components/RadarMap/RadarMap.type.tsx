import type { Plane } from "../../domain/plane.types";
import type { IconLayer } from "@deck.gl/layers";
export type ViewState = {
    longitude: number,
    latitude: number,
    zoom: number,
    bearing: number,
    pitch: number,
}


export type PlaneLayerFactory = (options: {
    data: Plane[];
    selectedId: string | null;
    onPickPlane: (id: string) => void;
}) => IconLayer<Plane, {}>;