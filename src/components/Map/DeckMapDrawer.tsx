import { Deck } from "@deck.gl/core";
import type { ViewState } from "./Map.type";
import type { IMapDrawer } from "./IMapDrawer";
import type { ItemLayerFactory } from "./Map.type";
import maplibregl from "maplibre-gl";


const INITIAL_VIEW_STATE = {
    longitude: 34.85,
    latitude: 31.95,
    zoom: 6,
    bearing: 0,
    pitch: 0,
};

export class DeckMapDrawer<T> implements IMapDrawer<T> {
    private deck?: Deck;
    private maplibreMap?: maplibregl.Map;
    private readonly onPlaneClick: (id: string) => void;
    private readonly makeLayer: ItemLayerFactory<T>;

    constructor(onPlaneClick: (id: string) => void, makeLayer: ItemLayerFactory<T>) {
        this.onPlaneClick = onPlaneClick;
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
                pointerEvents: "none",
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
            },
        });

    }

    setViewState(viewState: ViewState): void {
        this.deck?.setProps({ viewState });
    }
    
   flyToPlane = (lat: number, lon: number): void => {
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
        const layer = this.makeLayer({
            data,
            selectedId,
            onPickPlane: this.onPlaneClick
        });

        this.deck?.setProps({ layers: [layer] });
    }
    getMapInstance(): maplibregl.Map | undefined {
        return this.maplibreMap;
    }
    cleanUp(): void {
        this.deck?.finalize();
        this.maplibreMap?.remove();
    }
}

