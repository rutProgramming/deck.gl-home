import type { IconLayer } from "@deck.gl/layers"
import type { RefObject } from "react"
import type { Plane } from "../../domain/plane.types"

export type ViewState = {
    longitude: number,
    latitude: number,
    zoom: number,
    bearing: number,
    pitch: number,
}

export type Props = {
    parent: RefObject<HTMLDivElement | null>,
    style: {
        position: string,
        top: string,
        left: string,
        zIndex: string,
        pointerEvents: string,
    },
    viewState: ViewState,
    controller: false,
    layers: [IconLayer<Plane, {}>],
}