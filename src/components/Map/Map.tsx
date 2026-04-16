import { useContext, useEffect, useRef } from "react";
import { reaction } from "mobx";
import { MapRendererContext } from "./IMapRenderer";
import { Box } from "@mui/material";
import { visibleMapObjectsRecalculate } from "../../services/workerClient";
import { mapObjectsStore } from "../../store/mapObjectStore.store";


export function Map() {
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
        if (!mapContainerRef.current || !mapRenderer) {
            return;
        };
        mapRenderer.attach(mapContainerRef.current);
        mapRenderer.onBoundsChange = updateMapBounds 
        updateMapBounds();

        const disposeLayerReactionRef = reaction(
            () => ({ mapObjects: mapObjectsStore.visibleMapObjects, selectedId: mapObjectsStore.selectedMapObjectId }),
            ({ mapObjects, selectedId }) => {
                mapRenderer.renderItems(mapObjects, selectedId)
            },
            { fireImmediately: true }
        );

        return () => {
            mapRenderer.cleanUp();
            disposeLayerReactionRef();
        };

    }, [mapContainerRef, mapRenderer]);

    return <Box ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

}

