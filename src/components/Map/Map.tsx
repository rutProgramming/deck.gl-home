import { useContext, useEffect, useRef } from "react";
import { reaction } from "mobx";
import { MapRendererContext } from "./IMapRenderer";
import { Box } from "@mui/material";
import { visibleMapObjectsRecalculate } from "../../services/workerClient";
import { mapStore } from "../../Store/Mapstore";
import type { Target } from "../../workers/types";


export function Map() {
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


    useEffect(() => {
        if (!mapContainerRef.current || !mapRenderer) {
            return;
        };
        mapRenderer.onBoundsChange = updateMapBounds
        mapRenderer.attach(mapContainerRef.current);
        updateMapBounds();


        const disposeLayerReactionRef = reaction(
            () => ({
                layerData: mapStore.getLayerData(),
                selectedId: mapStore.selectedMapObjectId,
            }),
            ({layerData, selectedId}) => {
                mapRenderer.renderItems(layerData, selectedId);
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

