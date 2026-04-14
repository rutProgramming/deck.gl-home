import type { Plane } from "../../Plane/plane.types";
import type { IconLayer } from "@deck.gl/layers";
export type ViewState = {
    longitude: number,
    latitude: number,
    zoom: number,
    bearing: number,
    pitch: number,
}


export type DeckIconLayerFactory<T> = (options: {
    data: T[];
    selectedId: string | null;
    onPickItem: (id: string) => void;
}) => IconLayer<Plane, {}>;