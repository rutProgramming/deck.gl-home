import type { Layer } from "@deck.gl/core";
import type { IconLayer } from "@deck.gl/layers";
export type ViewState = {
    longitude: number,
    latitude: number,
    zoom: number,
    bearing: number,
    pitch: number,
}


// export type DeckIconLayerFactory<T> = (options: {
//     data: T[];
//     selectedId: string | null;
//     onPickItem: (id: string) => void;
// }) => IconLayer<T, {}>;
export type DeckIconLayerFactory<T> = (options: {
    data: T[];
    selectedId: string | null;
    onPickItem: (id: string) => void;
}) => Layer[];

export type MapBounds = () => {
    west: number;
    east: number;
    south: number;
    north: number;
}