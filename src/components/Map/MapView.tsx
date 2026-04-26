import { useContext, useEffect, useRef } from "react";
import { reaction } from "mobx";
import { MapRendererContext } from "./IMapRenderer";
import { Box } from "@mui/material";
import { visibleMapObjectsRecalculate } from "../../services/workerClient";
import { mapStore } from "../../store/mapstore";
import { buildLayers } from "./buildLayers";


export function MapView() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRenderer = useContext(MapRendererContext);

    const updateMapBounds = () => {
        if (!mapRenderer) return;
        const bounds = mapRenderer.getBounds();
        if (!bounds) return;

        visibleMapObjectsRecalculate({
            west: bounds.west,
            east: bounds.east,
            north: bounds.north,
            south: bounds.south,
        });

    };

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

