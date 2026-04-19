import type { Layer } from "@deck.gl/core";
import type { LayerData } from "./IMapRenderer";

export type DeckIconLayerFactory<T> = (options: {
    data: T;
    selectedId: string | null;
    onPickItem: (id: string) => void;
}) => Layer[];

export type MapBounds = () => {
    west: number;
    east: number;
    south: number;
    north: number;
}