import { Deck } from "@deck.gl/core";
import type { RefObject } from "react";
import type { Props, ViewState } from "./RadarMap.type";
import type { IconLayer } from "@deck.gl/layers";
import type { Plane } from "../../domain/plane.types";
import type { IRadarMap } from "./IRadarMap";



export class RadarDeck implements IRadarMap{
    
    deck?: Deck
    constructor(mapContainerRef: RefObject<HTMLDivElement | null>, initialViewState: ViewState) {
        this.createLayer(mapContainerRef, initialViewState)
    }

    createLayer(mapContainerRef: RefObject<HTMLDivElement | null>, initialViewState: ViewState) {
        this.deck = new Deck({
            parent: mapContainerRef.current!,
            style: {
                position: "absolute",
                top: "0",
                left: "0",
                zIndex: "10",
                pointerEvents: "none",
            },
            initialViewState: initialViewState,
            controller: false,
            layers: [],
        });

    }

    setLayerProps(propName: 'viewState' | 'layers', props: Partial<Props>) {
        switch (propName) {
            case 'viewState':
                if ('viewState' in props && props.viewState)
                    this.#SetLayerViewState(props.viewState)
                break;
            case 'layers':
                if ('layers' in props && props.layers)
                    this.#SetLayerLayers(props.layers)
                break;
        }
    }
    #SetLayerViewState(viewState: ViewState) {
        this.deck?.setProps({
            viewState
        });
    }

    #SetLayerLayers(layers: [IconLayer<Plane, {}>]) {
        this.deck?.setProps({
            layers
        });

    }
    finalize() {
        this.deck?.finalize()
    }
}