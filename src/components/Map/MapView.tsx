import { useContext, useEffect, useRef } from "react";
import { reaction } from "mobx";
import { MapRendererContext } from "./IMapRenderer";
import { Box } from "@mui/material";
import { visibleMapObjectsRecalculate } from "../../services/workerClient";
import { mapStore } from "../../store/mapstore";
import type { Target } from "../../workers/types";
import { makeCarLayer, makePlaneLayer } from "./layerFactories";
import type { Layer } from "@deck.gl/core";


export function MapView() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRenderer = useContext(MapRendererContext);

    const targets: Target = 'all'
    const updateMapBounds = () => {
        if (!mapRenderer) return;
        const bounds = mapRenderer.getBounds();
        if (!bounds) return;

        visibleMapObjectsRecalculate({
            west: bounds.west,
            east: bounds.east,
            north: bounds.north,
            south: bounds.south,
        }, targets);

    };


    // useEffect(() => {
    //     if (!mapContainerRef.current || !mapRenderer) {
    //         return;
    //     };
    //     mapRenderer.onBoundsChange = updateMapBounds
    //     mapRenderer.attach(mapContainerRef.current);
    //     updateMapBounds();


    //     const disposeLayerReactionRef = reaction(
    //         () => ({
    //             layerData: mapStore.getLayerData(),
    //         }),
    //         ({layerData}) => {
    //             mapRenderer.renderItems(layerData);
    //         },
    //         { fireImmediately: true }
    //     );
    //     return () => {
    //         mapRenderer.cleanUp();
    //         disposeLayerReactionRef();
    //     };

    // }, [mapContainerRef, mapRenderer]);

    const layersRef = new Map<string, Layer>();

    useEffect(() => {
    if (!mapContainerRef.current || !mapRenderer) return;

    mapRenderer.onBoundsChange = updateMapBounds;
    mapRenderer.attach(mapContainerRef.current);
    updateMapBounds();


    const disposeCarReaction = reaction(
        () => mapStore.carStore.visibleMapObjects,
        (cars) => {
            layersRef.set("car-layer", makeCarLayer(cars));
            mapRenderer.renderLayers(Array.from(layersRef.values()));
        },
        { fireImmediately: true }
    );

    const disposePlaneReaction = reaction(
        () => ({
            planes: mapStore.planeStore.visibleMapObjects,
            selectedId: mapStore.planeStore.selectedId,
        }),
        ({ planes, selectedId }) => {
            layersRef.set("plane-layer", makePlaneLayer(
                planes,
                selectedId,
                (id) => mapStore.planeStore.selectPlane(id)
            ));
            mapRenderer.renderLayers(Array.from(layersRef.values()));
        },
        { fireImmediately: true }
    );

    return () => {
        mapRenderer.cleanUp();
        disposeCarReaction();
        disposePlaneReaction();
    };

}, [mapContainerRef, mapRenderer]);
    return <Box ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

}

