import { DeckGlMaplibreglRenderer } from "./DeckGlMaplibreglRenderer";
import { createContext } from "react";
import type { BBox } from "../../workers/types";
import type { Layer } from "@deck.gl/core";

export interface IMapRenderer{
    attach(container: HTMLDivElement): void;
    renderLayers(layers:Layer[]): void;
    getBounds(): BBox | null
    onBoundsChange?: () => void
    cleanUp(): void;
    flyToLocation(lat: number, lon: number): void;
}

export const mapRenderer = new DeckGlMaplibreglRenderer();
export const MapRendererContext =
    createContext<IMapRenderer| null>(null);





