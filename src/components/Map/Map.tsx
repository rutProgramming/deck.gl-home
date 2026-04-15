import { useContext, useEffect, useRef } from "react";
import { reaction } from "mobx";
import { MapRendererContext } from "./IMapRenderer";
import { planesStore } from "../../store/planes.store";
import { visiblePlanesRecalculate } from "../../services/workerClient";
import { Box } from "@mui/material";


export function Map() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRenderer = useContext(MapRendererContext);
    useEffect(() => {
        if (!mapContainerRef.current || !mapRenderer) {
            return;
        };
        mapRenderer.attach(mapContainerRef.current);
        const updateMapBounds = () => {
            const bounds = mapRenderer.getBounds();
            if (!bounds) return;
            visiblePlanesRecalculate({
                west: bounds.west,
                east: bounds.east,
                north: bounds.north,
                south: bounds.south,
            });
        };
        updateMapBounds();

        const disposeLayerReactionRef = reaction(
            () => ({ planes: planesStore.visiblePlanes, selectedId: planesStore.selectedPlaneId }),
            ({ planes, selectedId }) => {
                mapRenderer.renderItems(planes.length > 0 ? planes : [], selectedId)
            },
            { fireImmediately: true }
        );

        return () => {
            mapRenderer.cleanUp();
            disposeLayerReactionRef();
        };

    }, [mapContainerRef, mapRenderer]);

    return (
        <Box ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
    )
}

