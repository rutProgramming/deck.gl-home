import { useContext, useEffect, useRef } from "react";
import { reaction } from "mobx";
import { MapRendererContext } from "./IMapRenderer";
import { Box } from "@mui/material";
import { visibleMapObjectsRecalculate } from "../../services/workerClient";
import { mapStore } from "../../store/mapstore";
import type { Target } from "../../workers/types";
import { makeCarLayer, makePlaneLayer } from "./layerFactories";


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

    function buildLayers() {
        return [
            makeCarLayer(mapStore.carStore.visibleMapObjects),

            makePlaneLayer(
                mapStore.planeStore.visibleMapObjects,
                mapStore.planeStore.selectedId,
                (id) => mapStore.planeStore.selectPlane(id)
            ),
        ];
    }


    useEffect(() => {
        if (!mapContainerRef.current || !mapRenderer) return;

        mapRenderer.onBoundsChange = updateMapBounds;
        mapRenderer.attach(mapContainerRef.current);
        updateMapBounds();


        const dispose = reaction(
            () => ({
                cars: mapStore.carStore.visibleMapObjects,
                planes: mapStore.planeStore.visibleMapObjects,
                selectedId: mapStore.planeStore.selectedId,
            }),
            () => {
                mapRenderer.renderLayers(buildLayers());
            },
            { fireImmediately: true }
        );

        return () => {
            mapRenderer.cleanUp();
            dispose();
        };


    }, [mapContainerRef, mapRenderer]);
    return <Box ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

}

