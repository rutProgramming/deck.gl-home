import { Deck } from "@deck.gl/core";
import type { DeckIconLayerFactory } from "./Map.type";
import type { IMapRenderer  } from "./IMapRenderer";
import maplibregl from "maplibre-gl";
import type { BBox } from "../../workers/types";


const INITIAL_VIEW_STATE = {
    longitude: 34.85,
    latitude: 31.95,
    zoom: 6,
    bearing: 0,
    pitch: 0,
};

export class DeckGlMaplibreglRenderer<T> implements IMapRenderer <T> {
    private deck?: Deck;
    private maplibreMap?: maplibregl.Map;
    private readonly onItemClick: (id: string) => void;
    private readonly makeLayer: DeckIconLayerFactory<T>;
    onBoundsChange?: () => void

    constructor(onItemClick: (id: string) => void, makeLayer: DeckIconLayerFactory<T>) {
        this.onItemClick = onItemClick;
        this.makeLayer = makeLayer;
    }

    attach(container: HTMLDivElement): void {
        this.maplibreMap = new maplibregl.Map({
            container,
            style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${import.meta.env.VITE_REACT_KEY}`,
            center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
            zoom: INITIAL_VIEW_STATE.zoom,
            pitch: INITIAL_VIEW_STATE.pitch,
            bearing: INITIAL_VIEW_STATE.bearing,
            interactive: false,
        });
        this.deck = new Deck({
            parent: container,
            style: {
                position: "absolute",
                top: "0",
                left: "0",
                zIndex: "10",
            },
            initialViewState: INITIAL_VIEW_STATE,
            controller: true,
            layers: [],
            onViewStateChange: ({ viewState }) => {
                this.deck?.setProps({ viewState });
                this.maplibreMap?.jumpTo({
                    center: [viewState.longitude, viewState.latitude],
                    zoom: viewState.zoom,
                    bearing: viewState.bearing,
                    pitch: viewState.pitch,
                });
                this.onBoundsChange?.()
            },
        });

    }

    getBounds(): BBox | null {
    if (!this.maplibreMap) {
        return null
    }

    const bounds = this.maplibreMap.getBounds();

    return {
        west: bounds.getWest(),
        east: bounds.getEast(),
        north: bounds.getNorth(),
        south: bounds.getSouth()
    };
}
   flyToLocation = (lat: number, lon: number): void => {
    if (!this.maplibreMap || !this.deck) return;

    const bounds = this.maplibreMap.getBounds();
    const visible = lon >= bounds.getWest() && lon <= bounds.getEast()
        && lat >= bounds.getSouth() && lat <= bounds.getNorth();

    if (!visible) {
        this.deck.setProps({
            viewState: {
                longitude: lon,
                latitude: lat,
                zoom: Math.max(this.maplibreMap.getZoom(), 8),
                bearing: 0,
                pitch: 0,
                transitionDuration: 800,
            }
        });
    }
};
    renderItems(data: T[], selectedId: string | null): void {        
        const layers = this.makeLayer({
            data,
            selectedId,
            onPickItem: this.onItemClick
        });

        this.deck?.setProps({ layers: layers });
    }
   
    cleanUp(): void {
        this.deck?.finalize();
        this.maplibreMap?.remove();
    }
}

