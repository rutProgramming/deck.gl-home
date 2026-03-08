import { useEffect, useRef, type RefObject } from "react";
import { reaction } from "mobx";
import maplibregl, { Map } from "maplibre-gl";
import { planesStore } from "../../store/planes.store";
import { makePlanesIconLayer } from "../../layers/planesIconLayer";
import plane from "../../assets/PM.png";
import { Deck } from "@deck.gl/core";

const INITIAL_VIEW_STATE = {
    longitude: 34.85,
    latitude: 31.95,
    zoom: 6,
    bearing: 0,
    pitch: 0,
};


export function useRadarDeck(mapContainerRef: RefObject<HTMLDivElement | null>) {
    const mapRef = useRef<Map | null>(null);
    const deckRef = useRef<Deck | null>(null);
    const disposeReactionRef = useRef<null | (() => void)>(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${import.meta.env.VITE_REACT_KEY}`,
            center: [34.85, 31.95],
            zoom: 6,
            pitch: 0,
        });

        mapRef.current = map;

        const resizeObserver = new ResizeObserver(() => {
            map.resize();
        });

        resizeObserver.observe(mapContainerRef.current);

        map.on("load", () => {
            const deck = new Deck({
                parent: mapContainerRef.current!,
                style: { position: 'absolute', top: '0', left: '0', zIndex: '10', pointerEvents: 'none' },
                initialViewState: INITIAL_VIEW_STATE,
                controller: true,
                onViewStateChange: ({ viewState }) => {
                    map.jumpTo({
                        center: [viewState.longitude, viewState.latitude],
                        zoom: viewState.zoom,
                        bearing: viewState.bearing,
                        pitch: viewState.pitch
                    });
                },
                layers: [],
            });

            deckRef.current = deck;
            disposeReactionRef.current = reaction(
                () => ({
                    planes: planesStore.planesArray,
                    selectedId: planesStore.selectedPlaneId,
                }),
                ({ planes, selectedId }) => {
                    const layer = makePlanesIconLayer({
                        data: planes,
                        selectedId,
                        iconAtlas: plane,
                        onPickPlane: (id) => planesStore.selectPlane(id),
                    });

                    deck.setProps({ layers: [layer] });
                },
                { fireImmediately: true }
            );
        });

        return () => {
            disposeReactionRef.current?.();
            disposeReactionRef.current = null;

            deckRef.current?.finalize();
            deckRef.current = null;

            map.remove();
            mapRef.current = null;
            resizeObserver.disconnect();
        };
    }, [mapContainerRef]);


}