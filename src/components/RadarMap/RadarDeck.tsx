import { Deck } from "@deck.gl/core";
import type { ViewState } from "./RadarMap.type";
import type { IRadarLayer } from "./IRadarLayer";
import type { Plane } from "../../domain/plane.types";
import type { PlaneLayerFactory } from "./RadarMap.type";

export class RadarDeck implements IRadarLayer {
    private deck?: Deck;
    private readonly onPlaneClick: (id: string) => void;
    private readonly makeLayer: PlaneLayerFactory;

    constructor(onPlaneClick: (id: string) => void, makeLayer: PlaneLayerFactory) {        
        this.onPlaneClick = onPlaneClick;
        this.makeLayer = makeLayer;
    }

    attach(container: HTMLDivElement): void {
        this.deck = new Deck({
            parent: container,
            style: {
                position: "absolute",
                top: "0",
                left: "0",
                zIndex: "10",
                pointerEvents: "none",
            },
            controller: false,
            layers: [],
        });
    }

    setViewState(viewState: ViewState): void {
        this.deck?.setProps({ viewState });
    }

    renderPlanes(planes: Plane[], selectedId: string | null): void {
        const layer = this.makeLayer({ data: planes, selectedId, onPickPlane: this.onPlaneClick });
        this.deck?.setProps({ layers: [layer] });
    }

    finalize(): void {
        this.deck?.finalize();
    }
}